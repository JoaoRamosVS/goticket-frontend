import { Settings } from "lucide-react";
import AdminPageHeader from "@/components/admin/AdminPageHeader";

const Configuracoes = () => {
    return (
        <div>
            <AdminPageHeader
                icon={Settings}
                title="Configurações"
                description="Preferências da plataforma, integrações e branding."
            />
            <div className="rounded-3xl border border-dashed border-[#2a8fd4]/30 bg-white/40 p-10 text-center text-sm text-[#5e6c87]">
                Em breve: preferências, integrações e chaves de API.
            </div>
        </div>
    );
};

export default Configuracoes;
