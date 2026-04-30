interface ButtonConfig {
	text: string;
	url: string;
}

interface AvatarConfig {
	src: string;
	alt: string;
}

interface ReviewsConfig {
	count: number;
	avatars: AvatarConfig[];
	rating?: number;
}

interface ImageConfig {
	src: string;
	alt: string;
}

export interface HeroSectionContent {
	heading: string;
	headingSubTitle: string;
	description: string;
	buttons: {
		primary?: ButtonConfig;
		secondary?: ButtonConfig;
	};
	reviews: ReviewsConfig;
	image: ImageConfig;
}

export interface HeroSectionProps {
	heading?: string;
	headingSubTitle?: string;
	description?: string;
	buttons?: {
		primary?: ButtonConfig;
		secondary?: ButtonConfig;
	};
	reviews?: ReviewsConfig;
	image?: ImageConfig;
}

