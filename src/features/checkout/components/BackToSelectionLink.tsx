import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

interface BackToSelectionLinkProps {
  eventId: string;
  eventDateId: number;
}

export default function BackToSelectionLink({ eventId, eventDateId }: BackToSelectionLinkProps) {
  return (
    <Link
      to={`/evento/${eventId}/data/${eventDateId}/ingressos`}
      className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
    >
      <ArrowLeft className="size-4" />
      Voltar à seleção de ingressos
    </Link>
  );
}
