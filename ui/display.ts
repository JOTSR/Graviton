import { System } from '../system/system.ts';
import { Application, Router } from '../deps.ts';

/**
 * Serve UI
 */
const app = new Application();

app.use(async (context, next) => {
	try {
		await context.send({
			root: `${Deno.cwd()}/ui/public`,
			index: 'index.html',
		});
	} catch {
		next();
	}
});

export class Display {
	#socket?: WebSocket;
	#system: System;
	/**
	 * Display the system in a GUI
	 * @param system
	 */
	constructor(system: System) {
		this.#system = system;
	}

	/**
	 * Start UI
	 */
	async start() {
		const router = new Router();
		//Handle canvas connection to display bodies
		router.get('/ws', (ctx) => {
			this.#socket = ctx.upgrade();
			this.#socket.onopen = () => console.log('socket opened');
			this.#socket.onerror = (e) => console.log('socket errored:', e);
			this.#socket.onclose = () => console.log('socket closed');
		});

		/**
		 * Handle controls update
		 */
		router.post('/controls', async (ctx) => {
			const body = ctx.request.body({ type: 'form-data' });
			const formData = await body.value.read();
			this.#system.configFromUI(formData.fields);
		});

		app.addEventListener('listen', async () => {
			const cmd = [
				'pwsh',
				'/c',
				'Start-Process chrome -ArgumentList "--app=http://localhost:8080"',
			];
			const process = Deno.run({ cmd });
			await process.status();
		});

		app.use(router.routes());
		app.use(router.allowedMethods());

		//Start server on http://localhost:8080
		await app.listen({ port: 8080 });
	}

	/**
	 * Update UI
	 * @param pixelArray
	 */
	update(pixelArray: Uint8ClampedArray) {
		if (this.#socket?.readyState === this.#socket?.OPEN) {
			this.#socket?.send(pixelArray);
		}
	}
}
