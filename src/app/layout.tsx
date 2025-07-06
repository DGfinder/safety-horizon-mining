import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Aviation Captains Bringing Flight Deck Safety to Mining | Crew Resource Mining',
  description: 'Led by former airline captains with decades of experience. Transform your mining safety culture with aviation-proven Crew Resource Management principles. Book your LMS demo today.',
  keywords: 'mining safety training, aviation CRM, crew resource management, airline captains, mining human factors, safety culture, Perth mining safety, Australian mining training',
  authors: [{ name: 'Team Safety Awareness' }],
  openGraph: {
    type: 'website',
    url: 'https://crewresourcemining.com.au/',
    title: 'Aviation Captains Bringing Flight Deck Safety to Mining',
    description: 'Led by former airline captains with decades of experience. Transform your mining safety culture with aviation-proven Crew Resource Management principles.',
    images: [
      {
        url: 'https://crewresourcemining.com.au/img/hero-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Crew Resource Mining - Aviation Safety for Mining',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Aviation Captains Bringing Flight Deck Safety to Mining',
    description: 'Led by former airline captains with decades of experience. Transform your mining safety culture with aviation-proven Crew Resource Management principles.',
    images: ['https://crewresourcemining.com.au/img/hero-image.jpg'],
  },
  other: {
    'contact-phone': '+61-8-9450-7469',
    'contact-email': 'info@crewresourcemining.com.au',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" type="image/png" href="/favicon.png" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "Crew Resource Mining by TSA",
              "description": "Aviation-grade Human Factors & Crew Resource Management training for mining operations",
              "url": "https://crewresourcemining.com.au",
              "logo": "https://crewresourcemining.com.au/logo.png",
              "contactPoint": {
                "@type": "ContactPoint",
                "telephone": "+61-8-9450-7469",
                "contactType": "customer service",
                "email": "info@crewresourcemining.com.au"
              }
            })
          }}
        />
      </head>
      <body className="antialiased"  style={{fontFamily: 'Inter, system-ui, sans-serif'}}>
        {children}
      </body>
    </html>
  )
}