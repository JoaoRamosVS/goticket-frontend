export interface ButtonConfig {
	text: string;
	url: string;
}

export interface AvatarConfig {
	src: string;
	alt: string;
}

export interface ReviewsConfig {
	count: number;
	avatars: AvatarConfig[];
	rating?: number;
}

export interface ImageConfig {
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

