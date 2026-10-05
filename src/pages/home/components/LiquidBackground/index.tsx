import { useEffect, useRef } from 'react'
import styles from './styles.module.css'
import { drawForm, type FormName } from './forms'
import soundUrl from '../../../../assets/sound.mp3'
import { StirSound } from './sound'

const CELL = 3
const DAMPING = 0.94
const WAVE_SPEED = 0.26

const COFFEE = { r: 78, g: 48, b: 28 }
const CREMA = { r: 175, g: 118, b: 68 }
const MILK = { r: 250, g: 240, b: 222 }

const REFRACTION = 0.28
const STIR = 0.55

const LIGHT = { x: -0.3, y: -0.4, z: 0.9 }
const SHADE = 0.12
const SPECULAR = 10

const WATER = { r: 255, g: 248, b: 232 }
const WATER_TINT = 0.06

interface LiquidBackgroundProps {
    form?: FormName | 'random'
}

export function LiquidBackground({ form = 'random' }: LiquidBackgroundProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null)

    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return

        const ctx = canvas.getContext('2d')
        if (!ctx) return

        const buffer = document.createElement('canvas')
        const bctx = buffer.getContext('2d')
        if (!bctx) return

        const stirSound = new StirSound()
        void stirSound.load(soundUrl)

        const unlock = () => {
            void stirSound.unlock()

            window.removeEventListener('pointerdown', unlock)
            window.removeEventListener('keydown', unlock)
            window.removeEventListener('touchstart', unlock)
        }

        window.addEventListener('pointerdown', unlock, { passive: true })
        window.addEventListener('keydown', unlock)
        window.addEventListener('touchstart', unlock, { passive: true })

        let width = 0
        let height = 0
        let cols = 0
        let rows = 0
        let current = new Float32Array(0)
        let previous = new Float32Array(0)
        let image: ImageData
        let texture = new Float32Array(0)
        let animationFrame = 0
        let lastTime = 0

        let lastX = -1
        let lastY = -1

        let cancelled = false
        let buildId = 0

        const buildTexture = async () => {
            const id = ++buildId

            const t = document.createElement('canvas')
            t.width = cols
            t.height = rows

            const tctx = t.getContext('2d')
            if (!tctx) return

            const rgba = (c: { r: number; g: number; b: number }, a: number) =>
                `rgba(${c.r}, ${c.g}, ${c.b}, ${a})`

            const bgSize = Math.max(cols, rows)

            tctx.fillStyle = rgba(COFFEE, 1)
            tctx.fillRect(0, 0, cols, rows)

            for (let n = 0; n < 24; n++) {
                const x = Math.random() * cols
                const y = Math.random() * rows
                const radius = bgSize * (0.05 + Math.random() * 0.1)
                const dark = Math.random() > 0.5
                const c = dark
                    ? { r: COFFEE.r * 0.6, g: COFFEE.g * 0.6, b: COFFEE.b * 0.6 }
                    : { r: CREMA.r * 0.8, g: CREMA.g * 0.8, b: CREMA.b * 0.8 }

                const g = tctx.createRadialGradient(x, y, 0, x, y, radius)
                g.addColorStop(0, rgba(c, 0.35))
                g.addColorStop(1, rgba(c, 0))

                tctx.fillStyle = g
                tctx.fillRect(0, 0, cols, rows)
            }

            const SLOTS = 4
            const slotW = cols / SLOTS
            const cupR = Math.min(slotW, rows) * 0.36

            for (let slot = 0; slot < SLOTS; slot++) {
                const slotX0 = slot * slotW
                const cx = slotX0 + slotW / 2 + (Math.random() - 0.5) * slotW * 0.05
                const cy = rows / 2 + (Math.random() - 0.5) * rows * 0.05

                const haloR = cupR * 1.35
                const haloN = 32

                for (let n = 0; n < haloN; n++) {
                    const angle = (n / haloN) * Math.PI * 2 + (Math.random() - 0.5) * 0.3
                    const rr = haloR * (0.9 + Math.random() * 0.25)
                    const x = cx + Math.cos(angle) * rr
                    const y = cy + Math.sin(angle) * rr
                    const radius = cupR * (0.25 + Math.random() * 0.2)

                    const g = tctx.createRadialGradient(x, y, 0, x, y, radius)
                    g.addColorStop(0, rgba(CREMA, 0.85))
                    g.addColorStop(1, rgba(CREMA, 0))

                    tctx.fillStyle = g
                    tctx.fillRect(0, 0, cols, rows)
                }

                await drawForm(tctx, form, cx, cy, cupR, MILK)

                for (let n = 0; n < 6; n++) {
                    const angle = Math.random() * Math.PI * 2
                    const dist = Math.random() * cupR * 0.9
                    const x = cx + Math.cos(angle) * dist
                    const y = cy + Math.sin(angle) * dist
                    const radius = cupR * (0.18 + Math.random() * 0.28)

                    const g = tctx.createRadialGradient(x, y, 0, x, y, radius)
                    g.addColorStop(0, 'rgba(190, 158, 122, 0.28)')
                    g.addColorStop(1, 'rgba(190, 158, 122, 0)')

                    tctx.fillStyle = g
                    tctx.fillRect(0, 0, cols, rows)
                }

                const micro = Math.floor((slotW * rows) / 12)

                for (let n = 0; n < micro; n++) {
                    const x = slotX0 + Math.random() * slotW
                    const y = Math.random() * rows
                    const dx = x - cx
                    const dy = y - cy
                    const d = Math.sqrt(dx * dx + dy * dy)
                    const chance = d < cupR * 1.15 ? 0.9 : 0.15

                    if (Math.random() > chance) continue

                    const r = 0.35 + Math.random() * 0.9

                    tctx.beginPath()
                    tctx.arc(x, y, r, 0, Math.PI * 2)
                    tctx.fillStyle = `rgba(255, 248, 232, ${0.06 + Math.random() * 0.14})`
                    tctx.fill()
                }

                const bubbles = 12 + Math.floor(Math.random() * 12)

                for (let n = 0; n < bubbles; n++) {
                    const angle = Math.random() * Math.PI * 2
                    const dist = Math.random() * cupR * 1.05
                    const x = cx + Math.cos(angle) * dist + (Math.random() - 0.5) * 2
                    const y = cy + Math.sin(angle) * dist + (Math.random() - 0.5) * 2
                    const r = 0.6 + Math.random() * 1.4

                    const g = tctx.createRadialGradient(
                        x - r * 0.35,
                        y - r * 0.35,
                        0,
                        x,
                        y,
                        r
                    )
                    g.addColorStop(0, 'rgba(255, 252, 244, 0.7)')
                    g.addColorStop(0.65, 'rgba(255, 245, 228, 0.3)')
                    g.addColorStop(1, 'rgba(120, 82, 55, 0.08)')

                    tctx.beginPath()
                    tctx.arc(x, y, r, 0, Math.PI * 2)
                    tctx.fillStyle = g
                    tctx.fill()

                    tctx.beginPath()
                    tctx.arc(x, y, r, 0, Math.PI * 2)
                    tctx.strokeStyle = `rgba(70, 42, 22, ${0.06 + Math.random() * 0.12})`
                    tctx.lineWidth = 0.35
                    tctx.stroke()
                }
            }

            for (let n = 0; n < 30; n++) {
                const x = Math.random() * cols
                const y = Math.random() * rows
                const r = 0.3 + Math.random() * 0.5

                tctx.beginPath()
                tctx.arc(x, y, r, 0, Math.PI * 2)
                tctx.fillStyle = `rgba(255, 228, 190, ${0.05 + Math.random() * 0.08})`
                tctx.fill()
            }

            const vg = tctx.createRadialGradient(
                cols / 2,
                rows / 2,
                bgSize * 0.4,
                cols / 2,
                rows / 2,
                bgSize * 0.9
            )
            vg.addColorStop(0, 'rgba(0, 0, 0, 0)')
            vg.addColorStop(1, 'rgba(0, 0, 0, 0.28)')

            tctx.fillStyle = vg
            tctx.fillRect(0, 0, cols, rows)

            if (cancelled || id !== buildId) return

            texture = Float32Array.from(tctx.getImageData(0, 0, cols, rows).data)
        }

        const resize = () => {
            width = canvas.clientWidth
            height = canvas.clientHeight

            canvas.width = width
            canvas.height = height

            cols = Math.ceil(width / CELL)
            rows = Math.ceil(height / CELL)

            buffer.width = cols
            buffer.height = rows

            current = new Float32Array(cols * rows)
            previous = new Float32Array(cols * rows)

            image = bctx.createImageData(cols, rows)
            void buildTexture()
        }

        const disturb = (
            cx: number,
            cy: number,
            radius: number,
            strength: number
        ) => {
            const r = Math.ceil(radius)

            for (let y = -r; y <= r; y++) {
                for (let x = -r; x <= r; x++) {
                    const px = cx + x
                    const py = cy + y

                    if (px < 1 || py < 1 || px >= cols - 1 || py >= rows - 1) continue

                    const dist = Math.sqrt(x * x + y * y)
                    if (dist > radius) continue

                    const falloff = 0.5 * (1 + Math.cos((dist / radius) * Math.PI))
                    current[py * cols + px] += strength * falloff
                }
            }
        }

        const stir = (
            cx: number,
            cy: number,
            vx: number,
            vy: number,
            radius: number
        ) => {
            if (texture.length !== cols * rows * 4) return

            const r = Math.ceil(radius)

            const x0 = Math.max(1, cx - r)
            const x1 = Math.min(cols - 2, cx + r)
            const y0 = Math.max(1, cy - r)
            const y1 = Math.min(rows - 2, cy + r)

            if (x1 <= x0 || y1 <= y0) return

            const w = x1 - x0 + 1
            const h = y1 - y0 + 1

            const snap = new Float32Array(w * h * 4)

            for (let y = 0; y < h; y++) {
                const from = ((y0 + y) * cols + x0) * 4
                snap.set(texture.subarray(from, from + w * 4), y * w * 4)
            }

            for (let y = y0; y <= y1; y++) {
                for (let x = x0; x <= x1; x++) {
                    const dx = x - cx
                    const dy = y - cy
                    const dist = Math.sqrt(dx * dx + dy * dy)

                    if (dist > radius) continue

                    const falloff = 0.5 * (1 + Math.cos((dist / radius) * Math.PI))

                    let sx = x - vx * falloff * STIR - x0
                    let sy = y - vy * falloff * STIR - y0

                    sx = Math.max(0, Math.min(w - 1.001, sx))
                    sy = Math.max(0, Math.min(h - 1.001, sy))

                    const ix = Math.floor(sx)
                    const iy = Math.floor(sy)
                    const fx = sx - ix
                    const fy = sy - iy

                    const a = (iy * w + ix) * 4
                    const b = a + 4
                    const c = a + w * 4
                    const d = c + 4

                    const p = (y * cols + x) * 4

                    for (let k = 0; k < 3; k++) {
                        const top = snap[a + k] * (1 - fx) + snap[b + k] * fx
                        const bottom = snap[c + k] * (1 - fx) + snap[d + k] * fx

                        texture[p + k] = top * (1 - fy) + bottom * fy
                    }
                }
            }
        }

        const handlePointerMove = (event: PointerEvent) => {
            const rect = canvas.getBoundingClientRect()
            const x = event.clientX - rect.left
            const y = event.clientY - rect.top

            if (x < 0 || y < 0 || x > rect.width || y > rect.height) {
                lastX = -1
                stirSound.stop()
                return
            }

            if (lastX < 0) {
                lastX = x
                lastY = y
                return
            }

            const dx = x - lastX
            const dy = y - lastY
            const distance = Math.sqrt(dx * dx + dy * dy)

            stirSound.play(Math.min(distance / 30, 1))

            const strength = Math.min(distance * 2.5, 90)
            const steps = Math.max(1, Math.ceil(distance / (CELL * 2)))
            const stepStrength = strength / steps

            for (let i = 0; i < steps; i++) {
                const t = i / steps
                const cx = Math.floor((lastX + dx * t) / CELL)
                const cy = Math.floor((lastY + dy * t) / CELL)

                disturb(cx, cy, 4, stepStrength)

                stir(cx, cy, dx / CELL / steps, dy / CELL / steps, 6)
            }

            lastX = x
            lastY = y
        }

        const handlePointerLeave = () => {
            lastX = -1
            stirSound.stop()
        }

        let nextDrop = 0

        const ambientDrop = (time: number) => {
            if (time < nextDrop) return

            nextDrop = time + 3000 + Math.random() * 3500

            disturb(
                Math.floor(Math.random() * cols),
                Math.floor(Math.random() * rows),
                3,
                25 + Math.random() * 25
            )
        }

        const simulate = () => {
            for (let y = 1; y < rows - 1; y++) {
                for (let x = 1; x < cols - 1; x++) {
                    const i = y * cols + x

                    const sum =
                        current[i - 1] +
                        current[i + 1] +
                        current[i - cols] +
                        current[i + cols]

                    const value =
                        WAVE_SPEED * sum +
                        (2 - 4 * WAVE_SPEED) * current[i] -
                        previous[i]

                    previous[i] = value * DAMPING
                }
            }

            const temp = current
            current = previous
            previous = temp
        }

        const softClip = (v: number) => (v < 0 ? 0 : v > 255 ? 255 : v)

        const render = () => {
            if (texture.length !== cols * rows * 4) return

            const data = image.data
            const maxOffset = 12

            for (let y = 1; y < rows - 1; y++) {
                for (let x = 1; x < cols - 1; x++) {
                    const i = y * cols + x

                    let ox = (current[i - 1] - current[i + 1]) * REFRACTION
                    let oy = (current[i - cols] - current[i + cols]) * REFRACTION

                    ox = Math.max(-maxOffset, Math.min(maxOffset, ox))
                    oy = Math.max(-maxOffset, Math.min(maxOffset, oy))

                    const sx = Math.max(0, Math.min(cols - 1.001, x + ox))
                    const sy = Math.max(0, Math.min(rows - 1.001, y + oy))

                    const x0 = Math.floor(sx)
                    const y0 = Math.floor(sy)
                    const fx = sx - x0
                    const fy = sy - y0

                    const a = (y0 * cols + x0) * 4
                    const b = a + 4
                    const c = a + cols * 4
                    const d = c + 4

                    const p = i * 4

                    for (let k = 0; k < 3; k++) {
                        const top = texture[a + k] * (1 - fx) + texture[b + k] * fx
                        const bottom = texture[c + k] * (1 - fx) + texture[d + k] * fx
                        data[p + k] = top * (1 - fy) + bottom * fy
                    }

                    data[p + 3] = 255

                    const gx = (current[i - 1] - current[i + 1]) * 0.08
                    const gy = (current[i - cols] - current[i + cols]) * 0.08

                    const nx = -gx
                    const ny = -gy
                    const inv = 1 / Math.sqrt(nx * nx + ny * ny + 1)

                    const ndl = (nx * LIGHT.x + ny * LIGHT.y + LIGHT.z) * inv

                    const diff = 1 + (ndl - LIGHT.z) * SHADE
                    const spec = Math.pow(Math.max(0, ndl), 16) * SPECULAR

                    let outR = data[p] * diff + (WATER.r * spec) / 255
                    let outG = data[p + 1] * diff + (WATER.g * spec) / 255
                    let outB = data[p + 2] * diff + (WATER.b * spec) / 255

                    const activity = Math.min(1, (Math.abs(gx) + Math.abs(gy)) * 3)
                    const tint = WATER_TINT * activity

                    outR = outR + (WATER.r - outR) * tint
                    outG = outG + (WATER.g - outG) * tint
                    outB = outB + (WATER.b - outB) * tint

                    data[p] = softClip(outR)
                    data[p + 1] = softClip(outG)
                    data[p + 2] = softClip(outB)
                }
            }

            bctx.putImageData(image, 0, 0)

            ctx.imageSmoothingEnabled = true
            ctx.imageSmoothingQuality = 'high'
            ctx.drawImage(buffer, 0, 0, width, height)
        }

        const loop = (time: number) => {
            ambientDrop(time)

            if (time - lastTime > 14) {
                simulate()
                lastTime = time
            }

            render()
            animationFrame = requestAnimationFrame(loop)
        }

        resize()

        window.addEventListener('resize', resize)
        window.addEventListener('pointermove', handlePointerMove)
        document.addEventListener('pointerleave', handlePointerLeave)

        animationFrame = requestAnimationFrame(loop)

        return () => {
            cancelled = true
            stirSound.dispose()

            window.removeEventListener('pointerdown', unlock)
            window.removeEventListener('keydown', unlock)
            window.removeEventListener('touchstart', unlock)

            cancelAnimationFrame(animationFrame)

            window.removeEventListener('resize', resize)
            window.removeEventListener('pointermove', handlePointerMove)
            document.removeEventListener('pointerleave', handlePointerLeave)
        }
    }, [form])

    return (
        <div className={styles.frame}>
            <canvas
                ref={canvasRef}
                className={styles.canvas}
                aria-hidden="true"
            />
        </div>
    )
}