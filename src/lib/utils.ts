import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export function getCompanyInitials(name: string) {
	if (!name) return "?";

	const ignoreWords = ["PTY", "LTD", "INC", "LLC", "CO", "CORP", "THE"];
	const words = name
		.toUpperCase()
		.split(" ")
		.filter((w) => !ignoreWords.includes(w));

	const getFirstChar = (word: string) => {
		const match = word.match(/[A-Z0-9]/);
		return match ? match[0] : "";
	};

	const initials = words
		.map((w) => getFirstChar(w))
		.filter((c) => c !== "")
		.slice(0, 2)
		.join("");

	return initials || "?";
}
