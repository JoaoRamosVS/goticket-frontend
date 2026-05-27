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
      className="inline-flex items-center gap-2 text-sm shadow-2xl w-fit text-white font-semibold bg-linear-to-l from-primary to-[#1c6fb5] px-3 py-1.5 rounded-lg hover:scale-97 hover:shadow-md transition-all duration-300"
    >
      <ArrowLeft className="size-4" />
      Voltar à seleção de ingressos
    </Link>
  );
}
