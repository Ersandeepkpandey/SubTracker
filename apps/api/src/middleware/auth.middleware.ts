import { Request, Response, NextFunction } from "express";
import { jwtDecrypt } from "jose";
import { hkdf } from "@panva/hkdf";

export interface AuthRequest extends Request {
  userId?: string;
  userEmail?: string;
}

async function getEncryptionKey(secret: string) {
  return hkdf("sha256", secret, "", "NextAuth.js Generated Encryption Key", 32);
}

export async function authMiddleware(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  const token = req.headers.authorization?.replace("Bearer ", "");
  if (!token) {
    res.status(401).json({ error: "No token provided" });
    return;
  }

  try {
    const key = await getEncryptionKey(process.env.NEXTAUTH_SECRET!);
    const { payload } = await jwtDecrypt(token, key);
    req.userId = (payload.userId ?? payload.sub) as string;
    req.userEmail = payload.email as string;
    next();
  } catch {
    res.status(401).json({ error: "Invalid or expired token" });
  }
}
