import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, Search, Tag, ArrowRight, Loader2 } from "lucide-react";
import { fetchBlogPosts, BlogPost } from "@/utils/markdown";

const Blog = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadBlogPosts = async () => {
      try {
        const posts = await fetchBlogPosts();
        setBlogPosts(posts);
      } catch (error) {
        console.error('Failed to load blog posts:', error);
      } finally {
        setLoading(false);
      }
    };

    loadBlogPosts();
  }, []);

  const allTags = Array.from(new Set(blogPosts.flatMap(post => post.tags)));

  const filteredPosts = blogPosts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTag = !selectedTag || post.tags.includes(selectedTag);
    return matchesSearch && matchesTag;
  });

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <span className="ml-2 text-muted-foreground">Loading blog posts...</span>
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
          Insights on technology, development practices, and the future of digital experiences
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
        <div className="flex flex-wrap gap-2 justify-center">
          <Button
            variant={selectedTag === null ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedTag(null)}
            className="font-mono"
          >
            All Topics
          </Button>
          {allTags.map((tag) => (
            <Button
              key={tag}
              variant={selectedTag === tag ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedTag(tag)}
              className="font-mono"
            >
              <Tag className="w-3 h-3 mr-1" />
              {tag}
            </Button>
          ))}
        </div>
      </section>

      {/* Blog Posts Grid */}
      <section className="grid gap-8">
        {filteredPosts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">No articles found matching your criteria.</p>
          </div>
        ) : (
          filteredPosts.map((post) => (
            <Card key={post.id} className="bg-card/50 border-border hover-accent-border group">
              <CardHeader>
                <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground font-mono mb-2">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {new Date(post.date).toLocaleDateString('en-US', { 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
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
                <div className="flex flex-wrap gap-2">
                  {post.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="chip">
                      {tag}
                    </Badge>
                  ))}
                </div>

                {/* Read More CTA */}
                <Button asChild variant="link" className="cta-link">
                  <Link to={`/blog/${post.slug}`} aria-label={`Read full article: ${post.title}`}>
                    Read article <ArrowRight className="w-4 h-4 icon-arrow" aria-hidden="true" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))
        )}
      </section>

      {/* Newsletter Signup */}
      <section className="bg-card/30 rounded-lg border border-border p-8 text-center space-y-4">
        <h2 className="text-2xl font-mono font-bold text-foreground">
          Stay Updated
        </h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Get notified when I publish new articles about technology, development, and digital innovation.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
          <Input 
            type="email" 
            placeholder="your@email.com" 
            className="bg-input border-border focus:border-primary font-mono flex-1"
          />
          <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
            Subscribe
          </Button>
        </div>
      </section>
    </div>
  );
};

export default Blog;