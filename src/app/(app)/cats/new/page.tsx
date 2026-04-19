import { CatForm } from "@/components/cats/CatForm";
import { PageShell } from "@/components/layout/PageShell";

export default function NewCatPage() {
  return (
    <PageShell title="Add Cat">
      <CatForm />
    </PageShell>
  );
}
