import articlesData from '../data/articles.json';

export interface BlogPost {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  author: string;
  published_at: string;
  created_at: string;
  updated_at: string;
  image_url?: string;
  likes_count: number;
}

// Simulate database operations with local JSON data
export class BoltDatabase {
  private static articles: BlogPost[] = articlesData;
  private static likedPosts: string[] = JSON.parse(localStorage.getItem('liked_posts') || '[]');

  // Get all blog posts, sorted by publication date (newest first)
  static async getBlogPosts(): Promise<BlogPost[]> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 100));
    
    return [...this.articles].sort((a, b) => 
      new Date(b.published_at).getTime() - new Date(a.published_at).getTime()
    );
  }

  // Get a single blog post by ID
  static async getBlogPost(id: string): Promise<BlogPost | null> {
    await new Promise(resolve => setTimeout(resolve, 50));
    
    return this.articles.find(post => post.id === id) || null;
  }

  // Create a new blog post
  static async createBlogPost(postData: Omit<BlogPost, 'id' | 'created_at' | 'updated_at' | 'likes_count'>): Promise<BlogPost> {
    await new Promise(resolve => setTimeout(resolve, 200));
    
    const newPost: BlogPost = {
      ...postData,
      id: Date.now().toString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      likes_count: 0
    };
    
    this.articles.unshift(newPost);
    return newPost;
  }

  // Update an existing blog post
  static async updateBlogPost(id: string, postData: Partial<BlogPost>): Promise<BlogPost | null> {
    await new Promise(resolve => setTimeout(resolve, 200));
    
    const index = this.articles.findIndex(post => post.id === id);
    if (index === -1) return null;
    
    this.articles[index] = {
      ...this.articles[index],
      ...postData,
      updated_at: new Date().toISOString()
    };
    
    return this.articles[index];
  }

  // Delete a blog post
  static async deleteBlogPost(id: string): Promise<boolean> {
    await new Promise(resolve => setTimeout(resolve, 150));
    
    const index = this.articles.findIndex(post => post.id === id);
    if (index === -1) return false;
    
    this.articles.splice(index, 1);
    return true;
  }

  // Like a blog post
  static async likeBlogPost(postId: string): Promise<{ success: boolean; error?: string }> {
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // Check if already liked
    if (this.likedPosts.includes(postId)) {
      return { success: false, error: 'You have already liked this post' };
    }
    
    // Find and update the post
    const post = this.articles.find(p => p.id === postId);
    if (!post) {
      return { success: false, error: 'Post not found' };
    }
    
    post.likes_count += 1;
    this.likedPosts.push(postId);
    
    // Save to localStorage
    localStorage.setItem('liked_posts', JSON.stringify(this.likedPosts));
    
    return { success: true };
  }

  // Check if user has liked a post
  static hasLikedPost(postId: string): boolean {
    return this.likedPosts.includes(postId);
  }

  // Get statistics
  static async getStats() {
    await new Promise(resolve => setTimeout(resolve, 50));
    
    const now = new Date();
    const thisMonth = this.articles.filter(post => {
      const postDate = new Date(post.published_at);
      return postDate.getMonth() === now.getMonth() && 
             postDate.getFullYear() === now.getFullYear();
    });
    
    return {
      totalPosts: this.articles.length,
      thisMonthPosts: thisMonth.length,
      totalLikes: this.articles.reduce((sum, post) => sum + post.likes_count, 0)
    };
  }
}