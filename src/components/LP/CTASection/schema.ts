import type { CTASectionContent } from "./types";

export const ctaSectionSchema: CTASectionContent = {
	heading: "E ai, tá pronto para",
	headingHighlight: "transformar",
	description: "Junte-se a milhares de organizadores que já estão criando eventos incríveis com a GoTicket. Comece grátis hoje mesmo!",
	primaryButton: {
		text: "Criar conta gratuita",
		url: "/cadastro",
	},
	secondaryButton: {
		text: "Já tenho uma conta",
		url: "/login",
	},
	features: [
		{ text: "Sem cartão de crédito" },
		{ text: "Setup em 2 minutos" },
		{ text: "Suporte 24/7" },
	],
};

