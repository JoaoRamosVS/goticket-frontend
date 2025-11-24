import type { LucideIcon } from "lucide-react";

export interface Step {
	number: string;
	icon: LucideIcon;
	title: string;
	description: string;
	color: string;
	hoverColorClass: string;
}

export interface HowItWorksSectionContent {
	badge: string;
	heading: string;
	headingHighlight: string;
	description: string;
	steps: Step[];
	cta: {
		text: string;
		buttonText: string;
		buttonUrl: string;
	};
}

export interface HowItWorksSectionProps {
	badge?: string;
	heading?: string;
	headingHighlight?: string;
	description?: string;
	steps?: Step[];
	cta?: {
		text?: string;
		buttonText?: string;
		buttonUrl?: string;
	};
}

