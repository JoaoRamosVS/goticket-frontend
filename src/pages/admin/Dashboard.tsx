import {
    LayoutDashboard,
} from "lucide-react";
import AdminPageHeader from "@/components/layout/AdminPageHeader";

const Dashboard = () => {
    return (
        <div>
            <AdminPageHeader
                icon={LayoutDashboard}
                title="Dashboard"
                description="Visão geral da plataforma em tempo real."
            />
            <div className="rounded-3xl border border-dashed border-[#2a8fd4]/30 bg-white/40 p-10 text-center text-sm text-[#5e6c87]">
                Em breve: Métricas e análises de venda, insights, gráficos e etc...
            </div>
        </div>
    );
};

export default Dashboard;
