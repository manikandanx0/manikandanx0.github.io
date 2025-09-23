import { useState, useEffect } from "react";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Github, Play, Loader2 } from "lucide-react";
import { loadPortfolioProjects } from "@/lib/contentLoader";

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

const Portfolio = () => {
    const [projects, setProjects] = useState<PortfolioProject[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadContent = async () => {
            try {
                setLoading(true);
                const loadedProjects = await loadPortfolioProjects();
                setProjects(loadedProjects);
                setError(null);
            } catch (err) {
                console.error("Failed to load portfolio projects:", err);
                setError(
                    "Failed to load portfolio projects. Please try again later."
                );
            } finally {
                setLoading(false);
            }
        };

        loadContent();
    }, []);

    const getStatusBadgeVariant = (status: string) => {
        switch (status.toLowerCase()) {
            case "production":
            case "live":
                return "default"; // primary color
            case "beta":
                return "secondary"; // subtle
            case "development":
                return "outline"; // neutral
            case "in progress":
                return "destructive"; // urgent
            default:
                return "outline";
        }
    };

    if (loading) {
        return (
            <div className="container mx-auto px-4 py-16 grid gap-8 md:grid-cols-2">
                {Array.from({ length: 4 }).map((_, i) => (
                    <div
                        key={i}
                        className="animate-pulse bg-card/30 rounded-xl h-64"
                    />
                ))}
            </div>
        );
    }

    if (error) {
        return (
            <div className="container mx-auto px-4 py-16">
                <div className="text-center space-y-4">
                    <h1 className="text-4xl md:text-5xl font-mono font-bold text-foreground">
                        Portfolio
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
                    Portfolio
                </h1>
                <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                    A collection of projects showcasing my experience in
                    full-stack development, machine learning, and modern web
                    technologies
                </p>
            </section>

            {/* Projects Grid */}
            <section className="grid gap-8">
                {projects.length === 0 ? (
                    <div className="text-center py-12 space-y-4">
                        <p className="text-muted-foreground text-lg">
                            No portfolio projects found.
                        </p>
                        <p className="text-sm text-muted-foreground">
                            Add some markdown files to{" "}
                            <code>content/portfolio</code> to get started.
                        </p>
                        <Button variant="outline" asChild>
                            <a
                                href="https://github.com/yourusername/portfolio"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                Add Projects
                            </a>
                        </Button>
                    </div>
                ) : (
                    projects.map((project) => (
                        <Card
                            key={project.id}
                            className="bg-card/50 border-border hover:border-primary/50 transition-all duration-300 overflow-hidden group"
                        >
                            <div className="grid md:grid-cols-2 gap-6">
                                {/* Project Image */}
                                <div className="relative overflow-hidden">
                                    <img
                                        src={project.image}
                                        alt={project.title}
                                        loading="lazy"
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
                                            <Badge
                                                variant={getStatusBadgeVariant(
                                                    project.status
                                                )}
                                            >
                                                {project.status}
                                            </Badge>
                                        </div>
                                        <CardDescription className="text-base leading-relaxed">
                                            {project.description}
                                        </CardDescription>
                                    </CardHeader>

                                    <CardContent className="p-0 space-y-4">
                                        {/* Technologies */}
                                        {project.technologies.length > 0 && (
                                            <div className="flex flex-wrap gap-2">
                                                {project.technologies.map(
                                                    (tech) => (
                                                        <span
                                                            key={tech}
                                                            className="px-3 py-1 text-sm font-mono bg-secondary/50 text-secondary-foreground rounded-md border border-secondary"
                                                        >
                                                            {tech}
                                                        </span>
                                                    )
                                                )}
                                            </div>
                                        )}

                                        {/* Action Buttons */}
                                        <div className="flex gap-3 pt-2">
                                            {project.liveUrl && (
                                                <Button
                                                    asChild
                                                    size="sm"
                                                    className="bg-primary hover:bg-primary/90 text-primary-foreground"
                                                >
                                                    <a
                                                        href={project.liveUrl}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                    >
                                                        <Play className="w-4 h-4 mr-2" />
                                                        Live Demo
                                                    </a>
                                                </Button>
                                            )}
                                            {project.githubUrl && (
                                                <Button
                                                    asChild
                                                    variant="outline"
                                                    size="sm"
                                                    className="border-primary/50 hover:border-primary"
                                                >
                                                    <a
                                                        href={project.githubUrl}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                    >
                                                        <Github className="w-4 h-4 mr-2" />
                                                        Source Code
                                                    </a>
                                                </Button>
                                            )}
                                        </div>
                                    </CardContent>
                                </div>
                            </div>
                        </Card>
                    ))
                )}
            </section>
        </div>
    );
};

export default Portfolio;
