import { useState, useEffect, useRef } from "react";
import { useScroll, useTransform, MotionValue } from "framer-motion";
import Lenis from "lenis";

export const useParallax = () => {
	const gallery = useRef<HTMLDivElement>(null);
	const [dimension, setDimension] = useState({ width: 0, height: 0 });

	const { scrollYProgress } = useScroll({
		target: gallery,
		offset: ["start end", "end start"],
	});

	const { height } = dimension;
	const y = useTransform(scrollYProgress, [0, 1], [0, height * 2]);
	const y2 = useTransform(scrollYProgress, [0, 1], [0, height * 3.3]);
	const y3 = useTransform(scrollYProgress, [0, 1], [0, height * 1.25]);
	const y4 = useTransform(scrollYProgress, [0, 1], [0, height * 3]);

	useEffect(() => {
		const lenis = new Lenis();

		const raf = (time: number) => {
			lenis.raf(time);
			requestAnimationFrame(raf);
		};

		const resize = () => {
			setDimension({ width: window.innerWidth, height: window.innerHeight });
		};

		window.addEventListener("resize", resize);
		requestAnimationFrame(raf);
		resize();

		return () => {
			window.removeEventListener("resize", resize);
		};
	}, []);

	return { gallery, y, y2, y3, y4 };
};

