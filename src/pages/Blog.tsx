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
      <section className="text-center space-y-6">
        <div className="terminal-panel p-6 rounded-sm">
          <div className="data-readout mb-4">
            NEXUS-9 DATABASE / BLOG MODULE
          </div>
          <h1 className="terminal-title text-4xl md:text-5xl mb-2">
            ARCHIVES
          </h1>
          <div className="data-readout">
            SIGNAL: STRONG | STATUS: ONLINE | RECORDS: {blogPosts.length}
          </div>
          <p className="text-lg text-muted-foreground mt-4 font-mono">
            Technical documentation and field reports from the digital frontier
          </p>
        </div>
      </section>

      {/* Search and Filters */}
      <section className="space-y-6">
        {/* Search Terminal */}
        <div className="terminal-panel p-4 rounded-sm max-w-2xl mx-auto">
          <div className="data-readout mb-3">SEARCH DATABASE</div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-cyber-cyan" />
            <Input
              type="text"
              placeholder="ENTER SEARCH QUERY..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-input border-cyber-cyan/30 focus:border-cyber-cyan font-mono text-cyber-cyan placeholder:text-muted-foreground uppercase tracking-wide"
            />
          </div>
        </div>

        {/* Tag Classification */}
        <div className="terminal-panel p-4 rounded-sm">
          <div className="data-readout mb-4 text-center">CLASSIFICATION FILTERS</div>
          <div className="flex flex-wrap gap-2 justify-center">
            <Button
              variant={selectedTag === null ? "cyber" : "cyber-outline"}
              size="sm"
              onClick={() => setSelectedTag(null)}
              className="font-mono text-xs tracking-wide"
            >
              ALL_RECORDS
            </Button>
            {allTags.map((tag) => (
              <Button
                key={tag}
                variant={selectedTag === tag ? "cyber" : "cyber-outline"}
                size="sm"
                onClick={() => setSelectedTag(tag)}
                className="font-mono text-xs tracking-wide"
              >
                <Tag className="w-3 h-3 mr-1" />
                {tag.toUpperCase()}
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Blog Records Grid */}
      <section className="grid gap-6">
        {filteredPosts.length === 0 ? (
          <div className="terminal-panel p-8 rounded-sm text-center">
            <div className="data-readout mb-2">ERROR: NO RECORDS FOUND</div>
            <p className="text-muted-foreground font-mono">DATABASE QUERY RETURNED ZERO MATCHES</p>
          </div>
        ) : (
          filteredPosts.map((post) => (
            <div key={post.id} className="id-card p-6 rounded-sm hover:border-cyber-cyan/60 transition-all duration-300 group">
              {/* Terminal Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="data-readout">
                  ID: {post.id.toString().padStart(4, '0')} | ACCESS: GRANTED
                </div>
                <div className="data-readout text-right">
                  {new Date(post.date).toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: '2-digit', 
                    day: '2-digit' 
                  }).replace(/\//g, '.')}
                </div>
              </div>

              {/* Main Content */}
              <div className="space-y-4">
                <h2 className="terminal-title text-xl md:text-2xl group-hover:text-shadow-glow transition-all duration-300">
                  {post.title}
                </h2>
                
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="md:col-span-2">
                    <p className="text-muted-foreground leading-relaxed font-mono text-sm">
                      {post.excerpt}
                    </p>
                  </div>
                  
                  <div className="space-y-3">
                    {/* Technical Data */}
                    <div className="data-readout">
                      <div>READ_TIME: {post.readTime}</div>
                      <div className="flex items-center gap-1 mt-1">
                        <Clock className="w-3 h-3" />
                        DURATION: {post.readTime.replace(' read', '').toUpperCase()}
                      </div>
                    </div>
                    
                    {/* Classification Tags */}
                    <div className="space-y-2">
                      <div className="data-readout">CLASSIFICATION:</div>
                      <div className="flex flex-wrap gap-1">
                        {post.tags.map((tag) => (
                          <Badge key={tag} variant="secondary" className="font-mono text-xs bg-cyber-cyan/10 text-cyber-cyan border-cyber-cyan/30">
                            {tag.toUpperCase()}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Access Terminal */}
                <div className="flex items-center justify-between pt-4 border-t border-cyber-cyan/20">
                  <div className="data-readout">
                    STATUS: ARCHIVED | SECURITY: PUBLIC
                  </div>
                  <Button asChild variant="cyber-outline" size="sm" className="group-hover:bg-cyber-cyan/10">
                    <Link to={`/blog/${post.slug}`} aria-label={`Access record: ${post.title}`}>
                      ACCESS_FILE <ArrowRight className="w-3 h-3 ml-1" aria-hidden="true" />
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          ))
        )}
      </section>

      {/* Communication Terminal */}
      <section className="terminal-panel p-8 rounded-sm text-center space-y-6">
        <div className="data-readout mb-4">
          COMMUNICATIONS UPLINK / SUBSCRIPTION MODULE
        </div>
        <h2 className="terminal-title text-2xl">
          MAINTAIN CONNECTION
        </h2>
        <p className="text-muted-foreground max-w-2xl mx-auto font-mono text-sm">
          ESTABLISH SECURE CHANNEL FOR INCOMING TRANSMISSIONS REGARDING TECHNOLOGICAL DEVELOPMENTS AND DIGITAL INNOVATIONS
        </p>
        <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
          <Input 
            type="email" 
            placeholder="ENTER_EMAIL_ADDRESS" 
            className="bg-input border-cyber-cyan/30 focus:border-cyber-cyan font-mono text-cyber-cyan placeholder:text-muted-foreground uppercase tracking-wide flex-1"
          />
          <Button variant="cyber" className="whitespace-nowrap">
            ESTABLISH_LINK
          </Button>
        </div>
        <div className="data-readout">
          ENCRYPTION: AES-256 | PROTOCOL: SECURE
        </div>
      </section>
    </div>
  );
};

export default Blog;