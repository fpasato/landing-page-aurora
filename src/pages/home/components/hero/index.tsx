import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { LiquidBackground } from '../LiquidBackground'
import styles from './styles.module.css'

const content = {
  eyebrow: 'Aurora Café',
  title: 'Um café para chamar de seu',
  description:
    'Cuidado, carinho e atenção em cada detalhe\npara deixar seu melhor amigo ainda mais feliz.',
  button: 'Como chegar',
  welcomeDescription:
    'Onde o aroma do café se mistura com o calor de um lar.',
  welcomeHint: 'Clique fora do cartão para começar',
}

export function Hero() {
  const [welcomeOpen, setWelcomeOpen] = useState(true)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!welcomeOpen) return

    const scrollY = window.scrollY
    const { overflow, position, top, width } = document.body.style

    document.body.style.overflow = 'hidden'
    document.body.style.position = 'fixed'
    document.body.style.top = `-${scrollY}px`
    document.body.style.width = '100%'

    return () => {
      document.body.style.overflow = overflow
      document.body.style.position = position
      document.body.style.top = top
      document.body.style.width = width
      window.scrollTo(0, scrollY)
    }
  }, [welcomeOpen])

  const welcome = welcomeOpen ? (
    <div
      className={styles.welcomeBackdrop}
      onClick={(event) => {
        if (event.target === event.currentTarget) {
          setWelcomeOpen(false)
        }
      }}
    >
      <div className={styles.welcomeCard}>
        <span className={styles.welcomeEyebrow}>Bem-vindo</span>
        <h2 className={styles.welcomeTitle}>{content.eyebrow}</h2>
        <p className={styles.welcomeText}>{content.welcomeDescription}</p>
        <span className={styles.welcomeHint}>{content.welcomeHint}</span>
      </div>
    </div>
  ) : null

  return (
    <section className={styles.hero}>
      <LiquidBackground />

      <div className={styles.content}>
        <span className={styles.eyebrow}>{content.eyebrow}</span>
        <h1>{content.title}</h1>
        <p>{content.description}</p>
        <button>{content.button}</button>
      </div>

      {mounted && welcome && createPortal(welcome, document.body)}
    </section>
  )
}