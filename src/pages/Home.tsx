import { useEffect, useState } from "react";
import { User, Mail } from "lucide-react";

import type { UserDTO } from "../types";

import TimeLeftCard from "../components/TimeLeftCard";
import EventsTable from "../components/EventsTable";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

import userService from "../services/user/index";

const Home = () => {
    const [user, setUser] = useState<UserDTO | null>(null);

    useEffect(() => {
        const getUser = async () => {
            const loggedUser: UserDTO = await userService.getUser();
            setUser(loggedUser);
        };
        getUser();
    }, []);

    return (
        <div className="min-h-screen bg-linear-to-br from-background via-muted/20 to-background pt-24">
            <div className="container mx-auto px-4 py-8 space-y-8">
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
                                <Badge className="mt-2">
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