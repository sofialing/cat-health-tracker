import { notFound } from "next/navigation";
import { getCatById } from "@/lib/actions/cats";
import { CatForm } from "@/components/cats/CatForm";

export default async function EditCatPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const cat = await getCatById(id);
  if (!cat) notFound();

  return (
    <>
      <header className="sticky top-0 z-40 border-b bg-background px-4 h-14 flex items-center">
        <h1 className="text-lg font-semibold">Edit {cat.name}</h1>
      </header>
      <div className="px-4 py-4">
        <CatForm cat={cat} />
      </div>
    </>
  );
}
