import { Users } from "lucide-react";
import AdminPageHeader from "@/components/admin/AdminPageHeader";

const Usuarios = () => {
    return (
        <div>
            <AdminPageHeader
                icon={Users}
                title="Usuários"
                description="Gerencie contas, permissões e produtores."
            />
            <div className="rounded-3xl border border-dashed border-[#2a8fd4]/30 bg-white/40 p-10 text-center text-sm text-[#5e6c87]">
                Em breve: listagem de usuários, papéis e auditoria de acessos.
            </div>
        </div>
    );
};

export default Usuarios;
