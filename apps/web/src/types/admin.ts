export type OverviewData = {
  totalUsers: number;
  usersByStatus: { trial: number; active: number; expired: number; cancelled: number };
  newUsersToday: number;
  newUsersThisWeek: number;
  newUsersThisMonth: number;
  gmailConnected: number;
  totalSubscriptions: number;
  activeSubscriptions: number;
  subscriptionsBySource: { manual: number; gmail: number };
  subscriptionsByCategory: Array<{ category: string; count: number }>;
  mrr: number;
  notificationStats: { pending: number; sent: number; failed: number };
  pushDevices: number;
  recentSignups: Array<{ date: string; count: number }>;
};

export type AdminUser = {
  id: string;
  name: string | null;
  email: string;
  image: string | null;
  subscriptionStatus: string;
  gmailConnected: boolean;
  onboardingDone: boolean;
  createdAt: string;
  trialStartedAt: string | null;
  trialEndsAt: string | null;
  _count: { subscriptions: number; pushDevices: number };
};

export type AdminSub = {
  id: string;
  serviceName: string;
  category: string;
  amount: string;
  currency: string;
  billingCycle: string;
  renewalDate: string;
  source: string;
  isActive: boolean;
  createdAt: string;
  user: { email: string; name: string | null };
};

export type SyncLog = {
  id: string;
  syncedAt: string;
  emailsScanned: number;
  subscriptionsFound: number;
  status: string;
  errorMessage: string | null;
  user: { email: string };
};

export type AdminNotif = {
  id: string;
  notificationType: string;
  status: string;
  sentAt: string | null;
  createdAt: string;
  reminderDays: number;
  subscription: { serviceName: string };
  user: { email: string };
};
