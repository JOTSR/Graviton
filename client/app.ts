const $ = <T extends HTMLElement>(selector: string) =>
	document.querySelector<T>(selector);
// const $$ = (selector: string) => document.querySelectorAll(selector);

resizeTo(1200, 800);

(() => {
	const controls = $<HTMLFormElement>('#controls')!;

	controls.addEventListener('submit', async (e) => {
		e.preventDefault();
		const datas = new FormData(controls);
		await fetch('/controls', {
			method: 'POST',
			body: datas,
		});
	});
})();

(() => {
	const canvas = $<HTMLCanvasElement>('#canvas')!;
	const ctx = canvas.getContext('2d');
	const image = ctx?.createImageData(800, 800)!;

	const ws = new WebSocket('ws://localhost:8080/ws');

    ws.onopen = () => console.log('socket opened')
    ws.onmessage = async ({ data }) => {
        const value = await (data as Blob).arrayBuffer()
        requestAnimationFrame(function () {
            draw(new Uint8Array(value))
        })
    }

	function draw(value: Uint8Array) {
		image.data.set(value);
		ctx?.putImageData(image, 0, 0);
    }
})();
