export const getHoverClasses = (hoverColorClass: string) => {
	const classMap: Record<string, { shadow: string; text: string }> = {
		primary: {
			shadow: "group-hover:shadow-primary/20",
			text: "group-hover:text-primary/20",
		},
		"purple-400": {
			shadow: "group-hover:shadow-purple-400/20",
			text: "group-hover:text-purple-400/20",
		},
		"blue-400": {
			shadow: "group-hover:shadow-blue-400/20",
			text: "group-hover:text-blue-400/20",
		},
		"green-400": {
			shadow: "group-hover:shadow-green-400/20",
			text: "group-hover:text-green-400/20",
		},
	};

	return classMap[hoverColorClass] || classMap.primary;
};

