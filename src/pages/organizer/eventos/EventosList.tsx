import { CalendarDays } from "lucide-react";
import { useNavigate } from "react-router-dom";

import AdminPageHeader from "@/components/layout/AdminPageHeader";
import { MyEventsTable } from "@/features/organizer/organizer-events/components/MyEventsTable";
import { useMyEvents } from "@/features/organizer/organizer-events/hooks/useMyEvents";

const OrganizerEventosList = () => {
    const navigate = useNavigate();
    const {
        events,
        filteredEvents,
        page,
        setPage,
        totalPages,
        totalElements,
        isLoading,
        error,
        searchInput,
        setSearchInput,
        normalizedSearch,
        rangeStart,
        rangeEnd,
        loadEvents,
    } = useMyEvents();

    return (
        <div>
            <AdminPageHeader
                icon={CalendarDays}
                title="Meus eventos"
                description="Gerencie todos os eventos que você cadastrou na plataforma."
            />

            <MyEventsTable
                events={events}
                filteredEvents={filteredEvents}
                page={page}
                totalPages={totalPages}
                totalElements={totalElements}
                isLoading={isLoading}
                error={error}
                searchInput={searchInput}
                normalizedSearch={normalizedSearch}
                rangeStart={rangeStart}
                rangeEnd={rangeEnd}
                onSearchInputChange={setSearchInput}
                onReload={() => loadEvents(page)}
                onEdit={(eventId) => navigate(`/organizer/eventos/${eventId}`)}
                onPreviousPage={() => setPage((p) => Math.max(0, p - 1))}
                onNextPage={() =>
                    setPage((p) => Math.min(totalPages - 1, p + 1))
                }
            />
        </div>
    );
};

export default OrganizerEventosList;
