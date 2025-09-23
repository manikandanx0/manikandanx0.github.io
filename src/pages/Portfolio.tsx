import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, Github, Play, Loader2 } from "lucide-react";
import { fetchProjects, Project } from "@/utils/markdown";

const Portfolio = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProjects = async () => {
      try {
        const projectsData = await fetchProjects();
        setProjects(projectsData);
      } catch (error) {
        console.error('Failed to load projects:', error);
      } finally {
        setLoading(false);
      }
    };

    loadProjects();
  }, []);

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "Production": return "default";
      case "Beta": return "secondary";
      case "Development": return "outline";
      default: return "outline";
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <span className="ml-2 text-muted-foreground">Loading projects...</span>
        </div>
      </div>
    );
  }

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