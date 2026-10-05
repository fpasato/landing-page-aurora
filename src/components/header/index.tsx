
import styles from './styles.module.css'
import logo from '../../assets/logo.png'


const navbarLinks = [
    {
        name: 'Início',
        icon: 'menu',
        href: '#',
    },
    {
        name: 'Produtos',
        icon: 'about',
        href: '#produtos',
    },
    {
        name: 'Nossa História',
        icon: 'about',
        href: '#historia',
    },
    {
        name: 'Contato',
        icon: 'contact',
        href: '#contato',
    }
]

const socialLinks = [
    {
        name: 'instagram',
        icon: 'instagram',
        href: '/',
    },
    {
        name: 'facebook',
        icon: 'facebook',
        href: '/',
    }
]

export function Header() {
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
        <header className={styles.header}>
            <img src={logo} alt="Logo" />
            <div className={styles.navbar}>
                {navbarLinks.map((link) => (
                    <a
                        key={link.name}
                        href={link.href}
                        className={styles.navbarLink}
                        onClick={(e) => handleScroll(e, link.href)}
                    >
                        {link.name}
                    </a>
                ))}
            </div>
            <div className={styles.social}>
                {socialLinks.map((link) => (
                    <a key={link.name} href={link.href} className={styles.socialLink}>
                        <span>{link.name}</span>
                    </a>
                ))}
            </div>
        </header>
    )
}