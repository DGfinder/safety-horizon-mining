import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { marked } from 'marked';

const blogDirectory = path.join(process.cwd(), 'content/blog');

export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  author: string;
  authorRole: string;
  date: string;
  readTime: string;
  category: string;
  featured: boolean;
  content: string;
}

export function getAllBlogPosts(): BlogPost[] {
  try {
    const fileNames = fs.readdirSync(blogDirectory);
    const allPostsData = fileNames
      .filter(fileName => fileName.endsWith('.md'))
      .map((fileName) => {
        const slug = fileName.replace(/\.md$/, '');
        const fullPath = path.join(blogDirectory, fileName);
        const fileContents = fs.readFileSync(fullPath, 'utf8');
        const { data, content } = matter(fileContents);

        return {
          slug,
          title: data.title,
          excerpt: data.excerpt,
          author: data.author,
          authorRole: data.authorRole,
          date: data.date,
          readTime: data.readTime,
          category: data.category,
          featured: data.featured || false,
          content,
        } as BlogPost;
      });

    // Sort posts by date (newest first)
    return allPostsData.sort((a, b) => {
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });
  } catch (error) {
    console.error('Error reading blog posts:', error);
    return [];
  }
}

export function getBlogPostBySlug(slug: string): BlogPost | null {
  try {
    const fullPath = path.join(blogDirectory, `${slug}.md`);
    
    if (!fs.existsSync(fullPath)) {
      return null;
    }

    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const { data, content } = matter(fileContents);

    return {
      slug,
      title: data.title,
      excerpt: data.excerpt,
      author: data.author,
      authorRole: data.authorRole,
      date: data.date,
      readTime: data.readTime,
      category: data.category,
      featured: data.featured || false,
      content,
    } as BlogPost;
  } catch (error) {
    console.error(`Error reading blog post ${slug}:`, error);
    return null;
  }
}

export function getFeaturedBlogPost(): BlogPost | null {
  const allPosts = getAllBlogPosts();
  return allPosts.find(post => post.featured) || null;
}

export function getRegularBlogPosts(): BlogPost[] {
  const allPosts = getAllBlogPosts();
  return allPosts.filter(post => !post.featured);
}

// Helper function to format markdown content to HTML
export async function markdownToHtml(markdown: string): Promise<string> {
  // Configure marked for safe HTML generation
  marked.setOptions({
    breaks: true,
    gfm: true,
  });
  
  return await marked(markdown);
}