const $ = <T extends HTMLElement>(selector: string) => document.querySelector<T>(selector)
const $$ = (selector: string) => document.querySelectorAll(selector)

resizeTo(1200, 800)

;(() => {
    const controls = $<HTMLFormElement>('#controls')!
    
    controls.addEventListener('submit', async (e) => {
        e.preventDefault()
        const datas = new FormData(controls)
        await fetch('/controls', {
            method: 'POST',
            body: datas
        })
    })
})()

;(() => {
    const canvas = $<HTMLCanvasElement>('#canvas')!
    const ctx = canvas.getContext('2d')
    const image = ctx?.createImageData(800, 800)!
    function draw() {
        image.data.set(new Uint8ClampedArray(
            new Array(800 ** 2 * 4).fill(1).map(_ => Math.random() * 255)
        ))
        ctx?.putImageData(image, 0, 0)
        requestAnimationFrame(draw)
    }
    requestAnimationFrame(draw)
})()