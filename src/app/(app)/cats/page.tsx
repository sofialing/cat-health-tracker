import Link from "next/link";
import Image from "next/image";
import { getCats } from "@/lib/actions/cats";
import { PageShell } from "@/components/layout/PageShell";
import { Button } from "@/components/ui/button";
import { calculateAge } from "@/lib/utils";
import { PlusCircle, ChevronRight, Cat } from "lucide-react";

export default async function CatsPage() {
  const cats = await getCats();
  return (
    <PageShell title="My Cats">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {cats.map((cat) => {
          const age = calculateAge(cat.birthday);
          return (
            <Link
              key={cat.id}
              href={`/cats/${cat.id}`}
              className="flex items-center gap-3 p-3 rounded-2xl border bg-card hover:bg-muted/40 transition-colors shadow-sm"
            >
              <div className="relative size-12 rounded-xl overflow-hidden bg-muted flex-shrink-0 flex items-center justify-center">
                {cat.profilePicture ? (
                  <Image
                    src={cat.profilePicture}
                    alt={cat.name}
                    fill
                    sizes="48px"
                    className="object-cover"
                  />
                ) : (
                  <Cat className="size-5 text-muted-foreground" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold">{cat.name}</p>
                <p className="text-sm text-muted-foreground">{age.label} old</p>
              </div>
              <ChevronRight className="size-4 text-muted-foreground flex-shrink-0" />
            </Link>
          );
        })}
      </div>

      {cats.length === 0 && (
        <div className="text-center py-12">
          <Cat className="size-12 text-muted-foreground mx-auto mb-3" />
          <p className="font-semibold mb-1">No cats yet</p>
          <p className="text-sm text-muted-foreground">
            Add your first cat below
          </p>
        </div>
      )}

      <Button asChild className="w-full mt-2">
        <Link href="/cats/new">
          <PlusCircle className="size-4 mr-2" />
          Add a cat
        </Link>
      </Button>
    </PageShell>
  );
}
