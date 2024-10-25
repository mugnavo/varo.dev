import hsl2hex from "./hsl2hex";

export default () => {
	return hsl2hex(~~(360 * Math.random()), 70, 72, 0.8);
};
