import type { HowItWorksSectionContent } from "./types";
import { UserPlus, Calendar, Ticket, CheckCircle2 } from "lucide-react";

export const howItWorksSectionSchema: HowItWorksSectionContent = {
	badge: "Como Funciona",
	heading: "Simples como",
	headingHighlight: "1, 2, 3, 4",
	description: "Em poucos minutos você está pronto para criar e vender ingressos para seu evento",
	steps: [
		{
			number: "01",
			icon: UserPlus,
			title: "Crie sua conta",
			description: "Cadastre-se em menos de 2 minutos. Não precisa de cartão de crédito para começar.",
			color: "from-primary to-cyan-400",
			hoverColorClass: "primary",
		},
		{
			number: "02",
			icon: Calendar,
			title: "Configure seu evento",
			description: "Adicione detalhes, datas, preços e configure tudo do seu jeito. Interface super intuitiva.",
			color: "from-purple-400 to-pink-400",
			hoverColorClass: "purple-400",
		},
		{
			number: "03",
			icon: Ticket,
			title: "Compartilhe e venda",
			description: "Gere links únicos, compartilhe nas redes sociais e comece a vender ingressos imediatamente.",
			color: "from-blue-400 to-indigo-400",
			hoverColorClass: "blue-400",
		},
		{
			number: "04",
			icon: CheckCircle2,
			title: "Gerencie e analise",
			description: "Acompanhe vendas em tempo real, faça check-ins rápidos e analise o desempenho do seu evento.",
			color: "from-green-400 to-emerald-400",
			hoverColorClass: "green-400",
		},
	],
	cta: {
		text: "Preparado para uma nova era de eventos?",
		buttonText: "Começar agora",
		buttonUrl: "/cadastro",
	},
};

