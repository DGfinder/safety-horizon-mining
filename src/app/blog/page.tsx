'use client';

import React from 'react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { getFeaturedBlogPost, getRegularBlogPosts } from '@/data/blogPosts';

const Blog = () => {
  const featuredPost = getFeaturedBlogPost();
  const regularPosts = getRegularBlogPosts();

  const scrollToNewsletter = () => {
    const element = document.getElementById('newsletter');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen">
      <Navigation />
      
      {/* Hero Section */}
      <section className="pt-24 pb-16 bg-brand-yellow-50">
        <div className="max-w-content mx-auto px-8">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold text-brand-brown-900 mb-6">
              Safety Insights
            </h1>
            <p className="text-xl text-brand-brown-600 max-w-3xl mx-auto">
              Aviation-proven safety expertise and insights for mining operations. 
              Learn from airline captains with decades of experience transforming safety cultures.
            </p>
          </div>
        </div>
      </section>

      {/* Featured Post */}
      {featuredPost && (
        <section className="py-16 bg-brand-white">
          <div className="max-w-content mx-auto px-8">
            <div className="mb-8">
              <span className="inline-block bg-brand-orange-500 text-brand-white px-3 py-1 rounded-full text-sm font-semibold">
                Featured Article
              </span>
            </div>
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <div>
                  <span className="text-brand-orange-500 font-semibold text-sm">
                    {featuredPost.category} • {featuredPost.readTime}
                  </span>
                  <h2 className="text-3xl md:text-4xl font-bold text-brand-brown-900 mt-2 mb-4">
                    {featuredPost.title}
                  </h2>
                  <p className="text-brand-brown-600 text-lg leading-relaxed">
                    {featuredPost.excerpt}
                  </p>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-brand-brown-500 text-sm">
                    {new Date(featuredPost.date).toLocaleDateString('en-US', { 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </span>
                  <a 
                    href={`/blog/${featuredPost.slug}`}
                    className="bg-brand-orange-500 text-brand-white px-6 py-3 rounded-lg font-semibold hover:bg-brand-orange-600 transition-colors hover-lift"
                  >
                    Read Article →
                  </a>
                </div>
              </div>
              <div className="aspect-w-16 aspect-h-9 bg-brand-yellow-100 rounded-lg overflow-hidden">
                <div className="w-full h-full bg-gradient-to-br from-brand-orange-500 to-brand-brown-900 flex items-center justify-center">
                  <div className="text-brand-white text-center p-8">
                    <div className="text-6xl mb-4">✈️</div>
                    <p className="font-semibold">Aviation Safety Expertise</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Blog Posts Grid */}
      <section className="py-16 bg-brand-yellow-50">
        <div className="max-w-content mx-auto px-8">
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-brand-brown-900 mb-4">Latest Articles</h2>
            <p className="text-brand-brown-600">
              Expert insights on mining safety, human factors training, and industry best practices.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {regularPosts.map((post) => (
              <article key={post.slug} className="bg-brand-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow hover-lift">
                <div className="aspect-w-16 aspect-h-9 bg-brand-yellow-100">
                  <div className="w-full h-48 bg-gradient-to-br from-brand-orange-400 to-brand-brown-800 flex items-center justify-center">
                    <div className="text-brand-white text-center">
                      <div className="text-3xl mb-2">⚡</div>
                      <p className="text-sm font-medium px-4">{post.category}</p>
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  <div className="mb-3">
                    <span className="text-brand-orange-500 font-semibold text-sm">
                      {post.category} • {post.readTime}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-brand-brown-900 mb-3 line-clamp-2">
                    {post.title}
                  </h3>
                  <p className="text-brand-brown-600 text-sm leading-relaxed mb-4 line-clamp-3">
                    {post.excerpt}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-brand-brown-500 text-xs">
                      {new Date(post.date).toLocaleDateString('en-US', { 
                        year: 'numeric', 
                        month: 'short', 
                        day: 'numeric' 
                      })}
                    </span>
                    <a 
                      href={`/blog/${post.slug}`}
                      className="text-brand-orange-500 font-semibold text-sm hover:text-brand-orange-600 transition-colors"
                    >
                      Read More →
                    </a>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Signup */}
      <section id="newsletter" className="py-16 bg-brand-brown-900">
        <div className="max-w-content mx-auto px-8 text-center">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold text-brand-white mb-4">
              Stay Updated on Mining Safety
            </h2>
            <p className="text-brand-white/80 mb-8">
              Get weekly insights from aviation safety experts on transforming mining operations. 
              No spam, just valuable safety content.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <input
                type="email"
                placeholder="your.email@miningcompany.com"
                className="px-6 py-3 rounded-lg border-0 text-brand-brown-900 placeholder-brand-brown-500 flex-1 max-w-md"
              />
              <button 
                onClick={scrollToNewsletter}
                className="bg-brand-orange-500 text-brand-white px-8 py-3 rounded-lg font-semibold hover:bg-brand-orange-600 transition-colors whitespace-nowrap hover-lift"
              >
                Subscribe
              </button>
            </div>
            <p className="text-brand-white/60 text-sm mt-4">
              Join 500+ mining professionals receiving our safety insights
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Blog;