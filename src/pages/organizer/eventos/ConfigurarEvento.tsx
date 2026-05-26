import { useParams } from "react-router-dom";
import EventConfigurePage from "@/features/organizer/organizer-event-configure/EventConfigurePage";

const OrganizerConfigurarEvento = () => {
    const { eventId } = useParams<{ eventId: string }>();
    return <EventConfigurePage eventId={Number(eventId)} />;
};

export default OrganizerConfigurarEvento;
