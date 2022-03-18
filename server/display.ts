import { Body } from "./definitions.ts";
import { System } from './system.ts'
import { Application } from '../deps.ts'

const app = new Application()

app.use(async (context, next) => {
  try {
    await context.send({
      root: `${Deno.cwd()}/public`,
      index: 'index.html',
    })
  } catch {
    next()
  }
})

export class Display {
    /**
     * Display the system in a GUI
     * @param system 
     */
    constructor(system: System) {
        // throw new Error('Not implemented')
    }

    /**
     * Start UI
     */
    async start() {
        app.addEventListener('listen', async () => {
            const cmd = ['pwsh', '/c', 'Start-Process chrome -ArgumentList "--app=http://localhost:8080"']
            const process = Deno.run({ cmd })
            await process.status()
        })
        await app.listen({ port: 8080 })
    }

    /**
     * Update UI
     * @param bodies 
     */
    update(bodies: Body[]) {
        throw new Error('Not implemented')
    }
}