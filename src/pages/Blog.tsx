import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
    Calendar,
    Clock,
    Search,
    Tag,
    ArrowRight,
    Loader2,
} from "lucide-react";
import { loadBlogPosts } from "@/lib/contentLoader";

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

const Blog = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedTag, setSelectedTag] = useState<string | null>(null);
    const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadContent = async () => {
            try {
                setLoading(true);
                const posts = await loadBlogPosts();
                setBlogPosts(posts);
                setError(null);
            } catch (err) {
                console.error("Failed to load blog posts:", err);
                setError("Failed to load blog posts. Please try again later.");
            } finally {
                setLoading(false);
            }
        };

        loadContent();
    }, []);

    const allTags = Array.from(new Set(blogPosts.flatMap((post) => post.tags)));

    const filteredPosts = blogPosts.filter((post) => {
        const matchesSearch =
            post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            post.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesTag = !selectedTag || post.tags.includes(selectedTag);
        return matchesSearch && matchesTag;
    });

    if (loading) {
        return (
            <div className="container mx-auto px-4 py-16 flex items-center justify-center min-h-64">
                <div className="flex items-center gap-3 text-muted-foreground">
                    <Loader2 className="w-6 h-6 animate-spin" />
                    <span className="font-mono">Loading blog posts...</span>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container mx-auto px-4 py-16">
                <div className="text-center space-y-4">
                    <h1 className="text-4xl md:text-5xl font-mono font-bold text-foreground">
                        Blog
                    </h1>
                    <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-6 max-w-md mx-auto">
                        <p className="text-destructive font-mono">{error}</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-16 space-y-12">
            {/* Header */}
            <section className="text-center space-y-4">
                <h1 className="text-4xl md:text-5xl font-mono font-bold text-foreground">
                    Blog
                </h1>
                <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                    Insights on technology, development practices, and the
                    future of digital experiences
                </p>
            </section>

            {/* Search and Filters */}
            <section className="space-y-6">
                {/* Search Bar */}
                <div className="relative max-w-md mx-auto">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                        type="text"
                        placeholder="Search articles..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 bg-input border-border focus:border-primary font-mono"
                    />
                </div>

                {/* Tag Filters */}
                {allTags.length > 0 && (
                    <div className="flex flex-wrap gap-2 justify-center">
                        <Button
                            variant={
                                selectedTag === null ? "default" : "outline"
                            }
                            size="sm"
                            onClick={() => setSelectedTag(null)}
                            className="font-mono"
                        >
                            All Topics
                        </Button>
                        {allTags.map((tag) => (
                            <Button
                                key={tag}
                                variant={
                                    selectedTag === tag ? "default" : "outline"
                                }
                                size="sm"
                                onClick={() => setSelectedTag(tag)}
                                className="font-mono"
                            >
                                <Tag className="w-3 h-3 mr-1" />
                                {tag}
                            </Button>
                        ))}
                    </div>
                )}
            </section>

            {/* Blog Posts Grid */}
            <section className="grid gap-8">
                {filteredPosts.length === 0 ? (
                    <div className="text-center py-12">
                        <p className="text-muted-foreground text-lg">
                            {blogPosts.length === 0
                                ? "No blog posts found. Add some markdown files to content/posts to get started."
                                : "No articles found matching your criteria."}
                        </p>
                    </div>
                ) : (
                    filteredPosts.map((post) => (
                        <Card
                            key={post.id}
                            className="bg-card/50 border-border hover-accent-border group"
                        >
                            <CardHeader>
                                <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground font-mono mb-2">
                                    <div className="flex items-center gap-1">
                                        <Calendar className="w-4 h-4" />
                                        {new Date(post.date).toLocaleDateString(
                                            "en-US",
                                            {
                                                year: "numeric",
                                                month: "long",
                                                day: "numeric",
                                            }
                                        )}
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Clock className="w-4 h-4" />
                                        {post.readTime}
                                    </div>
                                </div>

                                <CardTitle className="font-mono text-2xl group-hover:text-primary transition-colors">
                                    {post.title}
                                </CardTitle>

                                <CardDescription className="text-base leading-relaxed">
                                    {post.excerpt}
                                </CardDescription>
                            </CardHeader>

                            <CardContent className="space-y-4">
                                {/* Tags */}
                                {post.tags.length > 0 && (
                                    <div className="flex flex-wrap gap-2">
                                        {post.tags.map((tag) => (
                                            <Badge
                                                key={tag}
                                                variant="secondary"
                                                className="chip"
                                            >
                                                {tag}
                                            </Badge>
                                        ))}
                                    </div>
                                )}

                                {/* Read More CTA */}
                                <Button
                                    asChild
                                    variant="link"
                                    className="cta-link"
                                >
                                    <Link
                                        to={`/blog/${post.slug}`}
                                        aria-label={`Read full article: ${post.title}`}
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
                    ))
                )}
            </section>
        </div>
    );
};

export default Blog;
