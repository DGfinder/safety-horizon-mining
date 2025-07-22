import React from 'react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { getBlogPostBySlug } from '@/data/blogPosts';
import type { Metadata } from 'next';

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const post = getBlogPostBySlug(params.slug);
  
  if (!post) {
    return {
      title: 'Blog Post Not Found | Crew Resource Mining',
    };
  }

  // Use SEO metadata if available, otherwise fallback to defaults
  const metaTitle = post.seo?.metaTitle || `${post.title} | Crew Resource Mining`;
  const metaDescription = post.seo?.metaDescription || post.excerpt;
  const keywords = post.seo?.keywords?.join(', ') || `${post.category.toLowerCase()}, mining safety, aviation CRM, crew resource management, ${post.author.toLowerCase().replace(' ', '-')}, human factors training`;
  const canonicalUrl = post.seo?.canonicalUrl || `https://crewresourcemining.com.au/blog/${post.slug}`;

  return {
    title: metaTitle,
    description: metaDescription,
    keywords: keywords,
    authors: [{ name: post.author }],
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: post.seo?.metaTitle || post.title,
      description: metaDescription,
      type: 'article',
      url: canonicalUrl,
      publishedTime: post.date,
      authors: [post.author],
      siteName: 'Crew Resource Mining',
      locale: 'en_AU',
    },
    twitter: {
      card: 'summary_large_image',
      title: post.seo?.metaTitle || post.title,
      description: metaDescription,
      site: '@CrewResourceMining',
      creator: '@CrewResourceMining',
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
}

interface BlogPostPageProps {
  params: {
    slug: string;
  };
}

const BlogPostPage = ({ params }: BlogPostPageProps) => {
  const post = getBlogPostBySlug(params.slug);

  if (!post) {
    return (
      <div className="min-h-screen">
        <Navigation />
        <div className="pt-24 pb-16 text-center">
          <h1 className="text-4xl font-bold text-brand-brown-900 mb-4">Post Not Found</h1>
          <p className="text-brand-brown-600 mb-8">The blog post you're looking for doesn't exist.</p>
          <a 
            href="/blog" 
            className="bg-brand-orange-500 text-brand-white px-6 py-3 rounded-lg font-semibold hover:bg-brand-orange-600 transition-colors"
          >
            Back to Blog
          </a>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Navigation />
      
      {/* Article Header */}
      <article className="pt-24 pb-16">
        <div className="max-w-3xl mx-auto px-4 md:px-8">
          {/* Breadcrumb */}
          <nav className="mb-8">
            <a href="/blog" className="text-brand-orange-500 hover:text-brand-orange-600 font-medium">
              ← Back to Insights
            </a>
          </nav>

          {/* Article Meta */}
          <div className="mb-6">
            <span className="inline-block bg-brand-orange-500 text-brand-white px-3 py-1 rounded-full text-sm font-semibold mb-4">
              {post.category}
            </span>
            <h1 className="text-4xl md:text-5xl font-bold text-brand-brown-900 mb-6 leading-tight">
              {post.title}
            </h1>
            <p className="text-xl text-brand-brown-600 mb-6 leading-relaxed">
              {post.excerpt}
            </p>
            <div className="flex items-center justify-between border-b border-brand-brown-200 pb-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-brand-orange-500 rounded-full flex items-center justify-center">
                  <span className="text-brand-white font-bold text-lg">
                    {post.author.charAt(0)}
                  </span>
                </div>
                <div>
                  <div className="font-semibold text-brand-brown-900">{post.author}</div>
                  <div className="text-sm text-brand-brown-600">{post.authorRole}</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-brand-brown-600 text-sm">
                  {new Date(post.date).toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </div>
                <div className="text-brand-brown-500 text-sm">{post.readTime}</div>
              </div>
            </div>
          </div>

          {/* Article Content */}
          <div 
            className="prose prose-sm md:prose-base lg:prose-lg max-w-none mx-auto"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          {/* Call to Action */}
          <div id="contact-cta" className="mt-12 p-8 bg-brand-yellow-50 rounded-lg">
            <div className="text-center">
              <h3 className="text-2xl font-bold text-brand-brown-900 mb-4">
                Ready to Transform Your Safety Culture?
              </h3>
              <p className="text-brand-brown-600 mb-6">
                Learn how our aviation-proven human factors training can reduce incidents 
                and improve performance at your operation.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a 
                  href="/#contact"
                  className="bg-brand-orange-500 text-brand-white px-8 py-3 rounded-lg font-semibold hover:bg-brand-orange-600 transition-colors hover-lift"
                >
                  Schedule Consultation
                </a>
                <a 
                  href="/blog"
                  className="border-2 border-brand-orange-500 text-brand-orange-500 px-8 py-3 rounded-lg font-semibold hover:bg-brand-orange-500 hover:text-brand-white transition-colors"
                >
                  More Articles
                </a>
              </div>
            </div>
          </div>
        </div>
      </article>

      {/* Newsletter Signup */}
      <section id="newsletter" className="py-16 bg-brand-brown-900">
        <div className="max-w-content mx-auto px-4 md:px-8 text-center">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold text-brand-white mb-4">
              Get More Safety Insights
            </h2>
            <p className="text-brand-white/80 mb-8">
              Weekly insights from aviation safety experts delivered to your inbox. 
              No spam, just valuable content for mining professionals.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <input
                type="email"
                placeholder="your.email@miningcompany.com"
                className="px-6 py-3 rounded-lg border-0 text-brand-brown-900 placeholder-brand-brown-500 flex-1 max-w-md"
              />
              <button 
                className="bg-brand-orange-500 text-brand-white px-8 py-3 rounded-lg font-semibold hover:bg-brand-orange-600 transition-colors whitespace-nowrap hover-lift"
              >
                Subscribe
              </button>
            </div>
            <p className="text-brand-white/60 text-sm mt-4">
              Join 500+ mining professionals • Unsubscribe anytime
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default BlogPostPage;