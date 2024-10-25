// Convert names to its initials
export default (name: string) =>
	name
		.split(" ")
		.map(([f]) => f)
		.join("")
		.toUpperCase();
