// src/lib/contentLoader.ts
interface BlogPost {
    id: string;
    title: string;
    excerpt: string;
    content: string;
    date: string;
    readTime: string;
    tags: string[];
    slug: string;
}

interface PortfolioProject {
    id: string;
    title: string;
    description: string;
    image: string;
    technologies: string[];
    liveUrl?: string;
    githubUrl?: string;
    status: string;
}

// Parse front matter from markdown content
function parseFrontMatter(content: string): {
    frontMatter: any;
    content: string;
} {
    const frontMatterRegex = /^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/;
    const match = content.match(frontMatterRegex);

    if (!match) {
        return { frontMatter: {}, content };
    }

    const [, frontMatterStr, markdownContent] = match;
    const frontMatter: any = {};

    // Simple YAML-like parser for front matter
    const lines = frontMatterStr.split("\n");
    for (const line of lines) {
        const [key, ...valueParts] = line.split(":");
        if (key && valueParts.length > 0) {
            const value = valueParts.join(":").trim();

            // Handle arrays (tags, technologies)
            if (value.startsWith("[") && value.endsWith("]")) {
                frontMatter[key.trim()] = value
                    .slice(1, -1)
                    .split(",")
                    .map((item) => item.trim().replace(/['"]/g, ""));
            } else {
                frontMatter[key.trim()] = value.replace(/['"]/g, "");
            }
        }
    }

    return { frontMatter, content: markdownContent };
}

// Calculate estimated read time
function calculateReadTime(content: string): string {
    const wordsPerMinute = 200;
    const words = content.split(/\s+/).length;
    const minutes = Math.ceil(words / wordsPerMinute);
    return `${minutes} min read`;
}

// Generate slug from filename
function generateSlug(filename: string): string {
    return filename
        .replace(/\.md$/, "")
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
}

// Load blog posts from content/posts directory
export async function loadBlogPosts(): Promise<BlogPost[]> {
    try {
        const posts: BlogPost[] = [];

        // List of post files - in a real app, you'd read the directory
        const postFiles = [
            "cybersecurity-remote-work.md",
            "future-web-development-ai-tools.md",
            "sample-post.md",
        ];

        for (const filename of postFiles) {
            try {
                const response = await fetch(`/content/posts/${filename}`);
                if (!response.ok) throw new Error(`HTTP ${response.status}`);
                const content = await response.text();
                const { frontMatter, content: markdownContent } =
                    parseFrontMatter(content);

                const post: BlogPost = {
                    id: generateSlug(filename),
                    title: frontMatter.title || "Untitled Post",
                    excerpt:
                        frontMatter.excerpt ||
                        markdownContent
                            .substring(0, 200)
                            .replace(/[#*]/g, "")
                            .trim() + "...",
                    content: markdownContent,
                    date:
                        frontMatter.date ||
                        new Date().toISOString().split("T")[0],
                    readTime:
                        frontMatter.readTime ||
                        calculateReadTime(markdownContent),
                    tags: frontMatter.tags || [],
                    slug: frontMatter.slug || generateSlug(filename),
                };

                posts.push(post);
            } catch (error) {
                console.warn(`Failed to load post: ${filename}`, error);
            }
        }

        // Sort posts by date (newest first)
        return posts.sort(
            (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
        );
    } catch (error) {
        console.error("Failed to load blog posts:", error);
        return [];
    }
}

// Load portfolio projects from content/portfolio directory
export async function loadPortfolioProjects(): Promise<PortfolioProject[]> {
    try {
        const projects: PortfolioProject[] = [];

        // List of project files - in a real app, you'd read the directory
        const projectFiles = ["project-1.md", "project-2.md"];

        for (const filename of projectFiles) {
            try {
                const response = await fetch(`/content/portfolio/${filename}`);
                if (!response.ok) throw new Error(`HTTP ${response.status}`);
                const content = await response.text();
                const { frontMatter, content: markdownContent } =
                    parseFrontMatter(content);

                const project: PortfolioProject = {
                    id: generateSlug(filename),
                    title: frontMatter.title || "Untitled Project",
                    description:
                        frontMatter.description ||
                        markdownContent
                            .substring(0, 200)
                            .replace(/[#*]/g, "")
                            .trim(),
                    image:
                        frontMatter.image ||
                        "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=500&h=300&fit=crop",
                    technologies:
                        frontMatter.technologies || frontMatter.tech || [],
                    liveUrl: frontMatter.liveUrl || frontMatter.demo,
                    githubUrl:
                        frontMatter.githubUrl ||
                        frontMatter.github ||
                        frontMatter.repo,
                    status: frontMatter.status || "Development",
                };

                projects.push(project);
            } catch (error) {
                console.warn(`Failed to load project: ${filename}`, error);
            }
        }

        return projects;
    } catch (error) {
        console.error("Failed to load portfolio projects:", error);
        return [];
    }
}

// Get a single blog post by slug
export async function getBlogPost(slug: string): Promise<BlogPost | null> {
    const posts = await loadBlogPosts();
    return posts.find((post) => post.slug === slug) || null;
}

// Get a single portfolio project by id
export async function getPortfolioProject(
    id: string
): Promise<PortfolioProject | null> {
    const projects = await loadPortfolioProjects();
    return projects.find((project) => project.id === id) || null;
}
