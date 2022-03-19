const $ = <T extends HTMLElement>(selector: string) =>
	document.querySelector<T>(selector);
// const $$ = (selector: string) => document.querySelectorAll(selector);

resizeTo(1200, 800);

(() => {
	const controls = $<HTMLFormElement>('#controls')!;

	controls.querySelectorAll<HTMLInputElement>('input[type="range"]').forEach(
		(input) => {
			const placholder = $(`label[for="${input.name}"]`)?.querySelector('font');
			if (placholder) {
				placholder.innerText = input.value;
			}
			input.addEventListener('change', () => {
				const placholder = $(`label[for="${input.name}"]`)?.querySelector(
					'font',
				);
				if (placholder) {
					placholder.innerText = input.value;
				}
			});
		},
	);

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

	try {
		const ws = new WebSocket('ws://localhost:8080/ws');
		let startDelay = Date.now()

		ws.onopen = () => console.log('socket opened');
		ws.onmessage = async ({ data }) => {
			const value = await (data as Blob).arrayBuffer();
			requestAnimationFrame(function () {
				showFps(Date.now() - startDelay)
				startDelay = Date.now()
				draw(new Uint8Array(value));
			});
		};
	} catch (e) {
		console.error(e);
	}

	function draw(value: Uint8Array) {
		image.data.set(value);
		ctx?.putImageData(image, 0, 0);
	}
})();

function showFps(delay: number) {
	const counter = $('#fps_count')
	if (!counter) return
	const fps = Math.round(1000 / delay)
	counter.innerText = `${fps} fps`
}
