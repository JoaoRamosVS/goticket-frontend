import {
    LayoutDashboard,
    TrendingUp,
    Ticket,
    Users,
    DollarSign,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import AdminPageHeader from "@/components/layout/AdminPageHeader";

type StatCardData = {
    label: string;
    value: string;
    delta: string;
    icon: LucideIcon;
};

const STATS: StatCardData[] = [
    { label: "Receita total", value: "R$ 284.320", delta: "+12,4%", icon: DollarSign },
    { label: "Ingressos vendidos", value: "18.492", delta: "+8,1%", icon: Ticket },
    { label: "Usuários ativos", value: "7.238", delta: "+3,9%", icon: Users },
    { label: "Taxa de conversão", value: "4,82%", delta: "+0,6%", icon: TrendingUp },
];

const Dashboard = () => {
    return (
        <div>
            <AdminPageHeader
                icon={LayoutDashboard}
                title="Dashboard"
                description="Visão geral da plataforma em tempo real."
            />

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
                {STATS.map((stat) => (
                    <StatCard key={stat.label} {...stat} />
                ))}
            </div>
        </div>
    );
};

const StatCard = ({ label, value, delta, icon: Icon }: StatCardData) => {
    return (
        <div
            className="group relative overflow-hidden rounded-4xl border border-white/70 bg-white/25 p-5 backdrop-blur-xl transition-all duration-500 hover:bg-white/50"
            style={{
                boxShadow:
                    "0 8px 24px -10px rgba(0,46,71,0.12), 0 2px 6px -2px rgba(0,46,71,0.06), inset 0 1px 0 0 rgba(255,255,255,0.85)",
            }}
        >
            <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-[0.14em] text-[#5e6c87]">
                    {label}
                </span>
                <span
                    className="flex size-9 items-center justify-center rounded-xl text-white"
                    style={{
                        background:
                            "linear-gradient(135deg, #4db8e8 0%, #2a8fd4 50%, #1c6fb5 100%)",
                        boxShadow:
                            "0 4px 12px -3px rgba(42,143,212,0.45), inset 0 1px 0 0 rgba(255,255,255,0.4)",
                    }}
                >
                    <Icon className="size-4" strokeWidth={2.4} />
                </span>
            </div>
            <p className="mt-4 text-2xl font-bold tracking-tight text-[#00334d]">
                {value}
            </p>
            <p className="mt-1 text-xs font-semibold text-[#2a8fd4]">
                {delta} vs. mês anterior
            </p>
        </div>
    );
};

export default Dashboard;
