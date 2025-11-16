import { useState, useEffect } from "react";
import type { EventMinDTO,EventMinListDTO } from "../types";
import eventService from "../services/event/index";

const EventsTable = () => {
	const [events, setEvents] = useState<EventMinListDTO | null>(null);
	const [eventPage, setEventPage] = useState<number>(0);
	const [eventPageSize, setEventPageSize] = useState<number>(10);

	useEffect(() => {
		const getEvents = async () => {
			const eventsResponse: EventMinListDTO =
				await eventService.getEvents(eventPage, eventPageSize);
			setEvents(eventsResponse);
		};
		getEvents();
	}, [eventPage, eventPageSize]);

	return (
		events && (
			<>
				<table className="container mx-auto my-8 table-fixed">
					<thead>
						<tr className="bg-gray-100">
							<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
								ID do Evento
							</th>
							<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
								Nome do Evento
							</th>
							<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
								Data de Início
							</th>
						</tr>
					</thead>

					<tbody>
						{events.eventMinDTOList.map((event: EventMinDTO) => (
							<tr
								key={event.eventID}
								className="border-b border-gray-200 hover:bg-gray-50"
							>
								<td>{event.eventID}</td>
								<td>{event.title}</td>
								<td>
									{new Date(
										event.startDate
									).toLocaleDateString("pt-BR", {
										day: "2-digit",
										month: "2-digit",
										year: "numeric",
										hour: "2-digit",
										minute: "2-digit",
									})}
								</td>
							</tr>
						))}
					</tbody>
				</table>

				<div className="flex w-auto justify-between mb-12">
                    <label className="flex gap-3 items-center">
                        Eventos por página: 
                        <select
                            className="border border-gray-300 rounded-md p-2"
                            value={eventPageSize}
                            onChange={(e) => setEventPageSize(Number(e.target.value))}
                        >
                            <option value={5}>5</option>
                            <option value={10}>10</option>
                            <option value={15}>15</option>
                            <option value={20}>20</option>
                        </select>
                    </label>

					<div className="flex gap-3">
						<button
							className="bg-gray-400 hover:bg-gray-500 disabled:opacity-20 disabled:pointer-events-none text-white cursor-pointer font-bold py-2 px-4 rounded-full"
							onClick={() => setEventPage((page) => page - 1)}
							disabled={eventPage <= 0}
						>
							Anterior
						</button>

						<button
							className="bg-green-600 hover:bg-green-800 disabled:opacity-20 disabled:pointer-events-none text-white cursor-pointer font-bold py-2 px-4 rounded-full"
							onClick={() => setEventPage((page) => page + 1)}
							disabled={eventPage + 1 >= events.totalPages}
						>
							Próximo
						</button>
					</div>
				</div>
			</>
		)
	);
};

export default EventsTable;
