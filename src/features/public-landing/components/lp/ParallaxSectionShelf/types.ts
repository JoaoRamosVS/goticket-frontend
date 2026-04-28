export interface ParallaxSectionShelfContent {
	images: string[];
}

export interface ParallaxSectionShelfProps {
	images?: string[];
}

export interface ColumnProps {
	images: string[];
	y: any; // MotionValue<number> from framer-motion
}

