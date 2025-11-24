import { useEffect, useState } from "react";

interface UseTypingEffectOptions {
	text: string;
	speed?: number;
	startDelay?: number;
	cursorBlinkSpeed?: number;
}

export const useTypingEffect = ({
	text,
	speed = 125,
	startDelay = 1000,
	cursorBlinkSpeed = 530,
}: UseTypingEffectOptions) => {
	const [displayedText, setDisplayedText] = useState("");
	const [showCursor, setShowCursor] = useState(true);

	useEffect(() => {
		// Delay antes de começar a escrever
		const startDelayTimeout = setTimeout(() => {
			let currentIndex = 0;

			const typeInterval = setInterval(() => {
				if (currentIndex < text.length) {
					setDisplayedText(text.slice(0, currentIndex + 1));
					currentIndex++;
				} else {
					clearInterval(typeInterval);
				}
			}, speed);

			return () => clearInterval(typeInterval);
		}, startDelay);

		// Animação do cursor piscante
		const cursorInterval = setInterval(() => {
			setShowCursor((prev) => !prev);
		}, cursorBlinkSpeed);

		return () => {
			clearTimeout(startDelayTimeout);
			clearInterval(cursorInterval);
		};
	}, [text, speed, startDelay, cursorBlinkSpeed]);

	return { displayedText, showCursor };
};

