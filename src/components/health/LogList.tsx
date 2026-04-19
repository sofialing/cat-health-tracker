interface LogItem {
  id: string;
  primary: string;
  secondary?: string;
  date: string;
}

interface LogListProps {
  items: LogItem[];
  emptyMessage?: string;
}

export function LogList({
  items,
  emptyMessage = "No entries yet.",
}: LogListProps) {
  if (items.length === 0) {
    return (
      <p className="text-sm text-muted-foreground text-center py-8">
        {emptyMessage}
      </p>
    );
  }

  return (
    <div className="space-y-2">
      {items.map((item) => (
        <div
          key={item.id}
          className="flex items-start justify-between gap-3 p-3 rounded-xl border bg-card"
        >
          <div className="flex-1 min-w-0">
            <p className="font-medium text-sm">{item.primary}</p>
            {item.secondary && (
              <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
                {item.secondary}
              </p>
            )}
          </div>
          <p className="text-xs text-muted-foreground flex-shrink-0">
            {item.date}
          </p>
        </div>
      ))}
    </div>
  );
}
