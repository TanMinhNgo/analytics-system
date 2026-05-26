import { Card } from "@/components/ui/Card";

export function EmptyState({ title, description }: { title: string; description: string }) {
  return (
    <Card className="text-center">
      <h3 className="text-lg font-semibold text-white">{title}</h3>
      <p className="mt-2 text-sm text-(--muted)">{description}</p>
    </Card>
  );
}
