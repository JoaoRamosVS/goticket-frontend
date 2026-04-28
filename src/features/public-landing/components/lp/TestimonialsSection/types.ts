export interface Testimonial {
	name: string;
	role: string;
	company: string;
	image: string;
	rating: number;
	text: string;
}

export interface TestimonialsSectionContent {
	badge: string;
	heading: string;
	headingHighlight: string;
	description: string;
	testimonials: Testimonial[];
}

export interface TestimonialsSectionProps {
	badge?: string;
	heading?: string;
	headingHighlight?: string;
	description?: string;
	testimonials?: Testimonial[];
}

