import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Mining Safety Insights | Aviation-Proven Human Factors Training | Crew Resource Mining",
  description: "Expert insights on mining safety, human factors training, and aviation-proven strategies for Australian mining operations. Learn from airline captains to improve your safety culture.",
  keywords: "mining safety insights, human factors mining, aviation safety mining, crew resource management, mining safety culture, FIFO safety training, Australian mining safety",
  openGraph: {
    title: "Mining Safety Insights | Crew Resource Mining",
    description: "Expert insights on mining safety, human factors training, and aviation-proven strategies for Australian mining operations.",
    type: "website",
    url: "https://crewresourcemining.com.au/blog",
    siteName: "Crew Resource Mining",
    locale: "en_AU",
  },
  twitter: {
    card: "summary_large_image",
    title: "Mining Safety Insights | Crew Resource Mining",
    description: "Expert insights on mining safety, human factors training, and aviation-proven strategies for Australian mining operations.",
    site: "@CrewResourceMining",
    creator: "@CrewResourceMining",
  },
  alternates: {
    canonical: "https://crewresourcemining.com.au/blog",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}