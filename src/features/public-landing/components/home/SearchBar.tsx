import { useState, useRef, useEffect } from "react";
import { Search, MapPin, ChevronDown, Check } from "lucide-react";

const MOCK_LOCATIONS = [
    "São Paulo, SP",
    "Rio de Janeiro, RJ",
    "Curitiba, PR",
    "Belo Horizonte, MG",
    "Porto Alegre, RS",
    "Salvador, BA",
    "Brasília, DF",
];

const SearchBar = () => {
    const [query, setQuery] = useState("");
    const [location, setLocation] = useState("");
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <section className="container mx-auto relative z-20 w-full px-4 sm:px-8 pt-12 pb-6">
            <div className="mx-auto max-w-5xl">
                <div
                    className="relative flex flex-col items-stretch gap-0 rounded-[28px] border border-white/60 bg-white/25 sm:flex-row sm:rounded-full"
                    style={{
                        boxShadow:
                            "0 8px 40px -5px rgba(0,46,71,0.08), 0 2px 12px -4px rgba(0,46,71,0.06), inset 0 1px 0 0 rgba(255,255,255,0.8), inset 0 -1px 0 0 rgba(255,255,255,0.4)",
                    }}
                >
                    <div className="pointer-events-none absolute inset-0 -z-10 rounded-[28px] sm:rounded-full" />

                    {/* Search input */}
                    <div className="flex flex-1 items-center gap-3 px-6 py-4 sm:py-0">
                        <input
                            type="text"
                            placeholder="Buscar eventos, shows, festivais..."
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            className="w-full bg-transparent text-sm py-4 font-medium text-[#002233] placeholder:text-[#5e6c87]/50 outline-none sm:text-xl"
                        />
                    </div>

                    {/* Location selector */}
                    <div ref={dropdownRef} className="relative flex items-center">
                        <button
                            type="button"
                            onClick={() => setIsOpen(!isOpen)}
                            className="flex h-full w-full cursor-pointer items-center gap-2 px-6 py-4 transition-colors duration-200 hover:bg-white/20 sm:min-w-[220px]"
                        >
                            <MapPin className="size-5 shrink-0 text-[#7ebad6]" />
                            <span className={`flex-1 text-left text-md ${location ? "font-md text-[#002233]" : "text-[#5e6c87]/50"}`}>
                                {location || "Localização"}
                            </span>
                            <ChevronDown className={`size-4 text-[#5e6c87]/40 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
                        </button>

                        {isOpen && (
                            <div
                                className="absolute right-0 top-full z-50 mt-3 w-full min-w-[240px] rounded-[32px] border border-white/10 py-2"
                                style={{
                                    background: "rgba(255,255,255,0.6)",
                                    backdropFilter: "blur(24px) saturate(1.4)",
                                    WebkitBackdropFilter: "blur(24px) saturate(1.4)",
                                    boxShadow:
                                        "0 12px 40px -8px rgba(0,46,71,0.14), 0 4px 12px -4px rgba(0,46,71,0.08), inset 0 1px 0 0 rgba(255,255,255,0.8)",
                                }}
                            >
                                {MOCK_LOCATIONS.map((loc) => {
                                    const isSelected = location === loc;
                                    return (
                                        <button
                                            key={loc}
                                            type="button"
                                            onClick={() => {
                                                setLocation(isSelected ? "" : loc);
                                                setIsOpen(false);
                                            }}
                                            className="flex w-full cursor-pointer items-center gap-3 px-5 py-2.5 text-left text-sm text-[#002233] transition-colors duration-150 hover:bg-primary/8"
                                        >
                                            <div className={`flex size-4 items-center justify-center rounded-full border ${isSelected ? "border-primary bg-primary" : "border-[#5e6c87]/20 bg-white/90"}`}>
                                                {isSelected && <Check className="size-3 text-white" />}
                                            </div>
                                            {loc}
                                        </button>
                                    );
                                })}
                            </div>
                        )}
                    </div>

                    {/* Search button */}
                    <div className="p-2 sm:pl-0">
                        <button
                            type="button"
                            className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-[20px] px-3 py-3 text-sm font-bold text-white transition-all duration-300 hover:scale-[1.02] hover:brightness-110 sm:rounded-full sm:px-3 sm:py-3"
                            style={{
                                background: "linear-gradient(135deg, #4db8e8 0%, #2a8fd4 50%, #1c6fb5 100%)",
                                boxShadow: "0 4px 14px -3px rgba(42,143,212,0.45), 0 1px 3px rgba(42,143,212,0.2)",
                            }}
                        >
                            <Search className="size-5" strokeWidth={4} />
                            <span className="sm:hidden">Buscar</span>
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default SearchBar;
