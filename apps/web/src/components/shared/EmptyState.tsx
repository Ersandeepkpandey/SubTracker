import { Button } from "@/components/ui/button";
import Link from "next/link";

interface EmptyStateProps {
  message: string;
  ctaLabel?: string;
  ctaHref?: string;
}

export function EmptyState({ message, ctaLabel, ctaHref }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="mb-4 text-5xl">📭</div>
      <p className="text-gray-500 mb-4">{message}</p>
      {ctaLabel && ctaHref && (
        <Link href={ctaHref}>
          <Button size="sm">{ctaLabel}</Button>
        </Link>
      )}
    </div>
  );
}
