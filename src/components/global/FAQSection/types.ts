export interface FAQ {
	question: string;
	answer: string;
}

export interface FAQSectionContent {
	badge: string;
	heading: string;
	headingHighlight: string;
	description: string;
	faqs: FAQ[];
}

export interface FAQSectionProps {
	badge?: string;
	heading?: string;
	headingHighlight?: string;
	description?: string;
	faqs?: FAQ[];
}

