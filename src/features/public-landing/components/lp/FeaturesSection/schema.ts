import type { FeaturesSectionContent } from "./types";
import {
	Zap,
	Shield,
	TrendingUp,
	Users,
	Clock,
	BarChart3,
	Smartphone,
	Globe,
} from "lucide-react";

export const featuresSectionSchema: FeaturesSectionContent = {
	badge: "Funcionalidades",
	heading: "Tudo que você precisa",
	description: "Uma plataforma completa para criar, vender e gerenciar eventos de forma profissional e descomplicada.",
	features: [
		{
			icon: Zap,
			title: "Vendas Instantâneas",
			description: "Sistema de pagamento integrado com processamento em tempo real. Seus ingressos vendem enquanto você dorme.",
			color: "from-yellow-400 to-orange-500",
		},
		{
			icon: Shield,
			title: "100% Seguro",
			description: "Proteção anti-fraude e criptografia de ponta a ponta. Seus dados e transações sempre protegidos.",
			color: "from-green-400 to-emerald-500",
		},
		{
			icon: TrendingUp,
			title: "Analytics Avançado",
			description: "Dashboards em tempo real com insights profundos sobre vendas, público e performance dos seus eventos.",
			color: "from-blue-400 to-cyan-500",
		},
		{
			icon: Users,
			title: "Gestão de Público",
			description: "Controle total sobre participantes, check-ins digitais e comunicação direta com seu público.",
			color: "from-purple-400 to-pink-500",
		},
		{
			icon: Clock,
			title: "Check-in Rápido",
			description: "Sistema de validação ultrarrápido com QR codes. Atenda centenas de pessoas em minutos.",
			color: "from-indigo-400 to-blue-500",
		},
		{
			icon: BarChart3,
			title: "Relatórios Detalhados",
			description: "Relatórios completos e exportáveis para análise de performance e planejamento futuro.",
			color: "from-teal-400 to-cyan-500",
		},
		{
			icon: Smartphone,
			title: "Mobile First",
			description: "Interface otimizada para qualquer dispositivo. Gerencie seus eventos de qualquer lugar.",
			color: "from-rose-400 to-pink-500",
		},
		{
			icon: Globe,
			title: "Multi-idioma",
			description: "Suporte para múltiplos idiomas e moedas. Expanda seus eventos para o mundo inteiro.",
			color: "from-violet-400 to-purple-500",
		},
	],
};

