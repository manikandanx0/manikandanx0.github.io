import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Calendar, Clock, Share } from "lucide-react";

const BlogPost = () => {
  const { slug } = useParams();

  // In a real app, you'd fetch the post based on the slug
  const post = {
    title: "Building Reactive UIs with Modern JavaScript",
    date: "2024-03-15",
    readTime: "8 min read",
    tags: ["JavaScript", "React", "Frontend"],
    content: `
# Building Reactive UIs with Modern JavaScript

*Published on March 15, 2024 • 8 min read*

---

## Introduction

In the rapidly evolving landscape of web development, creating reactive user interfaces has become more crucial than ever. Users expect instant feedback, seamless interactions, and interfaces that respond immediately to their actions.

## The Evolution of Reactivity

### From jQuery to Modern Frameworks

The journey from imperative DOM manipulation to declarative, reactive frameworks has transformed how we build web applications:

\`\`\`javascript
// Old way - Imperative
$('#button').click(function() {
  $('#counter').text(parseInt($('#counter').text()) + 1);
});

// Modern way - Reactive
const [count, setCount] = useState(0);
return <button onClick={() => setCount(count + 1)}>{count}</button>;
\`\`\`

### The Rise of Signals

Signals represent the next evolution in reactivity, offering fine-grained updates and better performance:

\`\`\`javascript
import { signal, computed } from '@preact/signals';

const count = signal(0);
const doubleCount = computed(() => count.value * 2);

// Automatically updates when count changes
function Counter() {
  return (
    <div>
      <p>Count: {count}</p>
      <p>Double: {doubleCount}</p>
      <button onClick={() => count.value++}>Increment</button>
    </div>
  );
}
\`\`\`

## Key Principles of Reactive UIs

### 1. Unidirectional Data Flow

Data should flow in one direction, making applications predictable and easier to debug.

### 2. Immutable State Updates

Always create new state objects rather than mutating existing ones:

\`\`\`javascript
// ❌ Mutating state
state.users.push(newUser);

// ✅ Creating new state
setState(prev => ({
  ...prev,
  users: [...prev.users, newUser]
}));
\`\`\`

### 3. Declarative UI Updates

Describe what the UI should look like for any given state, rather than how to update it.

## Conclusion

Building reactive UIs is about creating interfaces that feel alive and responsive. By embracing modern patterns like signals, concurrent features, and optimistic updates, we can create experiences that delight users and stand the test of time.

The future of web development lies in reactive architectures that prioritize user experience while maintaining developer productivity. As tools and frameworks continue to evolve, the principles of reactivity will remain constant.

---

*What are your thoughts on reactive UI patterns? Have you implemented any of these techniques in your projects? Let me know on [Twitter](https://twitter.com/yourusername) or [LinkedIn](https://linkedin.com/in/yourusername).*
    `
  };

  const formatContent = (content: string) => {
    return content
      .split('\n')
      .map(line => {
        if (line.startsWith('# ')) {
          return `<h1 class="text-3xl font-mono font-bold text-foreground mb-6">${line.slice(2)}</h1>`;
        }
        if (line.startsWith('## ')) {
          return `<h2 class="text-2xl font-mono font-bold text-foreground mb-4 mt-8">${line.slice(3)}</h2>`;
        }
        if (line.startsWith('### ')) {
          return `<h3 class="text-xl font-mono font-bold text-primary mb-3 mt-6">${line.slice(4)}</h3>`;
        }
        if (line.startsWith('```')) {
          return line.includes('javascript') 
            ? '<pre class="bg-card border border-border rounded-lg p-4 my-4 overflow-x-auto"><code class="font-mono text-sm text-cyber-cyan">'
            : line === '```' 
            ? '</code></pre>'
            : '';
        }
        if (line.startsWith('*') && line.endsWith('*') && line.slice(1, -1).indexOf('*') === -1) {
          return `<p class="text-muted-foreground italic mb-4">${line.slice(1, -1)}</p>`;
        }
        if (line.startsWith('---')) {
          return '<hr class="border-border my-8" />';
        }
        if (line.trim() === '') {
          return '<br>';
        }
        return `<p class="text-foreground leading-relaxed mb-4">${line}</p>`;
      })
      .join('');
  };

  return (
    <div className="container mx-auto px-4 py-16 max-w-4xl">
      {/* Back Button */}
      <div className="mb-8">
        <Button asChild variant="link" className="cta-link">
          <Link to="/blog" aria-label="Back to blog">
            <ArrowLeft className="w-4 h-4 icon-arrow" aria-hidden="true" />
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

          <div className="flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="font-mono">
                {tag}
              </Badge>
            ))}
          </div>
        </div>

        {/* Share Button */}
        <div className="flex gap-4">
          <Button variant="outline" size="sm" className="font-mono">
            <Share className="w-4 h-4 mr-2" />
            Share Article
          </Button>
        </div>
      </header>

      {/* Article Content */}
      <article className="prose prose-lg max-w-none">
        <div 
          className="blog-content"
          dangerouslySetInnerHTML={{ __html: formatContent(post.content) }}
        />
      </article>

      {/* Article Footer */}
      <footer className="mt-16 pt-8 border-t border-border">
        <div className="text-center space-y-4">
          <p className="text-muted-foreground">
            Enjoyed this article? Share it with your network or reach out to discuss further.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild variant="link" className="cta-link">
              <Link to="/contact" aria-label="Get in touch">Get in touch</Link>
            </Button>
            <Button asChild variant="link" className="cta-link">
              <Link to="/blog" aria-label="Read more articles">Read more articles</Link>
            </Button>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default BlogPost;