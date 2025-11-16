import { LogOut } from "lucide-react";
import { useAuthStore } from "../stores/authStore";
import { Button } from "@/components/ui/button";

const Navbar = () => {
    const logout = useAuthStore((state) => state.logout);

    const handleLogout = () => {
        logout();
    };

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 px-4 py-3">
            <div className="container mx-auto">
                <div className="flex items-center justify-between px-6 py-4 rounded-full bg-background/60 backdrop-blur-xl border border-card-foreground/05 shadow-2xs">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text">
                            GoTicket
                        </h1>
                    </div>
                    <Button 
                        variant="destructive" 
                        onClick={handleLogout}
                        className="gap-2 rounded-full cursor-pointer"
                    >
                        <LogOut className="size-4" />
                        Sair
                    </Button>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;

