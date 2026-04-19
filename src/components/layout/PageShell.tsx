interface PageShellProps {
  title?: string;
  children: React.ReactNode;
}

export function PageShell({ title, children }: PageShellProps) {
  return (
    <div className="flex flex-col min-h-full">
      {title && (
        <header className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur-md px-4 h-14 flex items-center">
          <h1 className="text-lg font-semibold">{title}</h1>
        </header>
      )}
      <main className="flex-1 px-4 py-4 pb-20 lg:pb-6 space-y-3">
        {children}
      </main>
    </div>
  );
}
