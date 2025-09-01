import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { ignoreWords } from "./constants";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export function getCompanyInitials(name: string) {
	if (!name) return "?";

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

export function formatEffectiveFrom(dateString: string): string {
	if (!dateString || dateString.length !== 8) return dateString;

	const year = dateString.slice(0, 4);
	const month = dateString.slice(4, 6);
	const day = dateString.slice(6, 8);

	return `${year}-${month}-${day}`;
}

export const formatDate = (dateString: string) => {
	return new Date(dateString).toLocaleDateString("en-AU", {
		day: "2-digit",
		month: "short",
		year: "numeric",
	});
};
