export class StirSound {
    private ctx: AudioContext | null = null
    private buffer: AudioBuffer | null = null
    private source: AudioBufferSourceNode | null = null
    private gain: GainNode | null = null
    private loaded = false

    volume = 0.35
    idleMs = 220

    private idleTimer: number | undefined

    async load(url: string): Promise<void> {
        if (this.loaded) return

        const res = await fetch(url)
        const arr = await res.arrayBuffer()

        const ctx = this.ensureCtx()
        this.buffer = await ctx.decodeAudioData(arr)
        this.loaded = true
    }

    async unlock(): Promise<void> {
        const ctx = this.ensureCtx()

        if (ctx.state === 'suspended') {
            try {
                await ctx.resume()
            } catch {
                /* o navegador recusou; o próximo gesto tenta de novo */
            }
        }
    }

    private ensureCtx(): AudioContext {
        if (!this.ctx) {
            const Ctor =
                window.AudioContext ||
                (window as unknown as { webkitAudioContext: typeof AudioContext })
                    .webkitAudioContext

            this.ctx = new Ctor()
        }
        return this.ctx
    }

    play(intensity: number) {
        if (!this.buffer) return

        const ctx = this.ensureCtx()

        if (ctx.state === 'suspended') {
            void ctx.resume()
        }

        if (!this.source) {
            const src = ctx.createBufferSource()
            src.buffer = this.buffer
            src.loop = true

            const gain = ctx.createGain()
            gain.gain.value = 0

            src.connect(gain).connect(ctx.destination)
            src.start()

            this.source = src
            this.gain = gain
        }

        this.setIntensity(intensity)

        if (this.idleTimer !== undefined) {
            window.clearTimeout(this.idleTimer)
        }

        this.idleTimer = window.setTimeout(() => this.stop(), this.idleMs)
    }

    stop() {
        this.setIntensity(0)
    }

    private setIntensity(intensity: number) {
        if (!this.gain || !this.ctx) return

        const target = Math.max(0, Math.min(1, intensity)) * this.volume
        const now = this.ctx.currentTime

        this.gain.gain.cancelScheduledValues(now)
        this.gain.gain.linearRampToValueAtTime(target, now + 0.08)
    }

    dispose() {
        if (this.idleTimer !== undefined) {
            window.clearTimeout(this.idleTimer)
        }

        try {
            this.source?.stop()
        } catch {
            /* já parado */
        }

        this.source = null
        this.gain = null
        this.buffer = null
        this.loaded = false

        void this.ctx?.close()
        this.ctx = null
    }
}