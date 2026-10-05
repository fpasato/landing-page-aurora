import { useCallback, useEffect, useState } from 'react'
import styles from './styles.module.css'

import croissant from '../../../../assets/produtos/croissant.jpg'
import chocolate from '../../../../assets/produtos/chocolate.jpg'
import cappuccino from '../../../../assets/produtos/capuccino.jpg'
import bolo from '../../../../assets/produtos/bolo.jpg'
import boloCenoura from '../../../../assets/produtos/bolocenoura.jpg'

const products = [
    {
        name: 'Chocolate Quente',
        description:
            'Chocolate quente preparado com cacau nobre e leite fresco, proporcionando uma experiência reconfortante e deliciosa.',
        price: '12,90',
        image: chocolate,
    },
    {
        name: 'Cappuccino',
        description:
            'Uma combinação cremosa de espresso, leite vaporizado e uma delicada camada de espuma, finalizada com um toque de canela.',
        price: '14,90',
        image: cappuccino,
    },
    {
        name: 'Bolo Artesanal',
        description:
            'Bolo preparado diariamente com ingredientes selecionados, textura macia e sabor caseiro. Uma opção perfeita para acompanhar seu café.',
        price: '10,90',
        image: bolo,
    },
    {
        name: 'Croissant',
        description:
            'Croissant artesanal, leve e crocante por fora, macio por dentro e preparado para combinar perfeitamente com nossas bebidas.',
        price: '11,90',
        image: croissant,
    },
    {
        name: 'Bolo de Cenoura',
        description:
            'Bolo de cenoura com cobertura de chocolate, perfeito para acompanhar seu café.',
        price: '10,90',
        image: boloCenoura,
    },
]

export function Products() {
    const [active, setActive] = useState(0)
    const total = products.length

    const go = useCallback(
        (index: number) => {
            setActive(((index % total) + total) % total)
        },
        [total]
    )

    const next = useCallback(() => go(active + 1), [active, go])
    const prev = useCallback(() => go(active - 1), [active, go])

    useEffect(() => {
        const onKey = (event: KeyboardEvent) => {
            if (event.key === 'ArrowRight') next()
            if (event.key === 'ArrowLeft') prev()
        }

        window.addEventListener('keydown', onKey)
        return () => window.removeEventListener('keydown', onKey)
    }, [next, prev])

    return (
        <section className={styles.products} id="produtos">
            <header className={styles.heading}>
                <span className={styles.eyebrow}>Nosso menu</span>
                <h2 className={styles.title}>Feito com carinho</h2>
            </header>

            <div className={styles.stage}>
                {products.map((product, index) => (
                    <article
                        key={product.name}
                        className={`${styles.slide} ${
                            index === active ? styles.active : ''
                        }`}
                        aria-hidden={index !== active}
                    >
                        <div className={styles.media}>
                            <img src={product.image} alt={product.name} />
                        </div>

                        <div className={styles.body}>
                            <span className={styles.counter}>
                                {String(index + 1).padStart(2, '0')} /{' '}
                                {String(total).padStart(2, '0')}
                            </span>

                            <h3 className={styles.name}>{product.name}</h3>
                            <p className={styles.description}>
                                {product.description}
                            </p>

                            <div className={styles.priceRow}>
                                <span className={styles.price}>
                                    <span className={styles.currency}>R$</span>
                                    {product.price}
                                </span>
                            </div>
                        </div>
                    </article>
                ))}
            </div>

            <div className={styles.controls}>
                <button
                    type="button"
                    className={styles.arrow}
                    onClick={prev}
                    aria-label="Produto anterior"
                >
                    <svg viewBox="0 0 24 24" width="20" height="20">
                        <path
                            d="M15 5 L8 12 L15 19"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </svg>
                </button>

                <div className={styles.dots}>
                    {products.map((product, index) => (
                        <button
                            key={product.name}
                            type="button"
                            className={`${styles.dot} ${
                                index === active ? styles.dotActive : ''
                            }`}
                            onClick={() => go(index)}
                            aria-label={`Ir para ${product.name}`}
                        />
                    ))}
                </div>

                <button
                    type="button"
                    className={styles.arrow}
                    onClick={next}
                    aria-label="Próximo produto"
                >
                    <svg viewBox="0 0 24 24" width="20" height="20">
                        <path
                            d="M9 5 L16 12 L9 19"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </svg>
                </button>
            </div>
        </section>
    )
}