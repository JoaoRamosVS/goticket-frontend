import { Link, useLocation } from "react-router-dom";
import { Globe, Phone, ArrowRight, Facebook, Instagram, Linkedin, Send } from "lucide-react";
import { useState } from "react";

const NAV_LINKS = [
    { label: "Inicio", to: "/" },
    { label: "Eventos", to: "/eventos" },
    { label: "Categorias", to: "/categorias" },
    { label: "FAQ", to: "/faq" },
    { label: "Blog", to: "/blog" },
];

const QUICK_LINKS = [
    { label: "Inicio", to: "/" },
    { label: "Eventos", to: "/eventos" },
    { label: "Categorias", to: "/categorias" },
    { label: "FAQ", to: "/faq" },
];

const USER_LINKS = [
    { label: "Criar conta", to: "/cadastro" },
    { label: "Entrar", to: "/login" },
    { label: "Suporte", to: "/suporte" },
    { label: "Termos de Uso", to: "/termos" },
];

const SOCIALS = [
    { icon: Facebook, href: "#", label: "Facebook" },
    { icon: Instagram, href: "#", label: "Instagram" },
    { icon: Linkedin, href: "#", label: "LinkedIn" },
    { icon: Send, href: "#", label: "Telegram" },
];

const Footer = () => {

    const location = useLocation();
    if(location.pathname === "/") return null;

    const [email, setEmail] = useState("");

    return (
        <footer className="relative w-full px-4 pb-6 pt-10 sm:px-8 bg-linear-to-b from-transparent via-primary/5 to-primary/60">
            <div
                className="relative mx-auto max-w-7xl overflow-hidden rounded-[36px] border border-white/60 bg-white/60 backdrop-blur-2xl sm:rounded-[48px]"
                style={{
                    boxShadow:
                        "0 8px 40px -10px rgba(0,46,71,0.08), 0 2px 12px -4px rgba(0,46,71,0.05), inset 0 1px 0 0 rgba(255,255,255,0.8)",
                }}
            >
                <div
                    className="pointer-events-none absolute inset-0 -z-10"
                    style={{
                        background:
                            "radial-gradient(ellipse 60% 80% at 20% 20%, rgba(87,197,244,0.06) 0%, transparent 60%), radial-gradient(ellipse 50% 60% at 80% 80%, rgba(159,210,234,0.05) 0%, transparent 60%)",
                    }}
                />

                {/* Top bar */}
                <div className="flex flex-col items-center justify-between gap-4 border-b border-white/40 px-8 py-5 sm:flex-row sm:px-12">
                    <Link
                        to="/"
                        className="flex items-center gap-2 text-2xl font-bold tracking-tight transition-all duration-300 hover:scale-95"
                    >
                        <img src="/GoTicketLogo.png" width={36} height={36} alt="GoTicket" />
                        <span className="bg-linear-to-r from-foreground to-foreground/70 bg-clip-text">
                            GoTicket
                        </span>
                    </Link>

                    <nav className="flex flex-wrap items-center justify-center gap-6 sm:gap-8">
                        {NAV_LINKS.map((link) => (
                            <Link
                                key={link.label}
                                to={link.to}
                                className="text-sm font-medium text-[#002233]/70 transition-colors duration-200 hover:text-[#002233]"
                            >
                                {link.label}
                            </Link>
                        ))}
                    </nav>
                </div>

                {/* Main columns */}
                <div className="grid grid-cols-1 gap-10 px-8 py-10 sm:grid-cols-2 sm:px-12 lg:grid-cols-4">
                    {/* Links Rápidos */}
                    <div className="flex flex-col gap-4">
                        <h4 className="text-base font-bold italic">Links Rápidos</h4>
                        <ul className="flex flex-col gap-2.5">
                            {QUICK_LINKS.map((link) => (
                                <li key={link.label}>
                                    <Link
                                        to={link.to}
                                        className="text-sm text-[#5e6c87] transition-colors duration-200 hover:text-[#002233]"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Para Usuários */}
                    <div className="flex flex-col gap-4">
                        <h4 className="text-base font-bold italic">Para Usuários</h4>
                        <ul className="flex flex-col gap-2.5">
                            {USER_LINKS.map((link) => (
                                <li key={link.label}>
                                    <Link
                                        to={link.to}
                                        className="text-sm text-[#5e6c87] transition-colors duration-200 hover:text-[#002233]"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Entre em Contato */}
                    <div className="flex flex-col gap-4">
                        <h4 className="text-base font-bold italic">Entre em Contato</h4>
                        <div className="flex flex-col gap-3">
                            <a
                                href="mailto:suporte@goticket.com.br"
                                className="flex items-center gap-2.5 text-sm text-[#5e6c87] transition-colors duration-200 hover:text-[#002233]"
                            >
                                <Globe className="size-4 shrink-0 text-[#7ebad6]" />
                                suporte@goticket.com.br
                            </a>
                            <a
                                href="tel:+554511887824221"
                                className="flex items-center gap-2.5 text-sm text-[#5e6c87] transition-colors duration-200 hover:text-[#002233]"
                            >
                                <Phone className="size-4 shrink-0 text-[#7ebad6]" />
                                +45/11.88782 - 4221
                            </a>
                        </div>

                        <div className="mt-1 flex items-center gap-3">
                            {SOCIALS.map((social) => (
                                <a
                                    key={social.label}
                                    href={social.href}
                                    aria-label={social.label}
                                    className="flex size-9 items-center justify-center rounded-full bg-primary/15 text-primary transition-all duration-300 hover:scale-110 hover:bg-primary/25"
                                >
                                    <social.icon className="size-4" />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Newsletter */}
                    <div className="flex flex-col gap-4">
                        <h4 className="text-base font-bold italic">
                            Receba novidades<br />através da nossa newsletter!
                        </h4>
                        <div className="flex flex-col gap-3">
                            <input
                                type="email"
                                placeholder="Digite seu email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="rounded-xl border border-white/60 bg-white/50 px-4 py-2.5 text-sm text-[#002233] placeholder:text-[#5e6c87]/60 shadow-sm backdrop-blur-md outline-none transition-all duration-200 focus:border-primary/40 focus:ring-2 focus:ring-primary/15"
                            />
                            <button
                                type="button"
                                className="inline-flex w-fit cursor-pointer items-center gap-2 rounded-full px-8 py-2.5 text-sm font-bold text-white transition-all duration-300 hover:scale-105 hover:brightness-110"
                                style={{
                                    background:
                                        "linear-gradient(135deg, #4db8e8 0%, #2a8fd4 50%, #1c6fb5 100%)",
                                    boxShadow:
                                        "0 4px 14px -3px rgba(42,143,212,0.45), 0 1px 3px rgba(42,143,212,0.2)",
                                }}
                            >
                                Inscrever se
                                <ArrowRight className="size-4" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Bottom bar */}
                <div className="px-8 py-4 text-center sm:px-12">
                    <p className="text-xs text-[#5e6c87]/70">
                        &copy; {new Date().getFullYear()} GoTicket
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
