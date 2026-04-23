import { LineChart } from "lucide-react";
import AdminPageHeader from "@/components/admin/AdminPageHeader";

const Vendas = () => {
    return (
        <div>
            <AdminPageHeader
                icon={LineChart}
                title="Vendas"
                description="Relatórios financeiros, repasses e métricas de receita."
            />
            <div className="rounded-3xl border border-dashed border-[#2a8fd4]/30 bg-white/40 p-10 text-center text-sm text-[#5e6c87]">
                Em breve: dashboards de receita, repasses e extratos.
            </div>
        </div>
    );
};

export default Vendas;
