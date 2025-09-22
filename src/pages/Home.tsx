import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, Code2, FileText, User } from "lucide-react";

const Home = () => {
  const featuredProjects = [
    {
      title: "Neural Network Visualizer",
      description: "Interactive ML model visualization tool built with React and D3.js",
      tech: ["React", "TypeScript", "D3.js"],
      href: "/portfolio"
    },
    {
      title: "Cyberpunk Terminal",
      description: "Retro-futuristic terminal emulator with custom themes",
      tech: ["Electron", "Node.js", "CSS"],
      href: "/portfolio"
    }
  ];

  const latestPosts = [
    {
      title: "Building Reactive UIs with Modern JavaScript",
      excerpt: "Exploring the latest patterns in frontend development...",
      date: "2024-03-15",
      href: "/blog"
    },
    {
      title: "The Future of Web Development",
      excerpt: "A deep dive into emerging technologies shaping our industry...",
      date: "2024-03-10",
      href: "/blog"
    }
  ];

  return (
    <div className="container mx-auto px-4 py-16 space-y-24">
      {/* Hero Section */}
      <section className="text-center space-y-8 py-16">
        <div className="space-y-4">
          <h1 className="text-4xl md:text-6xl font-mono font-bold tracking-tight">
            <span className="text-foreground">Hello, I'm </span>
            <span className="text-primary text-glow pulse-glow">Your Name</span>
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto">
            Full-stack developer crafting digital experiences at the intersection of design and technology
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground glow-primary">
            <Link to="/portfolio">
              <Code2 className="w-5 h-5 mr-2" />
              View Portfolio
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="border-primary/50 hover:border-primary">
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
          <h2 className="text-3xl font-mono font-bold text-foreground">Featured Projects</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            A selection of my recent work showcasing different technologies and approaches
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-6">
          {featuredProjects.map((project, index) => (
            <Card key={index} className="bg-card/50 border-border hover:border-primary/50 transition-all duration-300 group">
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
                  {project.tech.map((tech) => (
                    <span 
                      key={tech}
                      className="px-2 py-1 text-xs font-mono bg-secondary/50 text-secondary-foreground rounded border border-secondary"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
                <Button asChild variant="ghost" className="w-full justify-between p-0 h-auto hover:text-primary">
                  <Link to={project.href}>
                    View Project
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="text-center">
          <Button asChild variant="outline" size="lg">
            <Link to="/portfolio">
              View All Projects
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
          </Button>
        </div>
      </section>

      {/* Latest Blog Posts */}
      <section className="space-y-8">
        <div className="text-center space-y-4">
          <h2 className="text-3xl font-mono font-bold text-foreground">Latest Insights</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Thoughts on technology, development practices, and the future of digital experiences
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-6">
          {latestPosts.map((post, index) => (
            <Card key={index} className="bg-card/50 border-border hover:border-primary/50 transition-all duration-300 group">
              <CardHeader>
                <div className="flex items-center gap-2 text-sm text-muted-foreground font-mono">
                  <FileText className="w-4 h-4" />
                  {post.date}
                </div>
                <CardTitle className="font-mono text-xl group-hover:text-primary transition-colors">
                  {post.title}
                </CardTitle>
                <CardDescription className="text-muted-foreground">
                  {post.excerpt}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild variant="ghost" className="w-full justify-between p-0 h-auto hover:text-primary">
                  <Link to={post.href}>
                    Read More
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="text-center">
          <Button asChild variant="outline" size="lg">
            <Link to="/blog">
              View All Posts
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
};

export default Home;