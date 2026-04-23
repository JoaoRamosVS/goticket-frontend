import { Building2 } from "lucide-react";
import AdminPageHeader from "@/components/admin/AdminPageHeader";

const Espacos = () => {
    return (
        <div>
            <AdminPageHeader
                icon={Building2}
                title="Espaços"
                description="Cadastre e gerencie os locais onde os eventos acontecem."
            />
            <div className="rounded-3xl border border-dashed border-[#2a8fd4]/30 bg-white/40 p-10 text-center text-sm text-[#5e6c87]">
                Em breve: cadastro de venues, capacidade e mapa de assentos.
            </div>
        </div>
    );
};

export default Espacos;
