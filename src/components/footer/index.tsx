import styles from './styles.module.css'

const links = [
    { label: 'Início', href: '#' },
    { label: 'Produtos', href: '#produtos' },
    { label: 'Nossa História', href: '#historia' },
    { label: 'Contato', href: '#contato' },
]

export function Footer() {
    const handleScroll = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
        e.preventDefault()
        if (href === '#') {
            window.scrollTo({ top: 0, behavior: 'smooth' })
            return
        }
        const element = document.querySelector(href)
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' })
        }
    }

    return (
        <footer className={styles.footer}>
            <div className={styles.inner}>
                <div className={styles.brand}>
                    <span className={styles.logo}>Aurora Café</span>
                    <p className={styles.tagline}>
                        Onde o aroma do café se mistura com o calor de um lar.
                    </p>
                </div>

                <nav className={styles.nav} aria-label="Navegação do rodapé">
                    <span className={styles.navTitle}>Navegação</span>
                    <ul className={styles.navList}>
                        {links.map((link) => (
                            <li key={link.href}>
                                <a
                                    href={link.href}
                                    className={styles.navLink}
                                    onClick={(e) => handleScroll(e, link.href)}
                                >
                                    {link.label}
                                </a>
                            </li>
                        ))}
                    </ul>
                </nav>

                <div className={styles.contact}>
                    <span className={styles.navTitle}>Contato</span>
                    <p className={styles.contactLine}>
                        Rua das Flores, 123 — Vila Madalena
                    </p>
                    <p className={styles.contactLine}>
                        (11) 99999-9999
                    </p>
                    <p className={styles.contactLine}>
                        contato@auroracafe.com
                    </p>
                </div>
            </div>

            <div className={styles.bottom}>
                <p className={styles.copy}>
                    © {new Date().getFullYear()} Aurora Café. Todos os
                    direitos reservados.
                </p>
            </div>
        </footer>
    )
}