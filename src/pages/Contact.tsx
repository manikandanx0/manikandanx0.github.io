import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import {
    Mail,
    MapPin,
    Phone,
    Send,
    Github,
    Linkedin,
    Twitter,
    X,
} from "lucide-react";

const Contact = () => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        subject: "",
        message: "",
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        // Simulate form submission
        try {
            await new Promise((resolve) => setTimeout(resolve, 2000));

            toast({
                title: "Message Sent Successfully!",
                description:
                    "Thank you for reaching out. I'll get back to you within 24 hours.",
            });

            // Reset form
            setFormData({
                name: "",
                email: "",
                subject: "",
                message: "",
            });
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to send message. Please try again.",
                variant: "destructive",
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const contactInfo = [
        {
            icon: Mail,
            label: "Email",
            value: "manikandanx0@proton.me",
            href: "mailto:manikandanx0@proton.me",
        },
        {
            icon: MapPin,
            label: "Location",
            value: "Chennai, IN",
            href: "#",
        },
    ];

    const socialLinks = [
        {
            icon: Github,
            label: "GitHub",
            href: "https://github.com/manikandanx0",
            color: "hover:text-cyber-cyan",
        },
        {
            icon: Linkedin,
            label: "LinkedIn",
            href: "https://linkedin.com/in/manikandannx0",
            color: "hover:text-cyber-blue",
        },
        {
            icon: X,
            label: "X",
            href: "https://x.com/manikandanx0",
            color: "hover:text-cyber-purple",
        },
    ];

    return (
        <div className="container mx-auto px-4 py-16 space-y-12">
            {/* Header */}
            <section className="text-center space-y-4">
                <h1 className="text-4xl md:text-5xl font-mono font-bold text-foreground">
                    Get In Touch
                </h1>
                <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                    Ready to start a project or just want to chat about
                    technology? I'd love to hear from you.
                </p>
            </section>

            <div className="grid lg:grid-cols-2 gap-12">
                {/* Contact Form */}
                <Card className="bg-card/50 border-border">
                    <CardHeader>
                        <CardTitle className="font-mono text-2xl">
                            Send a Message
                        </CardTitle>
                        <CardDescription>
                            Fill out the form below and I'll get back to you as
                            soon as possible.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid sm:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="name" className="font-mono">
                                        Name
                                    </Label>
                                    <Input
                                        id="name"
                                        name="name"
                                        type="text"
                                        placeholder="Your name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        required
                                        className="bg-input border-border focus:border-primary font-mono"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label
                                        htmlFor="email"
                                        className="font-mono"
                                    >
                                        Email
                                    </Label>
                                    <Input
                                        id="email"
                                        name="email"
                                        type="email"
                                        placeholder="your@email.com"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        required
                                        className="bg-input border-border focus:border-primary font-mono"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="subject" className="font-mono">
                                    Subject
                                </Label>
                                <Input
                                    id="subject"
                                    name="subject"
                                    type="text"
                                    placeholder="What's this about?"
                                    value={formData.subject}
                                    onChange={handleInputChange}
                                    required
                                    className="bg-input border-border focus:border-primary font-mono"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="message" className="font-mono">
                                    Message
                                </Label>
                                <Textarea
                                    id="message"
                                    name="message"
                                    placeholder="Tell me about your project or just say hello..."
                                    value={formData.message}
                                    onChange={handleInputChange}
                                    required
                                    rows={6}
                                    className="bg-input border-border focus:border-primary font-mono resize-none"
                                />
                            </div>

                            <Button
                                type="submit"
                                size="lg"
                                disabled={isSubmitting}
                                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground glow-primary"
                            >
                                {isSubmitting ? (
                                    <>
                                        <div className="w-4 h-4 mr-2 border-2 border-current border-t-transparent rounded-full animate-spin" />
                                        Sending...
                                    </>
                                ) : (
                                    <>
                                        <Send className="w-5 h-5 mr-2" />
                                        Send Message
                                    </>
                                )}
                            </Button>
                        </form>
                    </CardContent>
                </Card>

                {/* Contact Information */}
                <div className="space-y-8">
                    {/* Social Links */}
                    <Card className="bg-card/50 border-border">
                        <CardHeader>
                            <CardTitle className="font-mono text-2xl">
                                Connect Online
                            </CardTitle>
                            <CardDescription>
                                Follow my work and connect on social platforms.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="flex gap-4">
                                {socialLinks.map((social, index) => (
                                    <a
                                        key={index}
                                        href={social.href}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className={`w-12 h-12 bg-secondary/50 rounded-lg flex items-center justify-center transition-all duration-300 hover:scale-110 hover:bg-secondary ${social.color}`}
                                    >
                                        <social.icon className="w-6 h-6" />
                                    </a>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Availability */}
                    <Card className="bg-card/50 border-border">
                        <CardHeader>
                            <CardTitle className="font-mono text-2xl">
                                Current Availability
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center gap-3">
                                <div className="w-3 h-3 bg-cyber-green rounded-full animate-pulse"></div>
                                <span className="text-foreground">
                                    Available for new projects
                                </span>
                            </div>
                            <p className="text-muted-foreground">
                                I'm currently accepting new freelance projects
                                and consulting opportunities. Response time is
                                typically within 24 hours.
                            </p>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default Contact;
