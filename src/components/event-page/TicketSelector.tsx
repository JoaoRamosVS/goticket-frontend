import { Ticket } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { TicketType } from "./types";

interface TicketSelectorProps {
  tickets: TicketType[];
}

function formatCurrency(value: number) {
  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

const TicketSelector = ({ tickets }: TicketSelectorProps) => {
  return (
    <div className="sticky top-28 bg-card/40 backdrop-blur-xl rounded-4xl border py-6 shadow-xs">
      <CardHeader className="mb-3 pl-8">
        <CardTitle className="flex items-center gap-2 text-2xl font-bold">
          <Ticket className="size-7 text-primary" />  
          Ingressos
        </CardTitle>
      </CardHeader>

      <CardContent className="flex flex-col gap-4">
        {tickets.map((ticket) => {

          return (
            <div
              key={ticket.id}
              className={cn(
                "rounded-xl border p-4 transition-all shadow-xs hover:scale-95 duration-400 bg-card/50"
              )}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex flex-col gap-1 flex-1 min-w-0">
                  <p className="font-semibold text-foreground">{ticket.name}</p>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {ticket.description}
                  </p>
                </div>

                <div className="text-right shrink-0">
                  {ticket.originalPrice && (
                    <p className="text-sm text-muted-foreground line-through">
                      {formatCurrency(ticket.originalPrice)}
                    </p>
                  )}
                  <p className="text-lg font-bold text-foreground">
                    {formatCurrency(ticket.price)}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-end mt-3">
                <Button
                  variant="default"
                  className="gap-2 bg-linear-to-r from-primary to-[#2959b9] text-primary-foreground px-8 rounded-4xl w-full"
                >
                  Selecionar Ingresso
                </Button>
              </div>
            </div>
          );
        })}
      </CardContent>
    </div>
  );
};

export default TicketSelector;
