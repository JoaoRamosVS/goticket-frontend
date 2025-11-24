import type { FAQSectionContent } from "./types";

export const faqSectionSchema: FAQSectionContent = {
	badge: "FAQ",
	heading: "Dúvidas",
	headingHighlight: "Frequentes",
	description: "Tire suas dúvidas sobre a plataforma e descubra como podemos ajudar você",
	faqs: [
		{
			question: "Quanto custa usar a GoTicket?",
			answer: "Oferecemos um plano gratuito para começar, com taxas competitivas apenas sobre as vendas realizadas. Não há mensalidade ou taxa de setup. Você paga apenas quando vende ingressos.",
		},
		{
			question: "Como funciona o processo de pagamento?",
			answer: "Os pagamentos são processados de forma segura e os valores são transferidos diretamente para sua conta. Você pode acompanhar todas as transações em tempo real no painel de controle.",
		},
		{
			question: "Posso personalizar os ingressos?",
			answer: "Sim! Você pode personalizar completamente os ingressos com seu logo, cores, informações do evento e muito mais. Também oferecemos templates prontos para facilitar.",
		},
		{
			question: "A plataforma funciona em dispositivos móveis?",
			answer: "Sim! A GoTicket é totalmente responsiva e funciona perfeitamente em smartphones e tablets. Você pode gerenciar seus eventos de qualquer lugar.",
		},
		{
			question: "Como funciona o check-in no evento?",
			answer: "O check-in é super simples! Cada ingresso tem um QR code único. Basta escanear com qualquer smartphone usando nosso app ou site. O processo é rápido e não requer internet no local.",
		},
		{
			question: "Posso vender ingressos para eventos gratuitos?",
			answer: "Claro! Você pode criar eventos gratuitos sem nenhum custo. É perfeito para workshops, palestras e eventos comunitários.",
		},
		{
			question: "Há limite de eventos ou ingressos?",
			answer: "No plano gratuito, você pode criar eventos ilimitados. Para eventos maiores, oferecemos planos premium com recursos adicionais e suporte prioritário.",
		},
		{
			question: "O que acontece se meu evento for cancelado?",
			answer: "Você tem controle total sobre reembolsos. Pode configurar políticas de cancelamento e processar reembolsos diretamente pela plataforma. Nosso suporte está sempre disponível para ajudar.",
		},
	],
};

