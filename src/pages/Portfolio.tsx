import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, Github, Play } from "lucide-react";

const Portfolio = () => {
  const projects = [
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

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "Production": return "default";
      case "Beta": return "secondary";
      case "Development": return "outline";
      default: return "outline";
    }
  };

  return (
    <div className="container mx-auto px-4 py-16 space-y-12">
      {/* Header */}
      <section className="text-center space-y-4">
        <h1 className="text-4xl md:text-5xl font-mono font-bold text-foreground">
          Portfolio
        </h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          A collection of projects showcasing my experience in full-stack development, 
          machine learning, and modern web technologies
        </p>
      </section>

      {/* Projects Grid */}
      <section className="grid gap-8">
        {projects.map((project) => (
          <Card key={project.id} className="bg-card/50 border-border hover:border-primary/50 transition-all duration-300 overflow-hidden group">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Project Image */}
              <div className="relative overflow-hidden">
                <img 
                  src={project.image} 
                  alt={project.title}
                  className="w-full h-64 md:h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
              </div>

              {/* Project Info */}
              <div className="p-6 space-y-4">
                <CardHeader className="p-0">
                  <div className="flex items-center gap-3 mb-2">
                    <CardTitle className="font-mono text-2xl group-hover:text-primary transition-colors">
                      {project.title}
                    </CardTitle>
                    <Badge variant={getStatusBadgeVariant(project.status)}>
                      {project.status}
                    </Badge>
                  </div>
                  <CardDescription className="text-base leading-relaxed">
                    {project.description}
                  </CardDescription>
                </CardHeader>

                <CardContent className="p-0 space-y-4">
                  {/* Technologies */}
                  <div className="flex flex-wrap gap-2">
                    {project.technologies.map((tech) => (
                      <span 
                        key={tech}
                        className="px-3 py-1 text-sm font-mono bg-secondary/50 text-secondary-foreground rounded-md border border-secondary"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3 pt-2">
                    <Button asChild size="sm" className="bg-primary hover:bg-primary/90 text-primary-foreground">
                      <a href={project.liveUrl} target="_blank" rel="noopener noreferrer">
                        <Play className="w-4 h-4 mr-2" />
                        Live Demo
                      </a>
                    </Button>
                    <Button asChild variant="outline" size="sm" className="border-primary/50 hover:border-primary">
                      <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                        <Github className="w-4 h-4 mr-2" />
                        Source Code
                      </a>
                    </Button>
                  </div>
                </CardContent>
              </div>
            </div>
          </Card>
        ))}
      </section>

      {/* Call to Action */}
      <section className="text-center space-y-6 py-12">
        <h2 className="text-2xl md:text-3xl font-mono font-bold text-foreground">
          Interested in Working Together?
        </h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          I'm always open to discussing new opportunities and innovative projects. 
          Let's build something amazing together.
        </p>
        <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground glow-primary">
          <a href="/contact">
            <ExternalLink className="w-5 h-5 mr-2" />
            Start a Conversation
          </a>
        </Button>
      </section>
    </div>
  );
};

export default Portfolio;