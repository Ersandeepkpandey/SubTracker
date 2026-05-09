import { Response } from "express";
import { prisma } from "@subtrack/db";
import { AuthRequest } from "../middleware/auth.middleware";
import { syncUserGmail } from "../services/gmail.service";

export async function connectGmail(req: AuthRequest, res: Response) {
  const { accessToken, refreshToken } = req.body;
  if (!accessToken) {
    res.status(400).json({ error: "accessToken is required" });
    return;
  }

  await prisma.user.update({
    where: { id: req.userId! },
    data: {
      gmailToken: { accessToken, refreshToken },
      gmailConnected: true,
    },
  });

  res.json({ connected: true });
}

export async function syncGmail(req: AuthRequest, res: Response) {
  const user = await prisma.user.findUnique({
    where: { id: req.userId! },
    select: { gmailToken: true, gmailConnected: true },
  });

  if (!user?.gmailConnected || !user.gmailToken) {
    res.status(400).json({ error: "Gmail not connected" });
    return;
  }

  const result = await syncUserGmail(req.userId!, user.gmailToken as { accessToken: string; refreshToken: string });
  res.json(result);
}

export async function getGmailStatus(req: AuthRequest, res: Response) {
  const user = await prisma.user.findUnique({
    where: { id: req.userId! },
    select: { gmailConnected: true },
  });

  const lastSync = await prisma.gmailSyncLog.findFirst({
    where: { userId: req.userId! },
    orderBy: { syncedAt: "desc" },
  });

  res.json({
    connected: user?.gmailConnected ?? false,
    lastSync: lastSync?.syncedAt ?? null,
    lastSyncStatus: lastSync?.status ?? null,
  });
}

export async function disconnectGmail(req: AuthRequest, res: Response) {
  await prisma.user.update({
    where: { id: req.userId! },
    data: { gmailToken: undefined, gmailConnected: false },
  });
  res.json({ connected: false });
}
