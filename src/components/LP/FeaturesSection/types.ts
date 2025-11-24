import type { LucideIcon } from "lucide-react";

export interface Feature {
	icon: LucideIcon;
	title: string;
	description: string;
	color: string;
}

export interface FeaturesSectionContent {
	badge: string;
	heading: string;
	description: string;
	features: Feature[];
}

export interface FeaturesSectionProps {
	badge?: string;
	heading?: string;
	description?: string;
	features?: Feature[];
}

