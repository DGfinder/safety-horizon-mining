import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Mining Safety Insights | Aviation-Proven Safety Training | Crew Resource Mining',
  description: 'Expert insights on mining safety, human factors training, and industry best practices from airline captains with decades of experience transforming safety cultures.',
  keywords: 'mining safety insights, aviation CRM blog, crew resource management mining, human factors training, mining safety articles, airline captain safety expertise',
  openGraph: {
    title: 'Mining Safety Insights from Aviation Experts',
    description: 'Expert insights on mining safety, human factors training, and industry best practices from airline captains with decades of experience.',
    type: 'website',
    url: 'https://crewresourcemining.com.au/blog',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Mining Safety Insights from Aviation Experts',
    description: 'Expert insights on mining safety, human factors training, and industry best practices from airline captains.',
  },
};

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}