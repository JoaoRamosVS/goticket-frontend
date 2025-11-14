import { useEffect, useState } from "react";
import api from "../services/api";
import type { EventMinDTO, EventMinListDTO } from "../types";

const DashboardPage = (): React.ReactNode => {

    const [events, setEvents] = useState<EventMinListDTO | null>(null);
    const [timeLeft, setTimeLeft] = useState<number>(0);

    useEffect(() => {
        const updateVisualTimer = () => {
            const expirationSorted = localStorage.getItem('tokenExpiration');
            if(!expirationSorted) setTimeLeft(0);

            const now = Date.now();
            const differenceTime = Number(expirationSorted) - now;

            setTimeLeft(differenceTime > 0 ? Math.floor(differenceTime / 1000) : 0)
        }

        updateVisualTimer();
        const timer = setInterval(updateVisualTimer, 1000)

        return () => clearInterval(timer);
    }, []);

    useEffect(() => {
        const getEvents = async () => {
            const eventsResponse: EventMinListDTO = await api.getEvents();
            setEvents(eventsResponse);
        }
        getEvents();
    }, []);

    return (
        <>
            <h1 className="text-6xl font-bold my-8 text-center">Lista de Eventos</h1>

            <div className="container mx-auto my-8 bg-emerald-800 text-white text-center font-semibold text-2xl p-4 rounded-full">Seu login expira em: {timeLeft} segundos</div>

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
        </>
    )
}

export default DashboardPage