import { useEffect, useState } from 'react'
import styles from './styles.module.css'

import fotoAntiga from '../../../../assets/foto-antiga.png'
import fotoNova from '../../../../assets/foto-nova.png'
import fachada from '../../../../assets/fachada.png'
import fachadaAntiga from '../../../../assets/fachada-antiga.png'

const content = [
    {
        title: 'Onde tudo começou',
        description:
            'Tudo começou com um sonho e uma paixão por café. A Aurora nasceu com a vontade de criar um lugar simples e acolhedor, onde uma boa xícara pudesse reunir pessoas, conversas e momentos que valessem a pena guardar.',
        image: fachadaAntiga,
    },

    {
        title: 'Os primeiros anos',
        description:
            'Nos primeiros anos, cada cliente que cruzava nossas portas ajudava a construir a história da Aurora. Entre cafés preparados com cuidado, receitas artesanais e muitas conversas, o pequeno espaço foi ganhando personalidade e conquistando seu lugar na comunidade.',
        image: fotoAntiga,
    },

    {
        title: 'A Aurora de hoje',
        description:
            'Hoje, a Aurora Café mantém o mesmo cuidado que marcou seu começo, mas ganhou um novo espaço para receber ainda mais histórias. Um ambiente pensado para quem quer tomar um bom café, encontrar alguém especial ou simplesmente aproveitar alguns minutos do dia.',
        image: fachada,
    },

    {
        title: 'Um espaço para ficar',
        description:
            'A nova Aurora foi pensada em cada detalhe para tornar a experiência ainda mais especial. Mais conforto, mais espaço e a mesma essência de sempre: café de qualidade, sabores artesanais e um ambiente onde você pode chegar sem pressa e se sentir à vontade.',
        image: fotoNova,
    },
]

export function About() {
    const [active, setActive] = useState(0)
    const total = content.length

    const go = (index: number) => {
        setActive(((index % total) + total) % total)
    }

    const next = () => go(active + 1)
    const prev = () => go(active - 1)

    useEffect(() => {
        const onKey = (event: KeyboardEvent) => {
            if (event.key === 'ArrowRight') next()
            if (event.key === 'ArrowLeft') prev()
        }

        window.addEventListener('keydown', onKey)
        return () => window.removeEventListener('keydown', onKey)
    })

    return (
        <section className={styles.about} id="historia">
            <div className={styles.content}>
                <div className={styles.stage}>
                    {content.map((item, index) => (
                        <article
                            key={item.title}
                            className={`${styles.slide} ${index === active ? styles.active : ''
                                }`}
                            aria-hidden={index !== active}
                        >
                            <span className={styles.eyebrow}>
                                {String(index + 1).padStart(2, '0')} /{' '}
                                {String(total).padStart(2, '0')}
                            </span>
                            <h2 className={styles.title}>{item.title}</h2>
                            <p className={styles.description}>
                                {item.description}
                            </p>
                        </article>
                    ))}
                </div>

                <div className={styles.controls}>
                    <button
                        type="button"
                        className={styles.arrow}
                        onClick={prev}
                        aria-label="Anterior"
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
                        {content.map((_, index) => (
                            <button
                                key={index}
                                type="button"
                                className={`${styles.dot} ${index === active ? styles.dotActive : ''
                                    }`}
                                onClick={() => go(index)}
                                aria-label={`Ir para o slide ${index + 1}`}
                            />
                        ))}
                    </div>

                    <button
                        type="button"
                        className={styles.arrow}
                        onClick={next}
                        aria-label="Próximo"
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
            </div>

            <div className={styles.carousel}>
                {content.map((item, index) => (
                    <img
                        key={item.title}
                        src={item.image}
                        alt={item.title}
                        className={`${styles.image} ${index === active ? styles.imageActive : ''
                            }`}
                        aria-hidden={index !== active}
                    />
                ))}
            </div>
        </section>
    )
}