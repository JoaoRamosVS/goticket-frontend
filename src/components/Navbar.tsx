import { useEffect, useState } from "react";

import { useAuthStore } from "../stores/authStore";
import type { UserDTO } from "../types";
import userService from "../services/user/index";

import { Button } from "@/components/ui/button";
import { LogIn, LogOut, ShoppingCart, User } from "lucide-react";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@radix-ui/react-avatar";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const Navbar = () => {
	const isAuth = useAuthStore((state) => state.isAuth);

	const logout = useAuthStore((state) => state.logout);
	const handleLogout = () => {
		logout();
	};

	const [user, setUser] = useState<UserDTO | null>(null);

	useEffect(() => {
		const getUser = async () => {
			const loggedUser: UserDTO = await userService.getUser();
			setUser(loggedUser);
		};
		getUser();
	}, [isAuth]);

	// Variantes de animação fadeInDown para a navbar
	const navbarVariants = {
		hidden: {
			opacity: 0,
			y: -80,
			scale: 0.8,
		},
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

	return (
		<motion.nav
			initial="hidden"
			animate="visible"
			variants={navbarVariants}
			className="fixed top-0 left-0 right-0 z-50 px-4 py-3"
		>
			<div className="container mx-auto">
				<div className="flex items-center justify-between pl-6 pr-3 py-3 rounded-full bg-background/60 
					backdrop-blur-xl border border-primary-foreground/50 shadow-2xs"
				>
					<div>
						<Link to={'/'} className="text-2xl font-bold flex gap-2 items-center tracking-tight 
							bg-linear-to-r from-foreground to-foreground/70 bg-clip-text hover:scale-95 hover:gap-1
							transition-all ease-out duration-300"
						>
							<img src="/GoTicketLogo.png" width={40} height={40} /> GoTicket
						</Link>
					</div>

					{isAuth ? (
						<DropdownMenu modal={false}>
							<DropdownMenuTrigger>
								<Button className="rounded-full font-medium border bg-linear-to-r from-primary to-[#2959b9] hover:text-primary 
									hover:border-primary hover:bg-transparent hover:from-transparent hover:to-transparent
									transition-all ease-out duration-500"
								>
									<Avatar className="size-5 bg-card rounded-full">
										<AvatarFallback className="text-2xs font-semibold text-primary px-1">
											{user?.email
												.charAt(0)
												.toUpperCase()}
										</AvatarFallback>
									</Avatar>
									<span className="text-sm">
										{user?.email}
									</span>
								</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent className="w-45 mt-1 transition-all duration-400">
								<DropdownMenuItem className="cursor-pointer">
									<User className="size-4" />
									Perfil
								</DropdownMenuItem>
								<DropdownMenuItem className="cursor-pointer">
									<ShoppingCart className="size-4" />
									Minhas Compras
								</DropdownMenuItem>
								<DropdownMenuItem
									className="cursor-pointer"
									variant="destructive"
									onClick={handleLogout}
								>
									<LogOut className="size-4 text-destructive" />
									Sair
								</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>
					) : (
						<Link to={"/login"}>
							<Button className="rounded-full font-medium gap-4 bg-linear-to-r from-primary to-[#2959b9]
								hover:scale-95 shadow-2xs hover:shadow-2xl hover:gap-2
								transition-all duration-300 ease-out"
							>
								<LogIn strokeWidth={2.5} className="size-5" />
								<span className="text-lg">Entrar</span>
							</Button>
						</Link>
					)}

				</div>
			</div>
		</motion.nav>
	);
};

export default Navbar;
