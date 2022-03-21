/**
 * Fast inverse square root
 */
//https://fr.wikipedia.org/wiki/Racine_carr%C3%A9e_inverse_rapide
//https://stackoverflow.com/questions/41414426/faster-alternative-to-math-sqrt
const m = 0x5F375A86;
// Creating the buffer and view outside the function
// for performance, but this is not thread safe like so:
const buffer = new ArrayBuffer(4);
const view = new DataView(buffer);

export function fastInvSqrt(n: number) {
	n = Math.abs(n);
	const n2 = n * 0.5;
	const th = 1.5;
	view.setFloat32(0, n);
	view.setUint32(0, m - (view.getUint32(0) >> 1));
	let f = view.getFloat32(0);
	f *= th - (n2 * f * f);
	f *= th - (n2 * f * f);
	return f;
}
