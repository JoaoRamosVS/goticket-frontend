import { CalendarDays } from "lucide-react";
import { useNavigate } from "react-router-dom";
import AdminPageHeader from "@/components/layout/AdminPageHeader";
import { EventsTable } from "@/features/admin/admin-events/components/EventsTable";
import { useAdminEvents } from "@/features/admin/admin-events/hooks/useAdminEvents";

const EventosList = () => {
    const navigate = useNavigate();
    const {
        events,
        page,
        setPage,
        totalPages,
        totalElements,
        isLoading,
        error,
        searchInput,
        setSearchInput,
        deletingId,
        loadEvents,
        filteredEvents,
        normalizedSearch,
        handleDelete,
        rangeStart,
        rangeEnd,
    } = useAdminEvents();

    const handleEdit = (eventId: number) => {
        navigate(`/admin/eventos/${eventId}`);
    };

    return (
        <div>
            <AdminPageHeader
                icon={CalendarDays}
                title="Eventos"
                description="Gerencie os eventos publicados na plataforma."
            />

            <EventsTable
                events={events}
                filteredEvents={filteredEvents}
                page={page}
                totalPages={totalPages}
                totalElements={totalElements}
                isLoading={isLoading}
                error={error}
                searchInput={searchInput}
                normalizedSearch={normalizedSearch}
                deletingId={deletingId}
                rangeStart={rangeStart}
                rangeEnd={rangeEnd}
                onSearchInputChange={setSearchInput}
                onReload={() => loadEvents(page)}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onPreviousPage={() => setPage((p) => Math.max(0, p - 1))}
                onNextPage={() =>
                    setPage((p) => Math.min(totalPages - 1, p + 1))
                }
            />
        </div>
    );
};

export default EventosList;
