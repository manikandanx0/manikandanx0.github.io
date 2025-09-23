import matter from 'gray-matter';

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  date: string;
  readTime: string;
  tags: string[];
  slug: string;
}

export interface Project {
  id: number;
  title: string;
  description: string;
  image: string;
  technologies: string[];
  liveUrl: string;
  githubUrl: string;
  status: string;
}

// Function to fetch and parse markdown files
export async function fetchBlogPosts(): Promise<BlogPost[]> {
  const posts: BlogPost[] = [];
  
  // List of markdown files in public/posts
  const postFiles = [
    'future-web-development-ai-tools.md',
    'cybersecurity-remote-work.md'
  ];
  
  for (const fileName of postFiles) {
    try {
      const response = await fetch(`/posts/${fileName}`);
      const markdownContent = await response.text();
      const { data: frontmatter, content } = matter(markdownContent);
      
      // Extract slug from filename
      const slug = fileName.replace('.md', '');
      
      // Parse title from first heading if not in frontmatter
      const title = frontmatter.title || content.match(/^#\s+(.+)$/m)?.[1] || 'Untitled';
      
      // Extract date and reading time from content
      const dateMatch = content.match(/\*Published on (.+?) •/);
      const readTimeMatch = content.match(/• (.+? read)\*/);
      
      const date = frontmatter.date || dateMatch?.[1] || new Date().toISOString().split('T')[0];
      const readTime = frontmatter.readTime || readTimeMatch?.[1] || '5 min read';
      
      // Generate excerpt from content
      const excerpt = frontmatter.excerpt || 
        content.replace(/^#.+$/gm, '') // Remove headings
               .replace(/\*.*?\*/g, '') // Remove italic text
               .replace(/```[\s\S]*?```/g, '') // Remove code blocks
               .replace(/\n+/g, ' ') // Replace newlines with spaces
               .trim()
               .substring(0, 200) + '...';
      
      // Extract tags (could be in frontmatter or inferred from content)
      const tags = frontmatter.tags || inferTagsFromContent(content, title);
      
      posts.push({
        id: slug,
        title,
        excerpt,
        content,
        date: formatDate(date),
        readTime,
        tags,
        slug
      });
    } catch (error) {
      console.error(`Failed to load blog post: ${fileName}`, error);
    }
  }
  
  // Sort posts by date (newest first)
  return posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

// Function to fetch projects data
export async function fetchProjects(): Promise<Project[]> {
  // For now, return the hardcoded projects, but this could be moved to a JSON file
  return [
    {
      id: 1,
      title: "Neural Network Visualizer",
      description: "Interactive machine learning model visualization tool that helps users understand how neural networks process data. Built with React, D3.js, and TensorFlow.js for real-time model training and visualization.",
      image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=500&h=300&fit=crop",
      technologies: ["React", "TypeScript", "D3.js", "TensorFlow.js", "Python"],
      liveUrl: "https://example.com",
      githubUrl: "https://github.com/example",
      status: "Production"
    },
    {
      id: 2,
      title: "Cyberpunk Terminal Emulator",
      description: "A retro-futuristic terminal emulator with customizable themes, syntax highlighting, and plugin support. Features include multiple tab support, custom command aliases, and a built-in package manager.",
      image: "https://images.unsplash.com/photo-1629654297299-c8506221ca97?w=500&h=300&fit=crop",
      technologies: ["Electron", "Node.js", "TypeScript", "CSS", "WebGL"],
      liveUrl: "https://example.com",
      githubUrl: "https://github.com/example",
      status: "Beta"
    },
    {
      id: 3,
      title: "Blockchain Analytics Dashboard",
      description: "Real-time cryptocurrency and DeFi analytics platform with advanced charting, portfolio tracking, and market sentiment analysis. Supports multiple chains and provides API access for developers.",
      image: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=500&h=300&fit=crop",
      technologies: ["Next.js", "PostgreSQL", "Redis", "Web3.js", "Chart.js"],
      liveUrl: "https://example.com",
      githubUrl: "https://github.com/example",
      status: "Production"
    },
    {
      id: 4,
      title: "AI Code Review Assistant",
      description: "Intelligent code review tool that analyzes pull requests, suggests improvements, and identifies potential security vulnerabilities. Integrates with GitHub, GitLab, and Bitbucket.",
      image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=500&h=300&fit=crop",
      technologies: ["Python", "FastAPI", "OpenAI", "Docker", "MongoDB"],
      liveUrl: "https://example.com",
      githubUrl: "https://github.com/example",
      status: "Development"
    },
    {
      id: 5,
      title: "Real-time Collaboration Platform",
      description: "A modern collaboration platform with real-time document editing, video conferencing, and project management features. Built for remote teams with end-to-end encryption.",
      image: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=500&h=300&fit=crop",
      technologies: ["React", "Socket.io", "WebRTC", "MongoDB", "Express"],
      liveUrl: "https://example.com",
      githubUrl: "https://github.com/example",
      status: "Production"
    },
    {
      id: 6,
      title: "IoT Device Manager",
      description: "Comprehensive IoT device management system with real-time monitoring, automated alerts, and remote control capabilities. Supports various protocols including MQTT, CoAP, and HTTP.",
      image: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=500&h=300&fit=crop",
      technologies: ["Vue.js", "MQTT", "InfluxDB", "Grafana", "Go"],
      liveUrl: "https://example.com",
      githubUrl: "https://github.com/example",
      status: "Production"
    }
  ];
}

// Helper function to infer tags from content
function inferTagsFromContent(content: string, title: string): string[] {
  const techKeywords = {
    'JavaScript': ['javascript', 'js', 'react', 'vue', 'angular', 'node'],
    'React': ['react', 'jsx', 'hooks', 'component'],
    'AI': ['ai', 'artificial intelligence', 'machine learning', 'neural network'],
    'Security': ['security', 'cybersecurity', 'encryption', 'auth'],
    'Frontend': ['frontend', 'ui', 'ux', 'css', 'html'],
    'Backend': ['backend', 'api', 'database', 'server'],
    'Performance': ['performance', 'optimization', 'speed'],
    'DevOps': ['devops', 'deployment', 'ci/cd', 'docker'],
    'Tools': ['tools', 'development', 'productivity']
  };
  
  const text = (title + ' ' + content).toLowerCase();
  const tags: string[] = [];
  
  for (const [tag, keywords] of Object.entries(techKeywords)) {
    if (keywords.some(keyword => text.includes(keyword))) {
      tags.push(tag);
    }
  }
  
  return tags.length > 0 ? tags : ['Technology'];
}

// Helper function to format date
function formatDate(dateString: string): string {
  try {
    return new Date(dateString).toISOString().split('T')[0];
  } catch {
    return new Date().toISOString().split('T')[0];
  }
}