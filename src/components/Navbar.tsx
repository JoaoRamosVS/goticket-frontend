import { LogOut, ShoppingCart, User } from "lucide-react";
import { useAuthStore } from "../stores/authStore";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useEffect, useState } from "react";
import type { UserDTO } from "../types";
import userService from "../services/user/index";
import { Avatar, AvatarFallback } from "@radix-ui/react-avatar";

const Navbar = () => {
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
    }, []);

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 px-4 py-3">
            <div className="container mx-auto">
                <div className="flex items-center justify-between px-6 py-4 rounded-full bg-background/60 backdrop-blur-xl border border-card-foreground/05 shadow-2xs">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight bg-linear-to-r from-foreground to-foreground/70 bg-clip-text">
                            GoTicket
                        </h1>
                    </div>
                    <DropdownMenu modal={false}>
                        <DropdownMenuTrigger>
                            <Button className="rounded-full font-medium hover:bg-transparent hover:text-primary hover:border hover:border-primary">
                                <Avatar className="size-5 bg-card rounded-full">
                                    <AvatarFallback className="text-2xs font-semibold text-primary px-1">
                                        {user?.email.charAt(0).toUpperCase()}
                                    </AvatarFallback>
                                </Avatar>
                                <span className="text-sm">{user?.email}</span>
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
                            <DropdownMenuItem className="cursor-pointer" variant="destructive" onClick={handleLogout}>
                                <LogOut className="size-4 text-destructive" />
                                Sair
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;

