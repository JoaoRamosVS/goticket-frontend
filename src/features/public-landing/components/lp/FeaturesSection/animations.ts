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

export const getCardVariants = (index: number): Variants => ({
	hidden: {
		opacity: 0,
		y: 30,
	},
	visible: {
		opacity: 1,
		y: 0,
		transition: {
			duration: 0.5,
			delay: index * 0.1,
		},
	},
});

export const iconHoverVariants = {
	scale: 1.1,
	rotate: 5,
};

