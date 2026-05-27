import { useAuthStore } from "@/stores/authStore";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
	LogIn,
	LogOut,
	Search,
	ShoppingBag,
	UserCircle,
	LayoutGrid,
	Menu,
	X,
	ChevronDown,
	ArrowRight,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@radix-ui/react-avatar";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useRef, useEffect, useCallback } from "react";
import useEventCategories from "@/features/public-landing/hooks/useEventCategories";
import eventSearchService from "@/features/event-search/services/eventSearch.service";
import type { EventMinDTO } from "@/features/admin/admin-events/types/event.types";

// ─── Suggestions panel ────────────────────────────────────────────────────────

interface SuggestionsPanelProps {
	show: boolean;
	query: string;
	isLoading: boolean;
	suggestions: EventMinDTO[];
	onSuggestionClick: (eventId: number) => void;
	onShowAll: () => void;
}

const SuggestionsPanel = ({
	show,
	query,
	isLoading,
	suggestions,
	onSuggestionClick,
	onShowAll,
}: SuggestionsPanelProps) => (
	<AnimatePresence>
		{show && query.trim().length >= 2 && (
			<motion.div
				initial={{ opacity: 0, y: -6, scale: 0.98 }}
				animate={{ opacity: 1, y: 0, scale: 1 }}
				exit={{ opacity: 0, y: -6, scale: 0.98 }}
				transition={{ duration: 0.15 }}
				className="absolute top-full mt-2 left-0 right-0 z-50 rounded-2xl bg-background/95 shadow-2xl overflow-hidden"
			>
				{isLoading ? (
					<div className="px-4 py-3 text-sm text-muted-foreground">
						Buscando...
					</div>
				) : suggestions.length === 0 ? (
					<div className="px-4 py-3 text-sm text-muted-foreground">
						Nenhum resultado encontrado.
					</div>
				) : (
					<>
						<ul>
							{suggestions.map((event) => (
								<li key={event.eventId}>
									<button
										className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-accent/50 transition-colors text-left"
										onMouseDown={(e) => e.preventDefault()}
										onClick={() => onSuggestionClick(event.eventId)}
									>
										<Search className="size-3.5 text-muted-foreground shrink-0" strokeWidth={3}/>
										<span className="flex-1 text-sm truncate">{event.title}</span>
										{event.categoryName && (
											<Badge variant="secondary" className="text-xs shrink-0 bg-primary">
												{event.categoryName}
											</Badge>
										)}
									</button>
								</li>
							))}
						</ul>
						<div className="border-t border-primary-foreground/20">
							<button
								className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-white font-semibold bg-linear-to-r from-primary to-[#2959b9]"
								onMouseDown={(e) => e.preventDefault()}
								onClick={onShowAll}
							>
								<ArrowRight className="size-3.5" strokeWidth={3} />
								Ver todos os resultados para &ldquo;{query.trim()}&rdquo;
							</button>
						</div>
					</>
				)}
			</motion.div>
		)}
	</AnimatePresence>
);

// ─── Navbar ───────────────────────────────────────────────────────────────────

const Navbar = () => {
	const navigate = useNavigate();
	const { pathname } = useLocation();

	const [query, setQuery] = useState("");
	const [suggestions, setSuggestions] = useState<EventMinDTO[]>([]);
	const [showSuggestions, setShowSuggestions] = useState(false);
	const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);
	const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
	const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);

	const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
	const abortRef = useRef<AbortController | null>(null);
	const desktopSearchRef = useRef<HTMLDivElement>(null);
	const mobileSearchRef = useRef<HTMLDivElement>(null);

	const isAuth = useAuthStore((state) => state.isAuth);
	const userFullName = useAuthStore((state) => state.userFullName);
	const logout = useAuthStore((state) => state.logout);
	const { categories } = useEventCategories();

	useEffect(() => {
		setIsMobileMenuOpen(false);
		setIsMobileSearchOpen(false);
		setShowSuggestions(false);
	}, [pathname]);

	useEffect(() => {
		const handlePointerDown = (e: MouseEvent) => {
			const target = e.target as Node;
			const inDesktop = desktopSearchRef.current?.contains(target);
			const inMobile = mobileSearchRef.current?.contains(target);
			if (!inDesktop && !inMobile) setShowSuggestions(false);
		};
		document.addEventListener("mousedown", handlePointerDown);
		return () => document.removeEventListener("mousedown", handlePointerDown);
	}, []);

	useEffect(() => {
		return () => {
			if (debounceRef.current) clearTimeout(debounceRef.current);
			if (abortRef.current) abortRef.current.abort();
		};
	}, []);

	const handleQueryChange = useCallback((value: string) => {
		setQuery(value);
		if (debounceRef.current) clearTimeout(debounceRef.current);
		if (abortRef.current) abortRef.current.abort();

		if (value.trim().length < 2) {
			setSuggestions([]);
			setShowSuggestions(false);
			return;
		}

		debounceRef.current = setTimeout(async () => {
			const controller = new AbortController();
			abortRef.current = controller;
			setIsLoadingSuggestions(true);
			try {
				const result = await eventSearchService.searchPublicEvents(
					{ title: value.trim(), page: 0, pageSize: 5 },
					controller.signal,
				);
				setSuggestions(result.eventMinDTOList);
				setShowSuggestions(true);
			} catch {
				// aborted or network error — ignore
			} finally {
				setIsLoadingSuggestions(false);
			}
		}, 300);
	}, []);

	const handleSearch = () => {
		const term = query.trim();
		if (!term) return;
		setShowSuggestions(false);
		setIsMobileSearchOpen(false);
		navigate(`/busca/${encodeURIComponent(term)}`);
	};

	const handleSuggestionClick = useCallback(
		(eventId: number) => {
			setShowSuggestions(false);
			setIsMobileSearchOpen(false);
			navigate(`/evento/${eventId}`);
		},
		[navigate],
	);

	const handleShowAll = useCallback(() => {
		const term = query.trim();
		setShowSuggestions(false);
		setIsMobileSearchOpen(false);
		navigate(`/busca/${encodeURIComponent(term)}`);
	}, [query, navigate]);

	const userInitials = userFullName
		? userFullName
				.split(" ")
				.map((n) => n[0])
				.slice(0, 2)
				.join("")
				.toUpperCase()
		: "U";

	const navbarVariants = {
		hidden: { opacity: 0, y: -80, scale: 0.8 },
		visible: {
			opacity: 1,
			y: 0,
			scale: 1,
			transition: {
				type: "spring" as const,
				stiffness: 50,
				damping: 15,
				mass: 1,
			},
		},
	};

	const mobileMenuVariants = {
		hidden: { opacity: 0, y: -8, scale: 0.98 },
		visible: {
			opacity: 1,
			y: 0,
			scale: 1,
			transition: { type: "spring" as const, stiffness: 300, damping: 30 },
		},
		exit: {
			opacity: 0,
			y: -8,
			scale: 0.98,
			transition: { duration: 0.15 },
		},
	};

	return (
		<motion.nav
			initial="hidden"
			animate="visible"
			variants={navbarVariants}
			className="fixed top-0 left-0 right-0 z-50 px-4 py-3"
		>
			<div className="container mx-auto">
				{/* ── Main pill ─────────────────────────────────────── */}
				<div
					className="flex items-center justify-between pl-4 pr-3 py-2.5 rounded-full gap-2
					bg-background/80 backdrop-blur-xl border border-primary-foreground/50 shadow-2xs"
				>
					{/* Logo */}
					<Link
						to="/"
						className="flex items-center gap-2 shrink-0 hover:scale-95 transition-transform duration-300"
					>
						<img src="/goticket_logo.svg" width={42} height={42} />
						<span className="hidden md:block text-2xl font-bold tracking-tight bg-linear-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
							GoTicket
						</span>
					</Link>

					{/* Search bar — tablet + desktop */}
					<div
						ref={desktopSearchRef}
						className="hidden sm:block flex-1 min-w-0 max-w-md relative mx-2"
					>
						<div className="relative">
							<Search
								className="pointer-events-none z-10 absolute left-3 top-1/2 -translate-y-1/2 text-white bg-linear-to-b from-primary to-[#2959b9] rounded-full w-6 h-6 p-1"
								strokeWidth={3}
							/>
							<Input
								type="search"
								placeholder="Buscar eventos, shows, festivais..."
								value={query}
								onChange={(e) => handleQueryChange(e.target.value)}
								onKeyDown={(e) => e.key === "Enter" && handleSearch()}
								onFocus={() =>
									suggestions.length > 0 && setShowSuggestions(true)
								}
								className="h-9 w-full rounded-full border-primary-foreground/40 bg-background/50 pl-11 pr-3 shadow-md backdrop-blur-xl placeholder:text-accent-foreground/60"
							/>
						</div>
						<SuggestionsPanel
							show={showSuggestions}
							query={query}
							isLoading={isLoadingSuggestions}
							suggestions={suggestions}
							onSuggestionClick={handleSuggestionClick}
							onShowAll={handleShowAll}
						/>
					</div>

					{/* Right actions */}
					<div className="flex items-center gap-4 shrink-0">
						{/* Categories dropdown — desktop only */}
						<div className="hidden lg:flex items-center shrink-0">
							<DropdownMenu modal={false}>
								<DropdownMenuTrigger asChild>
									<Button
										className="gap-1.5 rounded-full text-sm font-semibold bg-linear-to-b from-primary to-[#2959b9] hover:scale-95 transition-all duration-300 ease-out"
									>
										<LayoutGrid className="size-4" />
										Categorias
										<ChevronDown className="size-3.5" strokeWidth={3} />
									</Button>
								</DropdownMenuTrigger>
								<DropdownMenuContent className="w-64 mt-1 backdrop-blur-xl bg-background/95 rounded-xl border-primary-foreground/30 shadow-xl p-2">
									<div className="grid grid-cols-2 gap-1">
										{categories.slice(0, 8).map((cat) => (
											<DropdownMenuItem
												key={cat.categoryId}
												asChild
												className="cursor-pointer rounded-lg"
											>
												<Link to={`/categoria/${cat.slug}`}>{cat.name}</Link>
											</DropdownMenuItem>
										))}
									</div>
									{categories.length > 0 && (
										<>
											<DropdownMenuSeparator className="my-1" />
											<DropdownMenuItem asChild className="cursor-pointer rounded-lg">
												<Link
													to="/categorias"
													className="justify-center w-full font-semibold text-white bg-linear-to-r from-primary to-[#2959b9] hover:scale-95 hover:bg-none transition-all duration-300 ease-out"
												>
													Ver todas as categorias
												</Link>
											</DropdownMenuItem>
										</>
									)}
								</DropdownMenuContent>
							</DropdownMenu>
						</div>

						{/* Mobile search toggle */}
						<Button
							variant="ghost"
							size="icon"
							className="sm:hidden rounded-full size-9"
							onClick={() => {
								setIsMobileSearchOpen((v) => !v);
								setIsMobileMenuOpen(false);
							}}
						>
							{isMobileSearchOpen ? (
								<X className="size-4" />
							) : (
								<Search className="size-4" />
							)}
						</Button>

						{/* Authenticated user */}
						{isAuth ? (
							<DropdownMenu modal={false}>
								<DropdownMenuTrigger asChild>
									<Button
										className="rounded-full font-medium gap-2 bg-linear-to-r from-primary to-[#2959b9]
											hover:text-primary hover:border hover:border-primary hover:bg-transparent
											hover:from-transparent hover:to-transparent transition-all ease-out duration-500 px-3"
									>
										<Avatar className="size-6 rounded-full bg-white/20 flex items-center justify-center">
											<AvatarFallback className="text-xs font-bold text-white leading-none">
												{userInitials}
											</AvatarFallback>
										</Avatar>
										<span className="hidden sm:block text-sm font-semibold">
											{userFullName.split(" ")[0]}
										</span>
										<ChevronDown className="hidden sm:block size-3.5" />
									</Button>
								</DropdownMenuTrigger>
								<DropdownMenuContent className="w-52 mt-1 backdrop-blur-xl bg-background/95 rounded-xl border-primary-foreground/30 shadow-xl">
									<DropdownMenuLabel className="text-xs text-muted-foreground font-normal px-3 py-1.5 truncate">
										{userFullName}
									</DropdownMenuLabel>
									<DropdownMenuSeparator />
									<DropdownMenuItem asChild className="cursor-pointer rounded-lg">
										<Link to="/minha-conta">
											<UserCircle className="size-4" />
											Minha Conta
										</Link>
									</DropdownMenuItem>
									<DropdownMenuItem asChild className="cursor-pointer rounded-lg">
										<Link to="/minha-conta/pedidos">
											<ShoppingBag className="size-4" />
											Minhas Compras
										</Link>
									</DropdownMenuItem>
									<DropdownMenuSeparator />
									<DropdownMenuItem
										variant="destructive"
										className="cursor-pointer rounded-lg"
										onClick={() => logout()}
									>
										<LogOut className="size-4 text-destructive" />
										Sair
									</DropdownMenuItem>
								</DropdownMenuContent>
							</DropdownMenu>
						) : (
							<div className="flex items-center gap-1.5">
								<Link to="/cadastro" className="hidden sm:block">
									<Button
										variant="ghost"
										size="sm"
										className="rounded-full text-sm px-3 font-semibold"
									>
										Cadastrar-se
									</Button>
								</Link>
								<Link to="/login">
									<Button
										size="sm"
										className="rounded-full font-medium gap-2 bg-linear-to-r from-primary to-[#2959b9]
											hover:scale-95 shadow-2xs hover:shadow-xl transition-all duration-300 ease-out px-3"
									>
										<LogIn strokeWidth={2.5} className="size-4" />
										<span className="hidden sm:block text-sm font-semibold">Entrar</span>
									</Button>
								</Link>
							</div>
						)}

						{/* Hamburger — mobile + tablet */}
						<Button
							variant="ghost"
							size="icon"
							className="lg:hidden rounded-full size-9 ml-0.5"
							onClick={() => {
								setIsMobileMenuOpen((v) => !v);
								setIsMobileSearchOpen(false);
							}}
						>
							{isMobileMenuOpen ? (
								<X className="size-4" />
							) : (
								<Menu className="size-4" />
							)}
						</Button>
					</div>
				</div>

				{/* ── Mobile search bar ───────────────────────────── */}
				<AnimatePresence>
					{isMobileSearchOpen && (
						<motion.div
							initial={{ opacity: 0, y: -8 }}
							animate={{ opacity: 1, y: 0 }}
							exit={{ opacity: 0, y: -8 }}
							transition={{ duration: 0.18 }}
							className="sm:hidden mt-2"
						>
							<div ref={mobileSearchRef} className="relative">
								<Search
									className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-white bg-linear-to-b from-primary to-[#2959b9] rounded-full w-6 h-6 p-1"
									strokeWidth={3}
								/>
								<Input
									autoFocus
									type="search"
									placeholder="Buscar eventos..."
									value={query}
									onChange={(e) => handleQueryChange(e.target.value)}
									onKeyDown={(e) => e.key === "Enter" && handleSearch()}
									className="h-10 w-full rounded-full border-primary-foreground/40 bg-background/80 pl-11 pr-4 shadow-md backdrop-blur-xl"
								/>
								<SuggestionsPanel
									show={showSuggestions}
									query={query}
									isLoading={isLoadingSuggestions}
									suggestions={suggestions}
									onSuggestionClick={handleSuggestionClick}
									onShowAll={handleShowAll}
								/>
							</div>
						</motion.div>
					)}
				</AnimatePresence>

				{/* ── Mobile / tablet menu ────────────────────────── */}
				<AnimatePresence>
					{isMobileMenuOpen && (
						<motion.div
							initial="hidden"
							animate="visible"
							exit="exit"
							variants={mobileMenuVariants}
							className="lg:hidden mt-2 rounded-3xl bg-background/90 backdrop-blur-xl border border-primary-foreground/40 shadow-xl overflow-hidden"
						>
							<div className="p-4 space-y-3">
								{/* Nav links */}
								<div className="space-y-0.5">
									<Link
										to="/"
										className="flex items-center px-3 py-2.5 rounded-xl hover:bg-accent/50 transition-colors text-sm font-medium"
									>
										Início
									</Link>
									<Link
										to="/quem-somos"
										className="flex items-center px-3 py-2.5 rounded-xl hover:bg-accent/50 transition-colors text-sm font-medium"
									>
										Quem Somos
									</Link>
								</div>

								{/* Categories grid */}
								{categories.length > 0 && (
									<div>
										<p className="px-3 py-1 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
											Categorias
										</p>
										<div className="grid grid-cols-2 gap-0.5">
											{categories.slice(0, 6).map((cat) => (
												<Link
													key={cat.categoryId}
													to={`/categoria/${cat.slug}`}
													className="px-3 py-2 rounded-xl hover:bg-accent/50 transition-colors text-sm truncate"
												>
													{cat.name}
												</Link>
											))}
										</div>
										<Link
											to="/categorias"
											className="flex items-center gap-1.5 px-3 py-2 mt-0.5 text-sm text-primary font-medium rounded-xl hover:bg-primary/5 transition-colors"
										>
											Ver todas <ArrowRight className="size-3.5" />
										</Link>
									</div>
								)}

								{/* Auth CTA (unauthenticated only) */}
								{!isAuth && (
									<div className="flex gap-2 pt-1 border-t border-primary-foreground/20">
										<Link to="/cadastro" className="flex-1">
											<Button
												variant="outline"
												className="w-full rounded-full text-sm"
											>
												Cadastrar-se
											</Button>
										</Link>
										<Link to="/login" className="flex-1">
											<Button className="w-full rounded-full text-sm bg-linear-to-r from-primary to-[#2959b9]">
												Entrar
											</Button>
										</Link>
									</div>
								)}
							</div>
						</motion.div>
					)}
				</AnimatePresence>
			</div>
		</motion.nav>
	);
};

export default Navbar;
