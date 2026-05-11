import { LayoutDashboard, RefreshCcw } from "lucide-react";
import { useNavigate } from "react-router-dom";

import AdminPageHeader from "@/components/layout/AdminPageHeader";
import { StatusBoard } from "@/features/organizer/organizer-dashboard/components/StatusBoard";
import { StatusSummaryCards } from "@/features/organizer/organizer-dashboard/components/StatusSummaryCards";
import { useOrganizerDashboard } from "@/features/organizer/organizer-dashboard/hooks/useOrganizerDashboard";

const OrganizerDashboard = () => {
    const navigate = useNavigate();
    const { groups, totals, isLoading, error, reload } = useOrganizerDashboard();

    return (
        <div>
            <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
                <AdminPageHeader
                    icon={LayoutDashboard}
                    title="Visão geral"
                    description="Acompanhe a situação atual de todos os seus eventos."
                />
                <button
                    type="button"
                    onClick={reload}
                    className="flex size-10 cursor-pointer items-center justify-center rounded-xl border border-white/70 bg-[#2a8fd4] text-white shadow-xl transition-all duration-300 hover:scale-95"
                    aria-label="Recarregar"
                    title="Recarregar"
                >
                    <RefreshCcw
                        className={`size-4 ${isLoading ? "animate-spin" : ""}`}
                        strokeWidth={2.3}
                    />
                </button>
            </div>

            <div className="mb-6">
                <StatusSummaryCards totals={totals} />
            </div>

            <StatusBoard
                groups={groups}
                isLoading={isLoading}
                error={error}
                onOpenEvent={(eventId) =>
                    navigate(`/organizer/eventos/${eventId}`)
                }
            />
        </div>
    );
};

export default OrganizerDashboard;
