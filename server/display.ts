import { System } from './system.ts';
import { Application, Router } from '../deps.ts';

const app = new Application();

app.use(async (context, next) => {
	try {
		await context.send({
			root: `${Deno.cwd()}/public`,
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
		router.get('/ws', (ctx) => {
			this.#socket = ctx.upgrade();
			this.#socket.onopen = () => console.log('socket opened');
			this.#socket.onerror = (e) => console.log('socket errored:', e);
			this.#socket.onclose = () => console.log('socket closed');
		});

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

		await app.listen({ port: 8080 });
	}

	/**
	 * Update UI
	 * @param bodies
	 */
	update(/*bodies: Body[]*/) {
		if (this.#socket?.readyState === this.#socket?.OPEN) {
			const data = new Uint8Array(
				new Array(800 ** 2 * 4).fill(1).map((_) => Math.random() * 255),
			);
			this.#socket?.send(data);
		}
	}
}
