import styles from './styles.module.css'

import {
  FaMapMarkerAlt,
  FaPhone,
  FaInstagram,
  FaFacebookSquare,
  FaRegClock,
  FaArrowRight,
} from 'react-icons/fa'

import { IoMailOutline } from 'react-icons/io5'


const contact = [
  {
    icon: <FaMapMarkerAlt />,
    label: 'Endereço',
    lines: ['Rua das Flores, 123', 'Vila Madalena — São Paulo, SP'],
  },
  {
    icon: <FaPhone />,
    label: 'Telefone',
    lines: ['(11) 99999-9999'],
  },
  {
    icon: <IoMailOutline />,
    label: 'E-mail',
    lines: ['contato@auroracafe.com'],
  },
]

const hours = [
  { days: 'Segunda a sexta', time: '8h — 22h' },
  { days: 'Sábado', time: '8h — 13h' },
]

const socials = [
  {
    icon: <FaInstagram />,
    handle: '@auroracafe',
  },
  {
    icon: <FaFacebookSquare />,
    handle: '@auroracafe',
  },
]

export function Cta() {
  return (
    <section className={styles.cta} id="contato">
      <header className={styles.heading}>
        <span className={styles.eyebrow}>Visite-nos</span>
        <h2>Como encontrar a Aurora Café</h2>
        <p className={styles.lead}>
          Estamos localizados no coração de São Paulo, próximo ao metrô Vila Madalena.
        </p>
      </header>

      <div className={styles.layout}>
        <div className={styles.info}>
          <ul className={styles.contactList}>
            {contact.map((item) => (
              <li
                key={item.label}
                className={styles.contactItem}
              >
                <span className={styles.contactIcon}>
                  {item.icon}
                </span>

                <div className={styles.contactBody}>
                  <span className={styles.contactLabel}>
                    {item.label}
                  </span>

                  <div className={styles.contactValue}>
                    {item.lines.map((line) => (
                      <span key={line}>{line}</span>
                    ))}
                  </div>
                </div>
              </li>
            ))}
          </ul>

          <div className={styles.block}>
            <div className={styles.blockHeader}>
              <span className={styles.blockIcon}>
                <FaRegClock />
              </span>
              <span className={styles.blockTitle}>
                Horário de funcionamento
              </span>
            </div>

            <ul className={styles.hoursList}>
              {hours.map((slot) => (
                <li key={slot.days} className={styles.hoursRow}>
                  <span>{slot.days}</span>
                  <span className={styles.hoursDots} />
                  <span className={styles.hoursTime}>
                    {slot.time}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div className={styles.block}>
            <div className={styles.blockHeader}>
              <span className={styles.blockTitle}>
                Redes sociais
              </span>
            </div>

            <div className={styles.socials}>
              {socials.map((social) => (
                <span
                  key={social.handle + social.icon.type}
                  className={styles.socialLink}
                >
                  {social.icon}
                  {social.handle}
                </span>
              ))}
            </div>
          </div>

          <button
            type="button"
            className={styles.directions}
          >
            Como chegar
            <FaArrowRight />
          </button>
        </div>

        <div className={styles.mapWrap}>
          <iframe
            className={styles.map}
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3657.0964444444445!2d-46.633300000000004!3d-23.550520000000003!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94ce59c8c1c1c1c1%3A0x94ce59c8c1c1c1c1!2sAurora%20Caf%C3%A9!5e0!3m2!1spt-BR!2sbr!4v1620000000000!5m2!1spt-BR!2sbr"
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Localização da Aurora Café no mapa"
          />
        </div>
      </div>
    </section>
  )
}