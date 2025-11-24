import type { Variants, Transition } from "framer-motion";

export const textVariants: Variants = {
	hidden: {
		opacity: 0,
		scale: 0,
		x: -50,
	},
	visible: {
		opacity: 1,
		scale: 1,
		x: 0,
		transition: {
			type: "spring" as const,
			stiffness: 80,
			damping: 15,
			mass: 1,
			delay: 0.5,
		},
	},
};

export const imageInitial = {
	opacity: 0,
	scale: 0,
	x: 50,
};

export const imageAnimate = {
	opacity: 1,
	scale: 1,
	x: 0,
	y: [0, -20, 0],
};

export const imageTransition: Transition = {
	opacity: {
		type: "spring" as const,
		stiffness: 80,
		damping: 15,
		mass: 1,
		delay: 0.75,
	},
	scale: {
		type: "spring" as const,
		stiffness: 80,
		damping: 15,
		mass: 1,
		delay: 0.75,
	},
	x: {
		type: "spring" as const,
		stiffness: 80,
		damping: 15,
		mass: 1,
		delay: 0.75,
	},
	y: {
		duration: 2,
		repeat: Infinity,
		repeatType: "reverse" as const,
		ease: "easeInOut",
		delay: 1.5,
	},
};

