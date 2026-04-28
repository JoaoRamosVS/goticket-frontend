import ParallaxBanner from "@/features/event-details/components/ParallaxBanner";
import EventInfo from "@/features/event-details/components/EventInfo";
import TicketSelector from "@/features/event-details/components/TicketSelector";
import EventDescription from "@/features/event-details/components/EventDescription";
import EventLocation from "@/features/event-details/components/EventLocation";
import EventPolicies from "@/features/event-details/components/EventPolicies";
import { mockEvent } from "@/features/event-details/utils/mockData";
import FaqSection from "@/features/public-landing/components/FAQSection/FAQSection";
import ShareAndSave from "@/features/event-details/components/ShareAndSave";

const EventPage = () => {
  const event = mockEvent;

  return (
    <>
      <ParallaxBanner image={event.image} title={event.title} />

      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-16">
          <div className="flex flex-col gap-16">
            <EventDescription
              description={event.description}
              lineup={event.lineup}
            />

            <EventLocation venue={event.venue} />

            <EventPolicies policies={event.policies} />
          </div>

          <aside className="hidden lg:flex flex-col gap-6">
            <ShareAndSave />
            <EventInfo
              category={event.category}
              title={event.title}
              date={event.date}
              venue={event.venue}
              ageRating={event.ageRating}
              tags={event.tags}
              status={event.status}
            />

            <TicketSelector tickets={event.tickets} />
          </aside>
        </div>
      </div>

      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-t p-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">A partir de</p>
            <p className="text-xl font-bold text-foreground">
              {event.tickets[0].price.toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL",
              })}
            </p>
          </div>
          <button className="bg-primary text-primary-foreground font-bold px-8 py-3 rounded-full">
            Ver Ingressos
          </button>
        </div>
      </div>

      
      <FaqSection />
    </>
  );
};

export default EventPage;

