import { MapPin, Navigation, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { EventVenue } from "./types";

interface EventLocationProps {
  venue: EventVenue;
}

const EventLocation = ({ venue }: EventLocationProps) => {
  const mapsQuery = encodeURIComponent(
    `${venue.name}, ${venue.address}, ${venue.city} - ${venue.state}`
  );
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${mapsQuery}`;

  return (
    <div>
      <h2 className="text-4xl font-bold mb-8 flex items-center gap-2">
        <MapPin className="size-8 text-primary" />
        Localização
      </h2>

      <div className="rounded-4xl border overflow-hidden bg-card/60 backdrop-blur-xl shadow-xs">
        <div className="relative h-48 bg-muted flex items-center justify-center">
          <iframe
            title="Localização do evento"
            src={`https://www.google.com/maps?q=${mapsQuery}&output=embed`}
            className="w-full h-full border-0"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>

        <div className="py-5 px-8	 flex flex-col gap-3">
          <div>
            <p className="font-bold text-foreground text-xl">
              {venue.name}
            </p>
            <p className="text-muted-foreground mt-2">
              {venue.address}
            </p>
            <p className="text-muted-foreground mb-2">
              {venue.city}, {venue.state} - CEP {venue.zipCode}
            </p>
          </div>

          <div className="flex gap-2">
            <Button
              variant="default"
              className="gap-2 bg-linear-to-r from-primary to-[#2959b9] text-primary-foreground px-8 rounded-4xl"
              asChild
            >
              <a href={mapsUrl} target="_blank" rel="noopener noreferrer">
                <Navigation className="size-4" />
                Como chegar
              </a>
            </Button>
            <Button
              variant="ghost"
              className="gap-2"
              asChild
            >
              <a href={mapsUrl} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="size-4" />
                Abrir no Maps
              </a>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventLocation;
