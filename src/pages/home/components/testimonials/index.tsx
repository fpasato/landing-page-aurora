import styles from './styles.module.css'

import testimonial1 from '../../../../assets/testimonials/1.jpg'
import testimonial2 from '../../../../assets/testimonials/2.jpg'
import testimonial3 from '../../../../assets/testimonials/3.jpg'
import testimonial4 from '../../../../assets/testimonials/4.jpg'

interface Testimonial {
    name: string
    handle: string
    text: string
    image: string
}

const testimonials: Testimonial[] = [
    {
        name: 'Ana Paula',
        handle: '@anapaula',
        text: 'Um lugar aconchegante, com café delicioso e um ambiente perfeito para começar o dia com calma.',
        image: testimonial1,
    },
    {
        name: 'Carlos Mendes',
        handle: '@carlosmendes',
        text: 'O atendimento é excelente e tudo é preparado com muito cuidado. O cappuccino e o croissant são incríveis!',
        image: testimonial2,
    },
    {
        name: 'Maria Souza',
        handle: '@mariasouza',
        text: 'Adorei conhecer a Aurora. O espaço é lindo, tranquilo e os doces são simplesmente maravilhosos.',
        image: testimonial3,
    },
    {
        name: 'Pedro Costa',
        handle: '@pedrocosta',
        text: 'Sem dúvida, um dos melhores cafés da cidade. Ótimo atendimento, produtos de qualidade e um ambiente muito agradável.',
        image: testimonial4,
    },
]

function XIcon() {
    return (
        <svg
            viewBox="0 0 24 24"
            width="14"
            height="14"
            aria-hidden="true"
            fill="currentColor"
        >
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817-5.96 6.817H1.686l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
    )
}

export function Testimonials() {
    return (
        <section className={styles.testimonials}>
            <header className={styles.heading}>
                <span className={styles.eyebrow}>Depoimentos</span>
                <h2>O que nossos clientes dizem</h2>
            </header>

            <div className={styles.grid}>
                {testimonials.map((testimonial) => (
                    <article
                        key={testimonial.name}
                        className={styles.card}
                    >
                        <span className={styles.mark} aria-hidden="true">
                            “
                        </span>

                        <p className={styles.text}>{testimonial.text}</p>

                        <footer className={styles.footer}>
                            <img
                                src={testimonial.image}
                                alt={testimonial.name}
                                className={styles.avatar}
                            />

                            <div className={styles.author}>
                                <span className={styles.name}>
                                    {testimonial.name}
                                </span>
                                <a className={styles.handle}>
                                    <XIcon />
                                    {testimonial.handle}
                                </a>
                            </div>
                        </footer>
                    </article>
                ))}
            </div>
        </section>
    )
}