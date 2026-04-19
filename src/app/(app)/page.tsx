import Link from "next/link";
import { Suspense } from "react";
import { PlusCircle, Cat } from "lucide-react";
import { getCats } from "@/lib/actions/cats";
import { CatCardContainer } from "@/components/cats/CatCardContainer";
import { CatCardSkeleton } from "@/components/cats/SkeletonLoaders";
import { Button } from "@/components/ui/button";

export default async function DashboardPage() {
  const cats = await getCats();

  return (
    <div className="flex flex-col min-h-full">
      {/* Header */}
      <div className="px-4 pt-8 pb-6">
        <p className="text-sm text-muted-foreground font-medium mb-1">
          Welcome back 👋
        </p>
        <h1 className="text-2xl font-bold">Your cats</h1>
      </div>

      <div className="flex-1 px-4 py-4 pb-20 lg:pb-6 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {cats.map((cat) => (
            <Suspense key={cat.id} fallback={<CatCardSkeleton />}>
              <CatCardContainer cat={cat} />
            </Suspense>
          ))}
        </div>

        {cats.length === 0 && (
          <div className="text-center py-16">
            <Cat className="size-12 text-muted-foreground mx-auto mb-4" />
            <p className="font-semibold text-lg mb-1">No cats yet</p>
            <p className="text-muted-foreground text-sm mb-6">
              Add your first cat to get started
            </p>
          </div>
        )}

        <Button asChild className="w-full" variant="outline">
          <Link href="/cats/new">
            <PlusCircle className="size-4 mr-2" />
            Add a cat
          </Link>
        </Button>
      </div>
    </div>
  );
}
