export default (hexColor: string, amount: number = 0.2): string => {
	let color = hexColor.startsWith("#") ? hexColor.slice(1) : hexColor;
	let num = parseInt(color, 16);

	let r = (num >> 16) - Math.round(255 * amount);
	let g = ((num >> 8) & 0x00ff) - Math.round(255 * amount);
	let b = (num & 0x0000ff) - Math.round(255 * amount);

	r = r < 0 ? 0 : r;
	g = g < 0 ? 0 : g;
	b = b < 0 ? 0 : b;

	return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, "0")}`;
};
