export default (h: number, s: number, l: number, alpha: number) => {
	l /= 100;
	const a = (s * Math.min(l, 1 - l)) / 100;
	const f = (n: number) => {
		const k = (n + h / 30) % 12;
		const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
		return Math.round(255 * color)
			.toString(16)
			.padStart(2, "0");
		// convert to Hex and prefix "0" if needed
	};
	//alpha conversion
	alpha = Math.round(alpha * 255);

	return `#${f(0)}${f(8)}${f(4)}${alpha.toString(16).padStart(2, "0")}`;
};
