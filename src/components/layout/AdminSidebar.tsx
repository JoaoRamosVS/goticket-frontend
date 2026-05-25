import { NavLink, Link, useNavigate } from "react-router-dom";
import {
    LayoutDashboard,
    CalendarDays,
    Users,
    UserCog,
    Settings,
    LogOut,
    ChevronRight,
    Building2,
    Tags,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { useAuthStore } from "@/stores/authStore";

type NavItem = {
    to: string;
    label: string;
    icon: LucideIcon;
};

const NAV_ITEMS: NavItem[] = [
    { to: "/admin/eventos", label: "Eventos", icon: CalendarDays },
    { to: "/admin/categorias", label: "Categorias", icon: Tags },
    { to: "/admin/espacos", label: "Espaços", icon: Building2 },
    { to: "/admin/clientes", label: "Clientes", icon: Users },
    { to: "/admin/organizadores", label: "Organizadores", icon: UserCog },
];

const SECONDARY_ITEMS: NavItem[] = [
    { to: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { to: "/admin/configuracoes", label: "Configurações", icon: Settings },
];

const AdminSidebar = () => {
    const navigate = useNavigate();
    const userFullName = useAuthStore((state) => state.userFullName);
    const logout = useAuthStore((state) => state.logout);

    const initials = (userFullName || "GT")
        .split(" ")
        .slice(0, 2)
        .map((name) => name.charAt(0).toUpperCase())
        .join("");

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    return (
        <aside className="fixed left-0 top-0 bottom-0 z-40 w-72 p-4">
            <div
                className="flex h-full flex-col overflow-hidden rounded-[32px] border border-white/60 bg-white/55 backdrop-blur-2xl"
                style={{
                    boxShadow:
                        "0 12px 40px -12px rgba(0,46,71,0.18), 0 2px 8px -2px rgba(0,46,71,0.08), inset 0 1px 0 0 rgba(255,255,255,0.8)",
                }}
            >
                <div
                    aria-hidden
                    className="pointer-events-none absolute -top-24 -left-16 h-56 w-56 rounded-full opacity-70"
                    style={{
                        background:
                            "radial-gradient(circle, rgba(77,184,232,0.35) 0%, transparent 70%)",
                        filter: "blur(24px)",
                    }}
                />
                <div
                    aria-hidden
                    className="pointer-events-none absolute -bottom-20 -right-16 h-56 w-56 rounded-full opacity-60"
                    style={{
                        background:
                            "radial-gradient(circle, rgba(28,111,181,0.28) 0%, transparent 70%)",
                        filter: "blur(24px)",
                    }}
                />

                <div className="relative px-6 pt-7 pb-5">
                    <Link
                        to="/"
                        className="group flex items-center gap-2.5 transition-all duration-300 hover:gap-1.5"
                    >
                        <img
                            src="/goticket_logo.svg"
                            width={38}
                            height={38}
                            alt="GoTicket"
                            className="drop-shadow-md transition-transform duration-300 group-hover:scale-95"
                        />
                        <div className="flex flex-col leading-tight">
                            <span className="text-xl font-bold tracking-tight text-[#00334d]">
                                GoTicket
                            </span>
                            <span
                                className="text-[10px] font-bold uppercase tracking-[0.18em]"
                                style={{
                                    background:
                                        "linear-gradient(135deg, #4db8e8 0%, #2a8fd4 50%, #1c6fb5 100%)",
                                    WebkitBackgroundClip: "text",
                                    WebkitTextFillColor: "transparent",
                                    backgroundClip: "text",
                                }}
                            >
                                Admin Panel
                            </span>
                        </div>
                    </Link>
                </div>

                <div className="relative mx-6 h-px bg-linear-to-r from-transparent via-[#2a8fd4]/25 to-transparent" />

                <nav className="relative flex-1 overflow-y-auto px-4 py-5">
                    <p className="mb-2 px-3 text-[10px] font-bold uppercase tracking-[0.16em] text-[#5e6c87]/70">
                        Entidades
                    </p>
                    <ul className="flex flex-col gap-1.5">
                        {NAV_ITEMS.map((item) => (
                            <SidebarItem key={item.to} item={item} />
                        ))}
                    </ul>

                    <p className="mb-2 mt-6 px-3 text-[10px] font-bold uppercase tracking-[0.16em] text-[#5e6c87]/70">
                        Geral
                    </p>
                    <ul className="flex flex-col gap-1.5">
                        {SECONDARY_ITEMS.map((item) => (
                            <SidebarItem key={item.to} item={item} />
                        ))}
                    </ul>
                </nav>

                <div className="relative p-4">
                    <div
                        className="flex items-center gap-3 rounded-2xl border border-white/70 bg-white/60 px-3 py-2.5 backdrop-blur-xl"
                        style={{
                            boxShadow:
                                "0 4px 14px -6px rgba(0,46,71,0.12), inset 0 1px 0 0 rgba(255,255,255,0.9)",
                        }}
                    >
                        <div
                            className="flex size-10 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white"
                            style={{
                                background:
                                    "linear-gradient(135deg, #4db8e8 0%, #2a8fd4 50%, #1c6fb5 100%)",
                                boxShadow:
                                    "0 4px 12px -3px rgba(42,143,212,0.55), inset 0 1px 0 0 rgba(255,255,255,0.4)",
                            }}
                        >
                            {initials || "GT"}
                        </div>
                        <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-bold text-[#00334d]">
                                {userFullName || "Administrador"}
                            </p>
                            <p className="truncate text-[11px] text-[#5e6c87]">
                                Administrador
                            </p>
                        </div>
                        <button
                            type="button"
                            onClick={handleLogout}
                            className="flex size-9 shrink-0 cursor-pointer items-center justify-center rounded-xl text-[#5e6c87] transition-all duration-300 hover:bg-red-500/10 hover:text-red-500"
                            aria-label="Sair"
                            title="Sair"
                        >
                            <LogOut className="size-4" />
                        </button>
                    </div>
                </div>
            </div>
        </aside>
    );
};

type SidebarItemProps = {
    item: NavItem;
};

const SidebarItem = ({ item }: SidebarItemProps) => {
    const Icon = item.icon;

    return (
        <li>
            <NavLink
                to={item.to}
                className={({ isActive }) =>
                    cn(
                        "group relative flex items-center gap-3 overflow-hidden rounded-2xl px-3.5 py-2.5 text-sm font-semibold transition-all duration-300",
                        isActive
                            ? "text-white"
                            : "text-[#00334d]/80 hover:bg-primary/15 hover:text-[#00334d]"
                    )
                }
                style={({ isActive }) =>
                    isActive
                        ? {
                              background:
                                  "linear-gradient(135deg, #4db8e8 0%, #2a8fd4 50%, #1c6fb5 100%)",
                              boxShadow:
                                  "0 8px 22px -8px rgba(42,143,212,0.55), 0 2px 6px -2px rgba(28,111,181,0.35), inset 0 1px 0 0 rgba(255,255,255,0.35)",
                          }
                        : undefined
                }
            >
                {({ isActive }) => (
                    <>
                        <span
                            className={cn(
                                "flex size-8 items-center justify-center rounded-xl transition-all duration-300",
                                isActive
                                    ? "bg-white/20 text-white"
                                    : "bg-[#e5f1ff] text-[#2a8fd4] group-hover:bg-white"
                            )}
                        >
                            <Icon className="size-4" strokeWidth={2.4} />
                        </span>
                        <span className="flex-1 truncate">{item.label}</span>
                        <ChevronRight
                            className={cn(
                                "size-4 transition-all duration-300",
                                isActive
                                    ? "opacity-100 translate-x-0"
                                    : "opacity-0 -translate-x-1 group-hover:opacity-60 group-hover:translate-x-0"
                            )}
                        />
                    </>
                )}
            </NavLink>
        </li>
    );
};

export default AdminSidebar;
