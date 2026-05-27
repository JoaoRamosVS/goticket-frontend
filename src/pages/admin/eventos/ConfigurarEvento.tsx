import { useParams } from "react-router-dom";
import EventConfigurePage from "@/features/event-configure/EventConfigurePage";

const AdminConfigurarEvento = () => {
    const { eventId } = useParams<{ eventId: string }>();
    return (
        <EventConfigurePage
            eventId={Number(eventId)}
            backPath={`/admin/eventos/${eventId}`}
        />
    );
};

export default AdminConfigurarEvento;
