// Local storage utilities for blog posts and form submissions
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

export interface MarketingSubmission {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  company_name: string;
  how_did_you_find_us: string;
  monthly_spend: string;
  website: string;
  created_at: string;
}

export interface NewsletterSignup {
  id: string;
  email: string;
  created_at: string;
}

// Generate unique IDs
const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

// Blog Posts
export const getBlogPosts = (): BlogPost[] => {
  const posts = localStorage.getItem('blog_posts');
  return posts ? JSON.parse(posts) : [];
};

export const saveBlogPosts = (posts: BlogPost[]) => {
  localStorage.setItem('blog_posts', JSON.stringify(posts));
};

export const createBlogPost = (postData: Omit<BlogPost, 'id' | 'created_at' | 'updated_at' | 'likes_count'>): BlogPost => {
  const posts = getBlogPosts();
  const newPost: BlogPost = {
    ...postData,
    id: generateId(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    likes_count: 0,
  };
  posts.unshift(newPost);
  saveBlogPosts(posts);
  return newPost;
};

export const updateBlogPost = (id: string, postData: Partial<BlogPost>): BlogPost | null => {
  const posts = getBlogPosts();
  const index = posts.findIndex(post => post.id === id);
  if (index === -1) return null;
  
  posts[index] = {
    ...posts[index],
    ...postData,
    updated_at: new Date().toISOString(),
  };
  saveBlogPosts(posts);
  return posts[index];
};

export const deleteBlogPost = (id: string): boolean => {
  const posts = getBlogPosts();
  const filteredPosts = posts.filter(post => post.id !== id);
  if (filteredPosts.length === posts.length) return false;
  
  saveBlogPosts(filteredPosts);
  return true;
};

export const likeBlogPost = (postId: string): { success: boolean; error?: string } => {
  const likedPosts = getLikedPosts();
  if (likedPosts.includes(postId)) {
    return { success: false, error: 'You have already liked this post' };
  }
  
  const posts = getBlogPosts();
  const post = posts.find(p => p.id === postId);
  if (!post) return { success: false, error: 'Post not found' };
  
  post.likes_count += 1;
  saveBlogPosts(posts);
  
  likedPosts.push(postId);
  localStorage.setItem('liked_posts', JSON.stringify(likedPosts));
  
  return { success: true };
};

export const getLikedPosts = (): string[] => {
  const liked = localStorage.getItem('liked_posts');
  return liked ? JSON.parse(liked) : [];
};

// Marketing Analysis Submissions
export const getMarketingSubmissions = (): MarketingSubmission[] => {
  const submissions = localStorage.getItem('marketing_submissions');
  return submissions ? JSON.parse(submissions) : [];
};

export const saveMarketingSubmission = (submissionData: Omit<MarketingSubmission, 'id' | 'created_at'>): MarketingSubmission => {
  const submissions = getMarketingSubmissions();
  const newSubmission: MarketingSubmission = {
    ...submissionData,
    id: generateId(),
    created_at: new Date().toISOString(),
  };
  submissions.unshift(newSubmission);
  localStorage.setItem('marketing_submissions', JSON.stringify(submissions));
  return newSubmission;
};

// Newsletter Signups
export const getNewsletterSignups = (): NewsletterSignup[] => {
  const signups = localStorage.getItem('newsletter_signups');
  return signups ? JSON.parse(signups) : [];
};

export const saveNewsletterSignup = (email: string): { success: boolean; error?: string } => {
  const signups = getNewsletterSignups();
  
  // Check for duplicate email
  if (signups.some(signup => signup.email === email)) {
    return { success: false, error: 'This email is already subscribed to our newsletter.' };
  }
  
  const newSignup: NewsletterSignup = {
    id: generateId(),
    email,
    created_at: new Date().toISOString(),
  };
  
  signups.unshift(newSignup);
  localStorage.setItem('newsletter_signups', JSON.stringify(signups));
  return { success: true };
};

// Simple authentication
export const authenticateUser = (email: string, password: string): { success: boolean; error?: string } => {
  // Simple hardcoded authentication - replace with your preferred method
  if (email === 'ivan@melnyresults.com' && password === 'admin123') {
    localStorage.setItem('auth_user', JSON.stringify({ email, authenticated: true }));
    return { success: true };
  }
  return { success: false, error: 'Invalid email or password' };
};

export const getCurrentUser = () => {
  const user = localStorage.getItem('auth_user');
  return user ? JSON.parse(user) : null;
};

export const signOutUser = () => {
  localStorage.removeItem('auth_user');
};

// Initialize with some sample data if empty
export const initializeSampleData = () => {
  const posts = getBlogPosts();
  if (posts.length === 0) {
    const samplePosts: BlogPost[] = [
      {
        id: generateId(),
        title: "Smart Small > Big Dumb",
        content: "<p>In the world of marketing, bigger isn't always better. Smart, targeted campaigns that speak directly to your ideal customers will always outperform massive, unfocused efforts.</p><p>Here's why small and smart wins every time:</p><h2>Focus Creates Impact</h2><p>When you try to speak to everyone, you end up speaking to no one. Smart marketers identify their perfect customer and craft messages that resonate deeply with that specific audience.</p><h2>Quality Over Quantity</h2><p>A hundred highly qualified leads are worth more than a thousand tire-kickers. Focus on attracting the right people, not just more people.</p><h2>Efficiency Drives Profit</h2><p>Smart campaigns use resources efficiently. Instead of burning cash on broad targeting, invest in precise strategies that deliver measurable results.</p><p>Remember: Your goal isn't to impress everyone with the size of your marketing budget. Your goal is to grow your business profitably.</p>",
        excerpt: "Why smart, targeted campaigns always outperform massive, unfocused marketing efforts.",
        author: "Ivan Melnychenko",
        published_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        updated_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        image_url: "https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=800&h=400&fit=crop",
        likes_count: 12
      },
      {
        id: generateId(),
        title: "Easy Problem Fixer",
        content: "<p>The best marketing doesn't feel like marketing. It feels like a solution to a problem your customer didn't even know they had.</p><p>Here's how to become the easy problem fixer in your industry:</p><h2>Identify Hidden Pain Points</h2><p>Your customers have problems they can't articulate. Your job is to identify these hidden pain points and position your solution as the obvious answer.</p><h2>Simplify Complex Solutions</h2><p>Even if your service is complex, your explanation shouldn't be. Break down your solution into simple, digestible benefits that anyone can understand.</p><h2>Be Proactive, Not Reactive</h2><p>Don't wait for customers to come to you with problems. Anticipate their needs and present solutions before they even ask.</p><blockquote><p>\"The best time to solve a problem is before it becomes a problem.\"</p></blockquote><p>When you position yourself as the easy problem fixer, customers don't shop around. They come straight to you.</p>",
        excerpt: "How to position yourself as the go-to solution for problems your customers don't even know they have.",
        author: "Ivan Melnychenko",
        published_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        updated_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        image_url: "https://images.pexels.com/photos/3184338/pexels-photo-3184338.jpeg?auto=compress&cs=tinysrgb&w=800&h=400&fit=crop",
        likes_count: 8
      },
      {
        id: generateId(),
        title: "Do Less",
        content: "<p>The most successful businesses aren't the ones doing everything. They're the ones doing the right things exceptionally well.</p><p>Here's why doing less is actually doing more:</p><h2>Focus Amplifies Results</h2><p>When you spread your efforts across too many initiatives, each one gets diluted attention. Focus your energy on the few things that drive the biggest impact.</p><h2>Expertise Comes from Repetition</h2><p>You can't become world-class at something you only do occasionally. Pick your core strengths and double down on them.</p><h2>Clarity Attracts Customers</h2><p>Customers are confused by businesses that try to be everything to everyone. Clear positioning makes buying decisions easy.</p><h3>The 80/20 Rule in Action</h3><p>Identify the 20% of your activities that generate 80% of your results. Then eliminate or delegate everything else.</p><p>Stop trying to do it all. Start doing what matters most.</p>",
        excerpt: "Why focusing on fewer things will actually grow your business faster than trying to do everything.",
        author: "Ivan Melnychenko",
        published_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        updated_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        image_url: "https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=800&h=400&fit=crop",
        likes_count: 15
      }
    ];
    
    saveBlogPosts(samplePosts);
  }
};