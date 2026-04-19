import { Cat } from "lucide-react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4">
      <div className="mb-6 text-center">
        <div className="inline-flex items-center justify-center size-16 rounded-2xl bg-primary text-white shadow-lg mb-3">
          <Cat className="size-8 text-white" />
        </div>
        <h1 className="text-xl font-bold">PurrTrack</h1>
        <p className="text-sm text-muted-foreground">
          Cat health, tracked with love
        </p>
      </div>
      <div className="w-full max-w-sm">{children}</div>
    </div>
  );
}
