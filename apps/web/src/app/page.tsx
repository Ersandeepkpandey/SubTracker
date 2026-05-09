import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Shield, Bell, Zap } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Nav */}
      <nav className="border-b border-gray-100 bg-white">
        <div className="max-w-content mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-teal rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">S</span>
            </div>
            <span className="font-bold text-lg">SubTrack</span>
          </div>
          <Link href="/login">
            <Button size="sm">Start free trial</Button>
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-content mx-auto px-6 py-24 text-center">
        <h1 className="text-5xl font-bold text-text-primary leading-tight mb-6">
          Never miss a subscription<br />renewal again.
        </h1>
        <p className="text-xl text-gray-500 mb-10 max-w-xl mx-auto">
          Connect Gmail. See every subscription. Get reminded before you&apos;re charged.
        </p>
        <Link href="/login">
          <Button size="lg" className="text-lg px-10">
            Start your 14-day free trial
          </Button>
        </Link>
        <p className="text-sm text-gray-400 mt-4">No credit card required. Full access for 14 days.</p>
      </section>

      {/* Features */}
      <section className="max-w-content mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="w-12 h-12 bg-teal-50 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Zap size={24} className="text-teal" />
            </div>
            <h3 className="font-semibold text-lg mb-2">Auto-detect from Gmail</h3>
            <p className="text-gray-500 text-sm">Connect Gmail and SubTrack automatically finds every subscription from your email receipts.</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-teal-50 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Bell size={24} className="text-teal" />
            </div>
            <h3 className="font-semibold text-lg mb-2">Renewal reminders</h3>
            <p className="text-gray-500 text-sm">Get notified 3 days and 1 day before every renewal. Never be surprised by a charge again.</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-teal-50 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Shield size={24} className="text-teal" />
            </div>
            <h3 className="font-semibold text-lg mb-2">Privacy first</h3>
            <p className="text-gray-500 text-sm">Gmail access is readonly. SubTrack only reads email headers to detect subscriptions — never the content.</p>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="bg-white border-y border-gray-100 py-16">
        <div className="max-w-content mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-12">How it works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { step: "1", title: "Connect", desc: "Sign in with Google and connect Gmail in one click." },
              { step: "2", title: "Detect", desc: "SubTrack scans your inbox and finds all active subscriptions automatically." },
              { step: "3", title: "Get reminded", desc: "Receive email and push reminders before every renewal." },
            ].map(({ step, title, desc }) => (
              <div key={step} className="flex flex-col items-center">
                <div className="w-10 h-10 bg-teal rounded-full flex items-center justify-center text-white font-bold mb-4">{step}</div>
                <h3 className="font-semibold text-lg mb-2">{title}</h3>
                <p className="text-gray-500 text-sm">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="max-w-content mx-auto px-6 py-16 text-center" id="pricing">
        <h2 className="text-3xl font-bold mb-4">Simple pricing</h2>
        <p className="text-gray-500 mb-10">14-day free trial. Then one plan. No feature walls.</p>
        <div className="max-w-sm mx-auto bg-white rounded-card border border-gray-100 shadow-sm p-8">
          <p className="font-semibold text-lg mb-1">Pro Plan</p>
          <p className="text-4xl font-bold mb-1">₹299<span className="text-lg font-normal text-gray-400">/month</span></p>
          <p className="text-gray-400 text-sm mb-6">or ₹2,499/year (save ₹1,089)</p>
          <ul className="text-sm text-left space-y-2 mb-8">
            {["Gmail auto-detection", "Unlimited subscriptions", "Email + push reminders", "AI spending insights", "Cancellation guides"].map((f) => (
              <li key={f} className="flex items-center gap-2">
                <span className="text-teal">✓</span>
                {f}
              </li>
            ))}
          </ul>
          <Link href="/login">
            <Button size="lg" className="w-full">Start free trial</Button>
          </Link>
        </div>
      </section>

      {/* FAQ */}
      <section className="max-w-content mx-auto px-6 pb-16">
        <h2 className="text-2xl font-bold text-center mb-8">FAQ</h2>
        <div className="max-w-2xl mx-auto space-y-4">
          {[
            { q: "Is my Gmail data safe?", a: "Yes. SubTrack only reads email headers (sender, subject, date) to detect subscriptions. Email body content is never read or stored." },
            { q: "Do I need a credit card for the trial?", a: "No. The 14-day trial is completely free with no credit card required." },
            { q: "Can I add subscriptions manually?", a: "Yes. You can manually add any subscription with custom amount, billing cycle, and renewal date." },
            { q: "What happens after the trial?", a: "You can subscribe for ₹299/month. Your data is always safe — you can export it anytime." },
            { q: "Can I cancel anytime?", a: "Yes. Cancel anytime from settings. No questions asked." },
          ].map(({ q, a }) => (
            <div key={q} className="bg-white rounded-card border border-gray-100 p-5">
              <p className="font-semibold text-sm mb-2">{q}</p>
              <p className="text-gray-500 text-sm">{a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-100 bg-white py-8">
        <div className="max-w-content mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-gray-400">
          <p>© 2026 SubTrack. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="/privacy" className="hover:text-gray-600">Privacy</a>
            <a href="/terms" className="hover:text-gray-600">Terms</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
