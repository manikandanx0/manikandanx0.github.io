import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { ArrowRight, Code2, FileText, User, Loader2 } from "lucide-react";
import { loadPortfolioProjects, loadBlogPosts } from "@/lib/contentLoader";

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

const Home = () => {
    const [featuredProjects, setFeaturedProjects] = useState<
        PortfolioProject[]
    >([]);
    const [latestPosts, setLatestPosts] = useState<BlogPost[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadContent = async () => {
            try {
                setLoading(true);

                // Load projects and posts concurrently
                const [projects, posts] = await Promise.all([
                    loadPortfolioProjects(),
                    loadBlogPosts(),
                ]);

                // Get first 2 projects as featured
                setFeaturedProjects(projects.slice(0, 2));

                // Get latest 2 blog posts
                setLatestPosts(posts.slice(0, 2));
            } catch (error) {
                console.error("Failed to load homepage content:", error);
            } finally {
                setLoading(false);
            }
        };

        loadContent();
    }, []);

    if (loading) {
        return (
            <div className="container mx-auto px-4 py-16 flex items-center justify-center min-h-screen">
                <div className="flex items-center gap-3 text-muted-foreground">
                    <Loader2 className="w-6 h-6 animate-spin" />
                    <span className="font-mono">Loading...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-16 space-y-24">
            {/* Hero Section */}
            <section className="text-center space-y-8 py-16">
                <div className="space-y-4">
                    <h1 className="text-4xl md:text-6xl font-mono font-bold tracking-tight">
                        <span className="text-foreground">Hello, I'm </span>
                        <span className="text-primary">Manikandan</span>
                    </h1>
                    <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto">
                        Aspiring software engineer with a passion for security
                        and cloud engineering. Showcasing projects and technical
                        insights.
                    </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                    <Button
                        asChild
                        size="lg"
                        className="bg-primary hover:bg-primary/90 text-primary-foreground glow-primary"
                    >
                        <Link to="/portfolio">
                            <Code2 className="w-5 h-5 mr-2" />
                            View Portfolio
                        </Link>
                    </Button>
                    <Button
                        asChild
                        variant="outline"
                        size="lg"
                        className="border-primary/50 hover:border-primary"
                    >
                        <Link to="/contact">
                            <User className="w-5 h-5 mr-2" />
                            Get In Touch
                        </Link>
                    </Button>
                </div>
            </section>

            {/* Featured Projects */}
            <section className="space-y-8">
                <div className="text-center space-y-4">
                    <h2 className="text-3xl font-mono font-bold text-foreground">
                        Featured Projects
                    </h2>
                    <p className="text-muted-foreground max-w-2xl mx-auto">
                        A selection of my recent work showcasing different
                        technologies and approaches
                    </p>
                </div>

                {featuredProjects.length === 0 ? (
                    <div className="text-center py-8">
                        <p className="text-muted-foreground">
                            No projects available yet. Add some markdown files
                            to content/portfolio to showcase your work.
                        </p>
                    </div>
                ) : (
                    <div className="grid md:grid-cols-2 gap-6">
                        {featuredProjects.map((project) => (
                            <Card
                                key={project.id}
                                className="bg-card/50 border-border hover-accent-border group"
                            >
                                <CardHeader>
                                    <CardTitle className="font-mono text-xl group-hover:text-primary transition-colors">
                                        {project.title}
                                    </CardTitle>
                                    <CardDescription className="text-muted-foreground">
                                        {project.description}
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="flex flex-wrap gap-2">
                                        {project.technologies
                                            .slice(0, 3)
                                            .map((tech) => (
                                                <span
                                                    key={tech}
                                                    className="chip bg-secondary/50 text-secondary-foreground border-secondary"
                                                >
                                                    {tech}
                                                </span>
                                            ))}
                                        {project.technologies.length > 3 && (
                                            <span className="chip bg-secondary/50 text-secondary-foreground border-secondary">
                                                +
                                                {project.technologies.length -
                                                    3}{" "}
                                                more
                                            </span>
                                        )}
                                    </div>
                                    <Button
                                        asChild
                                        variant="link"
                                        className="cta-link"
                                    >
                                        <Link
                                            to="/portfolio"
                                            aria-label={`View project: ${project.title}`}
                                        >
                                            View project{" "}
                                            <ArrowRight
                                                className="w-4 h-4 icon-arrow"
                                                aria-hidden="true"
                                            />
                                        </Link>
                                    </Button>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}

                <div className="text-center">
                    <Button asChild variant="link" className="cta-link">
                        <Link to="/portfolio" aria-label="View all projects">
                            View all projects{" "}
                            <ArrowRight
                                className="w-5 h-5 icon-arrow"
                                aria-hidden="true"
                            />
                        </Link>
                    </Button>
                </div>
            </section>

            {/* Latest Blog Posts */}
            <section className="space-y-8">
                <div className="text-center space-y-4">
                    <h2 className="text-3xl font-mono font-bold text-foreground">
                        Latest Insights
                    </h2>
                    <p className="text-muted-foreground max-w-2xl mx-auto">
                        Thoughts on technology, development practices, and the
                        future of digital experiences
                    </p>
                </div>

                {latestPosts.length === 0 ? (
                    <div className="text-center py-8">
                        <p className="text-muted-foreground">
                            No blog posts available yet. Add some markdown files
                            to content/posts to share your insights.
                        </p>
                    </div>
                ) : (
                    <div className="grid md:grid-cols-2 gap-6">
                        {latestPosts.map((post) => (
                            <Card
                                key={post.id}
                                className="bg-card/50 border-border hover-accent-border group"
                            >
                                <CardHeader>
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground font-mono">
                                        <FileText className="w-4 h-4" />
                                        {new Date(post.date).toLocaleDateString(
                                            "en-US",
                                            {
                                                year: "numeric",
                                                month: "short",
                                                day: "numeric",
                                            }
                                        )}
                                    </div>
                                    <CardTitle className="font-mono text-xl group-hover:text-primary transition-colors">
                                        {post.title}
                                    </CardTitle>
                                    <CardDescription className="text-muted-foreground">
                                        {post.excerpt}
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <Button
                                        asChild
                                        variant="link"
                                        className="cta-link"
                                    >
                                        <Link
                                            to={`/blog/${post.slug}`}
                                            aria-label={`Read article: ${post.title}`}
                                        >
                                            Read article{" "}
                                            <ArrowRight
                                                className="w-4 h-4 icon-arrow"
                                                aria-hidden="true"
                                            />
                                        </Link>
                                    </Button>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}

                <div className="text-center">
                    <Button asChild variant="link" className="cta-link">
                        <Link to="/blog" aria-label="View all posts">
                            View all posts{" "}
                            <ArrowRight
                                className="w-5 h-5 icon-arrow"
                                aria-hidden="true"
                            />
                        </Link>
                    </Button>
                </div>
            </section>
        </div>
    );
};

export default Home;
