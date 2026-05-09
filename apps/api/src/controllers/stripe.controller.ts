import { Request, Response } from "express";
import { prisma } from "@subtrack/db";
import { AuthRequest } from "../middleware/auth.middleware";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-04-10",
});

export async function createCheckoutSession(req: AuthRequest, res: Response) {
  const user = await prisma.user.findUnique({ where: { id: req.userId! } });
  if (!user) {
    res.status(404).json({ error: "User not found" });
    return;
  }

  let customerId = user.stripeCustomerId;
  if (!customerId) {
    const customer = await stripe.customers.create({
      email: user.email,
      name: user.name ?? undefined,
    });
    customerId = customer.id;
    await prisma.user.update({
      where: { id: req.userId! },
      data: { stripeCustomerId: customerId },
    });
  }

  const session = await stripe.checkout.sessions.create({
    customer: customerId,
    payment_method_types: ["card"],
    line_items: [{ price: process.env.STRIPE_PRO_PRICE_ID!, quantity: 1 }],
    mode: "subscription",
    success_url: `${process.env.WEB_URL}/settings?payment=success`,
    cancel_url: `${process.env.WEB_URL}/settings?payment=cancelled`,
  });

  res.json({ url: session.url });
}

export async function getPortalSession(req: AuthRequest, res: Response) {
  const user = await prisma.user.findUnique({ where: { id: req.userId! } });
  if (!user?.stripeCustomerId) {
    res.status(400).json({ error: "No billing account found" });
    return;
  }

  const session = await stripe.billingPortal.sessions.create({
    customer: user.stripeCustomerId,
    return_url: `${process.env.WEB_URL}/settings`,
  });

  res.json({ url: session.url });
}

export async function handleWebhook(req: Request, res: Response) {
  const sig = req.headers["stripe-signature"]!;

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch {
    res.status(400).json({ error: "Webhook signature verification failed" });
    return;
  }

  switch (event.type) {
    case "customer.subscription.created":
    case "customer.subscription.updated": {
      const sub = event.data.object as Stripe.Subscription;
      const customer = sub.customer as string;
      await prisma.user.updateMany({
        where: { stripeCustomerId: customer },
        data: {
          subscriptionStatus:
            sub.status === "active" ? "active" : "trial",
        },
      });
      break;
    }
    case "customer.subscription.deleted": {
      const sub = event.data.object as Stripe.Subscription;
      const customer = sub.customer as string;
      await prisma.user.updateMany({
        where: { stripeCustomerId: customer },
        data: { subscriptionStatus: "cancelled" },
      });
      break;
    }
  }

  res.json({ received: true });
}
