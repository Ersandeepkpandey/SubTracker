import { Request, Response, NextFunction } from "express";
import { jwtVerify } from "jose";

export interface AuthRequest extends Request {
  userId?: string;
  userEmail?: string;
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
    const secret = new TextEncoder().encode(process.env.NEXTAUTH_SECRET!);
    const { payload } = await jwtVerify(token, secret);
    req.userId = payload.sub as string;
    req.userEmail = payload.email as string;
    next();
  } catch {
    res.status(401).json({ error: "Invalid or expired token" });
  }
}
