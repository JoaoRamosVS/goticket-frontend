export interface FeatureItem {
	text: string;
}

export interface CTASectionContent {
	heading: string;
	headingHighlight: string;
	description: string;
	primaryButton: {
		text: string;
		url: string;
	};
	secondaryButton: {
		text: string;
		url: string;
	};
	features: FeatureItem[];
}

export interface CTASectionProps {
	heading?: string;
	headingHighlight?: string;
	description?: string;
	primaryButton?: {
		text?: string;
		url?: string;
	};
	secondaryButton?: {
		text?: string;
		url?: string;
	};
	features?: FeatureItem[];
}

