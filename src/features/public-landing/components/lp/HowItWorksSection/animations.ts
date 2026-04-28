import type { Variants } from "framer-motion";

export const headerVariants: Variants = {
	hidden: {
		opacity: 0,
		y: 20,
	},
	visible: {
		opacity: 1,
		y: 0,
		transition: {
			duration: 0.6,
		},
	},
};

export const getStepVariants = (index: number): Variants => ({
	hidden: {
		opacity: 0,
		y: 30,
	},
	visible: {
		opacity: 1,
		y: 0,
		transition: {
			duration: 0.5,
			delay: index * 0.15,
		},
	},
});

export const ctaVariants: Variants = {
	hidden: {
		opacity: 0,
		y: 20,
	},
	visible: {
		opacity: 1,
		y: 0,
		transition: {
			duration: 0.6,
			delay: 0.8,
		},
	},
};

export const iconHoverVariants = {
	scale: 1.1,
	rotate: 5,
};

export const buttonHoverVariants = {
	scale: 1.05,
};

export const buttonTapVariants = {
	scale: 0.95,
};

