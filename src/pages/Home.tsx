import { useEffect, useState } from "react";
import { LogOut, User, Mail } from "lucide-react";

import type { UserDTO } from "../types";

import TimeLeftCard from "../components/TimeLeftCard";
import EventsTable from "../components/EventsTable";

import { useAuthStore } from "../stores/authStore";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

import userService from "../services/user/index";

const Home = () => {
    const [user, setUser] = useState<UserDTO | null>(null);

    const logout = useAuthStore((state) => state.logout);

    useEffect(() => {
        const getUser = async () => {
            const loggedUser: UserDTO = await userService.getUser();
            setUser(loggedUser);
        };
        getUser();
    }, []);

    const handleLogout = () => {
        logout();
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background">
            <div className="container mx-auto px-4 py-8 space-y-8">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text">
                            GoTicket Dashboard
                        </h1>
                        <p className="text-muted-foreground mt-2">
                            Gerencie e visualize seus eventos
                        </p>
                    </div>
                    <Button 
                        variant="outline" 
                        onClick={handleLogout}
                        className="gap-2"
                    >
                        <LogOut className="size-4" />
                        Sair
                    </Button>
                </div>

                <Separator />


                <Card className="shadow-md">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <User className="size-5 text-primary" />
                            Informações do Usuário
                        </CardTitle>
                        <CardDescription>
                            Dados da sua conta
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center gap-4">
                            <Avatar className="size-16 border-2 border-primary/20">
                                <AvatarFallback className="text-lg font-semibold bg-primary/10 text-primary">
                                    {user?.email.charAt(0).toUpperCase()}
                                </AvatarFallback>
                            </Avatar>
                            <div className="flex-1 space-y-1">
                                <div className="flex items-center gap-2">
                                    <Mail className="size-4 text-muted-foreground" />
                                    <span className="font-medium">{user?.email || "Carregando..."}</span>
                                </div>
                                <Badge variant="secondary" className="mt-2">
                                    Usuário autenticado
                                </Badge>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <TimeLeftCard />

                <EventsTable />
            </div>
        </div>
    );
};

export default Home;