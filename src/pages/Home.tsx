import { useEffect, useState } from "react";
import type { EventMinDTO, EventMinListDTO, UserDTO } from "../types";
import TimeLeftCard from "../components/TimeLeftCard";
import { useAuthStore } from "../stores/authStore";

import userService from '../services/user/index'
import eventService from '../services/event/index'

const Home = () => {

    const [events, setEvents] = useState<EventMinListDTO | null>(null);
    const [user, setUser] = useState<UserDTO | null>(null);

    const logout = useAuthStore((state) => state.logout);

    useEffect(() => {
        const getEvents = async () => {
            const eventsResponse: EventMinListDTO = await eventService.getEvents();
            setEvents(eventsResponse);
        }
        getEvents();
    }, []);

    useEffect(() => {
        const getUser = async () => {
            const loggedUser: UserDTO = await userService.getUser();
            setUser(loggedUser);
        }
        getUser();
    }, []);

    return (
        <div className="container mx-auto">
            <h1 className="text-6xl font-bold my-8 text-center">Lista de Eventos</h1>
            <h1 className="text-6xl font-bold my-8 text-center">Seu Email: {user?.email}</h1>

            <TimeLeftCard />

            <table className="container mx-auto my-8 table-fixed">
                <thead>
                    <tr className="bg-gray-100">
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID do Evento</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nome do Evento</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Data de Início</th>
                    </tr>
                </thead>
                <tbody>
                    {events && (
                        events.eventMinDTOList.map((event: EventMinDTO) => (
                            <tr key={event.eventID} className="border-b border-gray-200 hover:bg-gray-50">
                                <td>{event.eventID}</td>
                                <td>{event.title}</td>
                                <td>{new Date(event.startDate)
                                    .toLocaleDateString('pt-BR',
                                        {
                                            day: '2-digit',
                                            month: '2-digit',
                                            year: 'numeric',
                                            hour: '2-digit',
                                            minute: '2-digit'
                                        })
                                }
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>

            <button className="bg-red-500 hover:bg-red-800 text-white cursor-pointer font-bold py-2 px-4 rounded-full"
                onClick={() => logout()}
            >
                Desconectar
            </button>
        </div>
    )
}

export default Home