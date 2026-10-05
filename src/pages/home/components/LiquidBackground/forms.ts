import birdLoveHeart from '../../../../assets/svg/bird-love-heart-svgrepo-com.svg'
import butterfly from '../../../../assets/svg/butterfly-4-svgrepo-com.svg'
import cat from '../../../../assets/svg/cat-1-svgrepo-com.svg'
import flower from '../../../../assets/svg/flower-svgrepo-com.svg'
import heartShine from '../../../../assets/svg/heart-shine-svgrepo-com.svg'
import drinkCoffee from '../../../../assets/svg/drink-coffee-s-svgrepo-com.svg'
import sparrowBird from '../../../../assets/svg/sparrow-bird-icon.svg'
import heartArrow from '../../../../assets/svg/heart-arrow-icon.svg'

export type FormName =
    | 'bird-love-heart'
    | 'butterfly'
    | 'cat'
    | 'flower'
    | 'heart-shine'
    | 'drink-coffee'
    | 'sparrow-bird'
    | 'heart-arrow'

type RGB = {
    r: number
    g: number
    b: number
}

const FORMS: Record<FormName, string> = {
    'bird-love-heart': birdLoveHeart,
    butterfly,
    cat,
    flower,
    'heart-shine': heartShine,
    'drink-coffee': drinkCoffee,
    'sparrow-bird': sparrowBird,
    'heart-arrow': heartArrow,
}

const NAMES = Object.keys(FORMS) as FormName[]
const DRAW_SCALE = 1.4

const rgba = (c: RGB, a: number) =>
    `rgba(${c.r}, ${c.g}, ${c.b}, ${a})`

const HI = 512

const imageCache = new Map<FormName, HTMLImageElement>()
const tintCache = new Map<string, HTMLCanvasElement>()

async function loadForm(name: FormName): Promise<HTMLImageElement> {
    const cached = imageCache.get(name)

    if (cached) return cached

    const image = new Image()
    image.src = FORMS[name]

    await image.decode()

    imageCache.set(name, image)

    return image
}

async function getTinted(name: FormName, color: RGB): Promise<HTMLCanvasElement> {
    const key = `${name}:${color.r},${color.g},${color.b}`
    const cached = tintCache.get(key)

    if (cached) return cached

    const image = await loadForm(name)

    const c = document.createElement('canvas')
    c.width = HI
    c.height = HI

    const cctx = c.getContext('2d')
    if (!cctx) return c

    const nw = image.naturalWidth || 1
    const nh = image.naturalHeight || 1
    const ratio = nw / nh

    const w = ratio >= 1 ? HI : HI * ratio
    const h = ratio >= 1 ? HI / ratio : HI

    cctx.drawImage(image, (HI - w) / 2, (HI - h) / 2, w, h)

    /* Mantém só o alfa da silhueta e repinta com a cor do leite */
    cctx.globalCompositeOperation = 'source-in'
    cctx.fillStyle = rgba(color, 1)
    cctx.fillRect(0, 0, HI, HI)

    tintCache.set(key, c)

    return c
}

export async function drawForm(
    ctx: CanvasRenderingContext2D,
    form: FormName | 'random',
    cx: number,
    cy: number,
    size: number,
    milk: RGB
): Promise<void> {
    const chosen =
        form === 'random'
            ? NAMES[Math.floor(Math.random() * NAMES.length)]
            : form

    const tinted = await getTinted(chosen, milk)

    ctx.save()

    ctx.imageSmoothingEnabled = true
    ctx.imageSmoothingQuality = 'high'

    ctx.shadowColor = rgba(milk, 0.45)
    ctx.shadowBlur = size * 0.12

    ctx.drawImage(
        tinted,
        cx - size * (DRAW_SCALE / 2),
        cy - size * (DRAW_SCALE / 2),
        size * DRAW_SCALE,
        size * DRAW_SCALE
    )

    ctx.restore()
}