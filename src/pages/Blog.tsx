import { useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, Search, Tag, ArrowRight } from "lucide-react";

const Blog = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  const blogPosts = [
    {
      id: 1,
      title: "Building Reactive UIs with Modern JavaScript",
      excerpt: "Exploring the latest patterns in frontend development, from hooks to signals and beyond. Learn how to create truly reactive user interfaces that respond instantly to user input.",
      content: "# Building Reactive UIs with Modern JavaScript\n\nIn this comprehensive guide, we'll explore...",
      date: "2024-03-15",
      readTime: "8 min read",
      tags: ["JavaScript", "React", "Frontend"],
      slug: "building-reactive-uis-modern-javascript"
    },
    {
      id: 2,
      title: "The Future of Web Development: AI-Powered Tools",
      excerpt: "A deep dive into emerging technologies shaping our industry. From AI-assisted coding to automated testing, discover what's coming next in web development.",
      content: "# The Future of Web Development\n\nArtificial Intelligence is revolutionizing...",
      date: "2024-03-10",
      readTime: "12 min read",
      tags: ["AI", "Tools", "Future Tech"],
      slug: "future-web-development-ai-tools"
    },
    {
      id: 3,
      title: "Cybersecurity in the Age of Remote Work",
      excerpt: "Essential security practices for modern development teams. Learn how to protect your applications and infrastructure in a distributed work environment.",
      content: "# Cybersecurity in Remote Work\n\nWith the shift to remote work...",
      date: "2024-03-05",
      readTime: "10 min read",
      tags: ["Security", "Remote Work", "DevOps"],
      slug: "cybersecurity-remote-work"
    },
    {
      id: 4,
      title: "Optimizing Performance in React Applications",
      excerpt: "Practical techniques for building lightning-fast React apps. From code splitting to memoization, discover proven strategies for optimal performance.",
      content: "# Optimizing React Performance\n\nPerformance is crucial for user experience...",
      date: "2024-02-28",
      readTime: "15 min read",
      tags: ["React", "Performance", "Optimization"],
      slug: "optimizing-performance-react-applications"
    },
    {
      id: 5,
      title: "Exploring WebAssembly for High-Performance Computing",
      excerpt: "Unlock the power of WebAssembly in your web applications. Learn when and how to use WASM for computationally intensive tasks in the browser.",
      content: "# WebAssembly for High Performance\n\nWebAssembly opens new possibilities...",
      date: "2024-02-20",
      readTime: "18 min read",
      tags: ["WebAssembly", "Performance", "Low-level"],
      slug: "exploring-webassembly-high-performance"
    },
    {
      id: 6,
      title: "Microservices Architecture: Lessons Learned",
      excerpt: "Real-world insights from building and maintaining microservices at scale. Discover common pitfalls and best practices for distributed systems.",
      content: "# Microservices Architecture Lessons\n\nBuilding microservices is challenging...",
      date: "2024-02-15",
      readTime: "14 min read",
      tags: ["Architecture", "Microservices", "Backend"],
      slug: "microservices-architecture-lessons-learned"
    }
  ];

  const allTags = Array.from(new Set(blogPosts.flatMap(post => post.tags)));

  const filteredPosts = blogPosts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTag = !selectedTag || post.tags.includes(selectedTag);
    return matchesSearch && matchesTag;
  });

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