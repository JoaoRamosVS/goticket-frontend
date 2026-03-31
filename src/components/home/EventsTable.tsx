import { useState, useEffect } from "react";
import type { EventMinDTO, EventMinListDTO } from "../../types";
import eventService from "../../services/event/index";
import { ChevronLeft, ChevronRight, Calendar, Hash, FileText } from "lucide-react";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";

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

	const formatDate = (dateString: string) => {
		return new Date(dateString).toLocaleDateString("pt-BR", {
			day: "2-digit",
			month: "2-digit",
			year: "numeric",
			hour: "2-digit",
			minute: "2-digit",
		});
	};

	return (
		events && (
			<Card className="shadow-lg">
				<CardHeader>
					<div className="flex items-center justify-between">
						<div>
							<CardTitle className="text-2xl font-bold flex items-center gap-2">
								<Calendar className="size-6 text-primary" />
								Eventos Disponíveis
							</CardTitle>
							<CardDescription className="mt-2">
								Total de {events.totalElements} eventos encontrados
							</CardDescription>
						</div>
						<Badge variant="secondary" className="text-sm">
							Página {eventPage + 1} de {events.totalPages}
						</Badge>
					</div>
				</CardHeader>
				<CardContent>
					<div className="rounded-md border">
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead className="w-[100px]">
										<div className="flex items-center gap-2">
											<Hash className="size-4 text-muted-foreground" />
											ID
										</div>
									</TableHead>
									<TableHead>
										<div className="flex items-center gap-2">
											<FileText className="size-4 text-muted-foreground" />
											Nome do Evento
										</div>
									</TableHead>
									<TableHead>
										<div className="flex items-center gap-2">
											<Calendar className="size-4 text-muted-foreground" />
											Data de Início
										</div>
									</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{events.eventMinDTOList.length === 0 ? (
									<TableRow>
										<TableCell colSpan={3} className="text-center py-8 text-muted-foreground">
											Nenhum evento encontrado
										</TableCell>
									</TableRow>
								) : (
									events.eventMinDTOList.map((event: EventMinDTO) => (
										<TableRow key={event.eventID} className="hover:bg-muted/50 transition-colors">
											<TableCell className="font-medium">{event.eventID}</TableCell>
											<TableCell className="font-medium">{event.title}</TableCell>
											<TableCell>{formatDate(event.startDate)}</TableCell>
										</TableRow>
									))
								)}
							</TableBody>
						</Table>
					</div>

					<div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6">
						<div className="flex items-center gap-3">
							<Label htmlFor="pageSize" className="text-sm font-medium">
								Eventos por página:
							</Label>
							<Select
								value={eventPageSize.toString()}
								onValueChange={(value) => {
									setEventPageSize(Number(value));
									setEventPage(0);
								}}
							>
								<SelectTrigger id="pageSize" className="w-[120px]">
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="5">5</SelectItem>
									<SelectItem value="10">10</SelectItem>
									<SelectItem value="15">15</SelectItem>
									<SelectItem value="20">20</SelectItem>
								</SelectContent>
							</Select>
						</div>

						<div className="flex gap-2">
							<Button
								variant="outline"
								size="sm"
								onClick={() => setEventPage((page) => page - 1)}
								disabled={eventPage <= 0}
							>
								<ChevronLeft className="size-4 mr-1" />
								Anterior
							</Button>

							<Button
								variant="default"
								size="sm"
								onClick={() => setEventPage((page) => page + 1)}
								disabled={eventPage + 1 >= events.totalPages}
							>
								Próximo
								<ChevronRight className="size-4 ml-1" />
							</Button>
						</div>
					</div>
				</CardContent>
			</Card>
		)
	);
};

export default EventsTable;
