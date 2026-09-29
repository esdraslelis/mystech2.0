import '../styles.css'

export const metadata = {
  title: 'Mys Tech — Tecnologia, design e infraestrutura',
  description: 'Sites, sistemas, automações e infraestrutura técnica com design, performance e precisão.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  )
}
