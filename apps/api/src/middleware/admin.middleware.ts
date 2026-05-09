import { Request, Response, NextFunction } from "express";
import { prisma } from "@subtrack/db";
import { jwtVerify } from "jose";

export async function adminMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  // Allow explicit admin key for server-to-server calls
  const adminKey = req.headers["x-admin-key"];
  if (adminKey && adminKey === process.env.ADMIN_SECRET) {
    next();
    return;
  }

  // Also allow logged-in users with isAdmin = true
  const token = req.headers.authorization?.replace("Bearer ", "");
  if (token) {
    try {
      const secret = new TextEncoder().encode(process.env.NEXTAUTH_SECRET!);
      const { payload } = await jwtVerify(token, secret);
      const userId = payload.sub as string;
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { isAdmin: true },
      });
      if (user?.isAdmin) {
        next();
        return;
      }
    } catch {
      // fall through to 403
    }
  }

  res.status(403).json({ error: "Admin access required" });
}
