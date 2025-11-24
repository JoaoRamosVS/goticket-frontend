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

export const getFAQVariants = (index: number): Variants => ({
	hidden: {
		opacity: 0,
		y: 20,
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

export const answerVariants: Variants = {
	hidden: {
		height: 0,
		opacity: 0,
	},
	visible: {
		height: "auto",
		opacity: 1,
		transition: {
			duration: 0.3,
		},
	},
	exit: {
		height: 0,
		opacity: 0,
		transition: {
			duration: 0.3,
		},
	},
};

export const chevronVariants = {
	rotate: 180,
};

