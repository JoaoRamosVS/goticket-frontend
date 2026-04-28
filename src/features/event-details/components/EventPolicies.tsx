import {
  ShieldCheck,
  RefreshCw,
  Camera,
  UtensilsCrossed,
  Accessibility,
  IdCard,
} from "lucide-react";
import type { EventPolicy } from "@/features/event-details/types/event-details.types";

interface EventPoliciesProps {
  policies: EventPolicy[];
}

const iconMap = {
  age: ShieldCheck,
  refund: RefreshCw,
  camera: Camera,
  food: UtensilsCrossed,
  accessibility: Accessibility,
  id: IdCard,
};

const EventPolicies = ({ policies }: EventPoliciesProps) => {
  return (
    <div>
      <h2 className="text-4xl font-bold mb-8 flex items-center gap-2">
        <ShieldCheck className="size-8 text-primary" />
        Informações Importantes
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {policies.map((policy) => {
          const Icon = iconMap[policy.icon];

          return (
            <div
              key={policy.title}
              className="rounded-4xl border p-4 flex gap-4 hover:border-primary/20 bg-card/40 backdrop-blur-xl transition-colors shadow-xs"
            >
              <div className="size-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                <Icon className="size-5 text-primary" />
              </div>
              <div>
                <p className="font-semibold text-foreground text-sm">
                  {policy.title}
                </p>
                <p className="text-muted-foreground text-xs mt-0.5 leading-relaxed">
                  {policy.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default EventPolicies;

