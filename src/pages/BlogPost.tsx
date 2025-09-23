import { useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Calendar, Clock, Share, Loader2 } from "lucide-react";
import { getBlogPost } from "@/lib/contentLoader";

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

const BlogPost = () => {
    const { slug } = useParams();
    const [post, setPost] = useState<BlogPost | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadPost = async () => {
            if (!slug) {
                setError("No post slug provided");
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                const loadedPost = await getBlogPost(slug);
                if (loadedPost) {
                    setPost(loadedPost);
                    setError(null);
                } else {
                    setError("Post not found");
                }
            } catch (err) {
                console.error("Failed to load blog post:", err);
                setError("Failed to load blog post. Please try again later.");
            } finally {
                setLoading(false);
            }
        };

        loadPost();
    }, [slug]);

    const formatContent = (content: string) => {
        return content
            .split("\n")
            .map((line) => {
                line = line.trim();

                if (line.startsWith("# ")) {
                    return `<h1 class="text-3xl font-mono font-bold text-foreground mb-6">${line.slice(
                        2
                    )}</h1>`;
                }
                if (line.startsWith("## ")) {
                    return `<h2 class="text-2xl font-mono font-bold text-foreground mb-4 mt-8">${line.slice(
                        3
                    )}</h2>`;
                }
                if (line.startsWith("### ")) {
                    return `<h3 class="text-xl font-mono font-bold text-primary mb-3 mt-6">${line.slice(
                        4
                    )}</h3>`;
                }
                if (line.startsWith("#### ")) {
                    return `<h4 class="text-lg font-mono font-bold text-foreground mb-2 mt-4">${line.slice(
                        5
                    )}</h4>`;
                }
                if (line.startsWith("```")) {
                    if (
                        line.includes("javascript") ||
                        line.includes("js") ||
                        line.includes("typescript") ||
                        line.includes("ts")
                    ) {
                        return '<pre class="bg-card border border-border rounded-lg p-4 my-4 overflow-x-auto"><code class="font-mono text-sm text-cyber-cyan">';
                    } else if (line === "```") {
                        return "</code></pre>";
                    } else {
                        return '<pre class="bg-card border border-border rounded-lg p-4 my-4 overflow-x-auto"><code class="font-mono text-sm">';
                    }
                }
                if (
                    line.startsWith("*") &&
                    line.endsWith("*") &&
                    !line.includes("**") &&
                    line.slice(1, -1).indexOf("*") === -1
                ) {
                    return `<p class="text-muted-foreground italic mb-4">${line.slice(
                        1,
                        -1
                    )}</p>`;
                }
                if (line.startsWith("**") && line.endsWith("**")) {
                    return `<p class="font-bold mb-4">${line.slice(2, -2)}</p>`;
                }
                if (line.startsWith("---") || line === "***") {
                    return '<hr class="border-border my-8" />';
                }
                if (line.trim() === "") {
                    return "<br>";
                }

                // Handle inline formatting
                line = line.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
                line = line.replace(/\*(.*?)\*/g, "<em>$1</em>");
                line = line.replace(
                    /`(.*?)`/g,
                    '<code class="bg-secondary px-1 py-0.5 rounded text-sm font-mono">$1</code>'
                );

                // Handle links
                line = line.replace(
                    /\[([^\]]+)\]\(([^)]+)\)/g,
                    '<a href="$2" class="text-primary hover:underline" target="_blank" rel="noopener noreferrer">$1</a>'
                );

                return `<p class="text-foreground leading-relaxed mb-4">${line}</p>`;
            })
            .join("");
    };

    const handleShare = async () => {
        if (navigator.share && post) {
            try {
                await navigator.share({
                    title: post.title,
                    text: post.excerpt,
                    url: window.location.href,
                });
            } catch (err) {
                // Fallback to copying URL to clipboard
                navigator.clipboard.writeText(window.location.href);
            }
        } else {
            // Fallback to copying URL to clipboard
            navigator.clipboard.writeText(window.location.href);
        }
    };

    if (loading) {
        return (
            <div className="container mx-auto px-4 py-16 flex items-center justify-center min-h-64">
                <div className="flex items-center gap-3 text-muted-foreground">
                    <Loader2 className="w-6 h-6 animate-spin" />
                    <span className="font-mono">Loading article...</span>
                </div>
            </div>
        );
    }

    if (error || !post) {
        return (
            <div className="container mx-auto px-4 py-16 max-w-4xl">
                <div className="mb-8">
                    <Button asChild variant="link" className="cta-link">
                        <Link to="/blog" aria-label="Back to blog">
                            <ArrowLeft
                                className="w-4 h-4 icon-arrow"
                                aria-hidden="true"
                            />
                            Back to blog
                        </Link>
                    </Button>
                </div>

                <div className="text-center space-y-4 py-16">
                    <h1 className="text-4xl font-mono font-bold text-foreground">
                        Article Not Found
                    </h1>
                    <p className="text-muted-foreground">
                        {error ||
                            "The article you're looking for doesn't exist."}
                    </p>
                    <Button asChild className="mt-4">
                        <Link to="/blog">Browse All Articles</Link>
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-16 max-w-4xl">
            {/* Back Button */}
            <div className="mb-8">
                <Button asChild variant="link" className="cta-link">
                    <Link to="/blog" aria-label="Back to blog">
                        <ArrowLeft
                            className="w-4 h-4 icon-arrow"
                            aria-hidden="true"
                        />
                        Back to blog
                    </Link>
                </Button>
            </div>

            {/* Article Header */}
            <header className="space-y-6 mb-12">
                <div className="space-y-4">
                    <h1 className="text-4xl md:text-5xl font-mono font-bold text-foreground leading-tight">
                        {post.title}
                    </h1>

                    <div className="flex flex-wrap items-center gap-4 text-muted-foreground font-mono">
                        <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {new Date(post.date).toLocaleDateString("en-US", {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                            })}
                        </div>
                        <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {post.readTime}
                        </div>
                    </div>

                    {post.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                            {post.tags.map((tag) => (
                                <Badge
                                    key={tag}
                                    variant="secondary"
                                    className="font-mono"
                                >
                                    {tag}
                                </Badge>
                            ))}
                        </div>
                    )}
                </div>

                {/* Share Button */}
                <div className="flex gap-4">
                    <Button
                        variant="outline"
                        size="sm"
                        className="font-mono"
                        onClick={handleShare}
                    >
                        <Share className="w-4 h-4 mr-2" />
                        Share Article
                    </Button>
                </div>
            </header>

            {/* Article Content */}
            <article className="prose prose-lg max-w-none">
                <div
                    className="blog-content"
                    dangerouslySetInnerHTML={{
                        __html: formatContent(post.content),
                    }}
                />
            </article>

            {/* Article Footer */}
            <footer className="mt-16 pt-8 border-t border-border">
                <div className="text-center space-y-4">
                    <p className="text-muted-foreground">
                        Enjoyed this article? Share it with your network or
                        reach out to discuss further.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Button asChild variant="link" className="cta-link">
                            <Link to="/contact" aria-label="Get in touch">
                                Get in touch
                            </Link>
                        </Button>
                        <Button asChild variant="link" className="cta-link">
                            <Link to="/blog" aria-label="Read more articles">
                                Read more articles
                            </Link>
                        </Button>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default BlogPost;
