import { useState } from "react";

export const useFAQ = (initialIndex: number | null = 0) => {
	const [openIndex, setOpenIndex] = useState<number | null>(initialIndex);

	const toggleFAQ = (index: number) => {
		setOpenIndex(openIndex === index ? null : index);
	};

	return { openIndex, toggleFAQ };
};

