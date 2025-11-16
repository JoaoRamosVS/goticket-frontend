import { useEffect, useState } from "react";

import type { UserDTO } from "../types";

import TimeLeftCard from "../components/TimeLeftCard";
import EventsTable from "../components/EventsTable";

import { useAuthStore } from "../stores/authStore";

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

    return (
        <div className="container mx-auto">
            <h1 className="text-6xl font-bold my-8 text-center">
                Lista de Eventos
            </h1>
            <h1 className="text-6xl font-bold my-8 text-center">
                Seu Email: {user?.email}
            </h1>

            <TimeLeftCard />

            <EventsTable />
        </div>
    );
};

export default Home;