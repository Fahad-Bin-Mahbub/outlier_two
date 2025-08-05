"use client";

import { useEffect, useState, useRef } from "react";
import {
	Moon,
	Sun,
	Heart,
	Bookmark,
	Search,
	Clock,
	Share2,
	MessageCircle,
	ArrowRight,
	ChevronDown,
	X,
	Menu,
	ArrowLeft,
	Eye,
	Bookmark as BookmarkIcon,
	Heart as HeartIcon,
	Copy,
	Check,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Head from "next/head";
import Link from "next/link";

interface Post {
	id: number;
	title: string;
	tag: string;
	img: string;
	desc: string;
	readTime: number;
	date: string;
	author: Author;
	content?: string;
}

interface Author {
	name: string;
	avatar: string;
	role: string;
}

interface TagCount {
	tag: string;
	count: number;
}

interface Toast {
	id: string;
	message: string;
	type: "success" | "error" | "info";
}

export default function BlogExport() {
	const [theme, setTheme] = useState<"light" | "dark">("light");
	const [query, setQuery] = useState("");
	const [tagFilter, setTagFilter] = useState("all");
	const [likedPosts, setLikedPosts] = useState<number[]>([]);
	const [bookmarkedPosts, setBookmarkedPosts] = useState<number[]>([]);
	const [isMenuOpen, setIsMenuOpen] = useState(false);
	const [showNewsletter, setShowNewsletter] = useState(false);
	const [email, setEmail] = useState("");
	const [emailSubmitted, setEmailSubmitted] = useState(false);
	const [activeSection, setActiveSection] = useState("home");

	const [selectedPost, setSelectedPost] = useState<Post | null>(null);
	const [showArticleView, setShowArticleView] = useState(false);
	const [showSavedSection, setShowSavedSection] = useState(false);
	const [savedSectionTab, setSavedSectionTab] = useState<
		"liked" | "bookmarked"
	>("liked");
	const [toasts, setToasts] = useState<Toast[]>([]);

	const sectionsRef = useRef<HTMLElement>(null);
	const homeRef = useRef<HTMLElement>(null);
	const aboutRef = useRef<HTMLElement>(null);
	const contactRef = useRef<HTMLElement>(null);
	const savedRef = useRef<HTMLElement>(null);

	const showToast = (
		message: string,
		type: "success" | "error" | "info" = "info"
	) => {
		const id = Math.random().toString(36).substring(2, 9);
		setToasts((prev) => [...prev, { id, message, type }]);

		setTimeout(() => {
			setToasts((prev) => prev.filter((toast) => toast.id !== id));
		}, 3000);
	};

	useEffect(() => {
		document.documentElement.setAttribute("data-theme", theme);

		localStorage.setItem("theme", theme);
	}, [theme]);

	useEffect(() => {
		const savedTheme = localStorage.getItem("theme") as "light" | "dark" | null;
		if (savedTheme) {
			setTheme(savedTheme);
		} else if (
			window.matchMedia &&
			window.matchMedia("(prefers-color-scheme: dark)").matches
		) {
			setTheme("dark");
		}

		const savedLikes = localStorage.getItem("likedPosts");
		if (savedLikes) setLikedPosts(JSON.parse(savedLikes));

		const savedBookmarks = localStorage.getItem("bookmarkedPosts");
		if (savedBookmarks) setBookmarkedPosts(JSON.parse(savedBookmarks));
	}, []);

	useEffect(() => {
		localStorage.setItem("likedPosts", JSON.stringify(likedPosts));
	}, [likedPosts]);

	useEffect(() => {
		localStorage.setItem("bookmarkedPosts", JSON.stringify(bookmarkedPosts));
	}, [bookmarkedPosts]);

	useEffect(() => {
		const observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting) {
						setActiveSection(entry.target.id);
					}
				});
			},
			{ threshold: 0.5 }
		);

		if (homeRef.current) observer.observe(homeRef.current);
		if (aboutRef.current) observer.observe(aboutRef.current);
		if (contactRef.current) observer.observe(contactRef.current);
		if (savedRef.current) observer.observe(savedRef.current);

		return () => {
			if (homeRef.current) observer.unobserve(homeRef.current);
			if (aboutRef.current) observer.unobserve(aboutRef.current);
			if (contactRef.current) observer.unobserve(contactRef.current);
			if (savedRef.current) observer.unobserve(savedRef.current);
		};
	}, []);

	const toggleLike = (id: number, e?: React.MouseEvent) => {
		if (e) e.stopPropagation();

		setLikedPosts((prev) =>
			prev.includes(id) ? prev.filter((pid) => pid !== id) : [...prev, id]
		);

		showToast(
			likedPosts.includes(id)
				? "Removed from liked posts"
				: "Added to liked posts",
			"success"
		);
	};

	const toggleBookmark = (id: number, e?: React.MouseEvent) => {
		if (e) e.stopPropagation();

		setBookmarkedPosts((prev) =>
			prev.includes(id) ? prev.filter((pid) => pid !== id) : [...prev, id]
		);

		showToast(
			bookmarkedPosts.includes(id)
				? "Removed from bookmarks"
				: "Saved to bookmarks",
			"success"
		);
	};

	const handleNewsletterSubmit = (e: React.FormEvent) => {
		e.preventDefault();

		console.log("Subscribing email:", email);
		setEmailSubmitted(true);
		setTimeout(() => {
			setShowNewsletter(false);
			setEmailSubmitted(false);
		}, 3000);
	};

	const handleArticleClick = (post: Post) => {
		setSelectedPost(post);
		setShowArticleView(true);

		document.body.style.overflow = "hidden";
	};

	const closeArticleView = () => {
		setShowArticleView(false);
		setSelectedPost(null);

		document.body.style.overflow = "auto";
	};

	const handleShare = (e?: React.MouseEvent) => {
		if (e) e.stopPropagation();

		if (navigator.share && window.location) {
			navigator
				.share({
					title: selectedPost?.title || "Insightful Blog",
					text: selectedPost?.desc || "Check out this article",
					url: window.location.href,
				})
				.catch(() => {
					showToast("Sharing not supported on this device", "info");
				});
		} else {
			const url = window.location.href;
			navigator.clipboard.writeText(url);
			showToast("Link copied to clipboard!", "success");
		}
	};

	const handleComment = (e?: React.MouseEvent) => {
		if (e) e.stopPropagation();
		showToast("Comments feature coming soon!", "info");
	};

	const author: Author = {
		name: "Alex Morgan",
		avatar:
			"https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=1780&auto=format&fit=crop",
		role: "Content Creator & Tech Enthusiast",
	};
	const posts: Post[] = [
		{
			id: 1,
			title: "Getting Started with React Hooks",
			tag: "tech",
			img: "https://images.unsplash.com/photo-1633356122102-3fe601e05bd2?q=80&w=2070&auto=format&fit=crop",
			desc: "Learn how to use React Hooks to simplify your components and manage state effectively.",
			readTime: 5,
			date: "Apr 22, 2025",
			author,
			content: `
				<h2>Introduction to React Hooks</h2>
				<p>React Hooks were introduced in React 16.8 as a way to use state and other React features without writing a class. They allow you to "hook into" React state and lifecycle features from function components.</p>
				
				<h2>Why Hooks?</h2>
				<p>Before Hooks, components that needed to manage state had to be written as classes. This led to several issues:</p>
				<ul>
					<li>Complex components became difficult to understand</li>
					<li>Stateful logic couldn't be easily reused between components</li>
					<li>Classes can be confusing with 'this' binding</li>
				</ul>
				
				<h2>The useState Hook</h2>
				<p>The useState hook is the most basic hook that allows function components to have local state. Let's see an example:</p>
				
				<pre><code>
import React, { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);
  
  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>
        Click me
      </button>
    </div>
  );
}
				</code></pre>
				
				<h2>The useEffect Hook</h2>
				<p>The useEffect hook lets you perform side effects in function components. It's similar to componentDidMount, componentDidUpdate, and componentWillUnmount combined.</p>
				
				<pre><code>
import React, { useState, useEffect } from 'react';

function Example() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    document.title = \`You clicked \${count} times\`;
    
    // Cleanup function (equivalent to componentWillUnmount)
    return () => {
      document.title = 'React App';
    };
  }, [count]); // Only re-run if count changes
  
  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>
        Click me
      </button>
    </div>
  );
}
				</code></pre>
				
				<h2>Custom Hooks</h2>
				<p>One of the most powerful features of Hooks is the ability to create custom hooks. This allows you to extract component logic into reusable functions.</p>
				
				<pre><code>
function useWindowWidth() {
  const [width, setWidth] = useState(window.innerWidth);
  
  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  
  return width;
}

function ResponsiveComponent() {
  const width = useWindowWidth();
  return (
    <div>
      {width < 768 ? 'Mobile View' : 'Desktop View'}
    </div>
  );
}
				</code></pre>
				
				<h2>Rules of Hooks</h2>
				<p>To ensure Hooks work correctly, follow these two rules:</p>
				<ol>
					<li>Only call Hooks at the top level (not inside loops, conditions, or nested functions)</li>
					<li>Only call Hooks from React function components or custom Hooks</li>
				</ol>
				
				<h2>Conclusion</h2>
				<p>React Hooks provide a more direct API to React concepts you already know: props, state, context, refs, and lifecycle. They make it possible to share stateful logic between components and make your code more readable and maintainable.</p>
				
				<p>Start incorporating Hooks into your new components today, and gradually refactor your older components when it makes sense for your application.</p>
			`,
		},
		{
			id: 2,
			title: "Mindful Living in the Digital Age",
			tag: "lifestyle",
			img: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=2022&auto=format&fit=crop",
			desc: "Practical strategies for maintaining balance and wellness in our technology-driven world.",
			readTime: 7,
			date: "Apr 18, 2025",
			author,
			content: `
				<h2>Finding Balance in a Connected World</h2>
				<p>The digital revolution has transformed every aspect of our lives. From how we work and communicate to how we shop and entertain ourselves, technology has become an omnipresent force. While these advancements bring tremendous benefits, they also present unique challenges to our mental health and wellbeing.</p>
				
				<h2>The Constant Connection Conundrum</h2>
				<p>Research shows that the average American checks their phone 96 times a day—once every 10 minutes. This constant connectivity can lead to:</p>
				<ul>
					<li>Increased stress and anxiety</li>
					<li>Poor sleep quality</li>
					<li>Reduced attention span</li>
					<li>Diminished face-to-face social interactions</li>
				</ul>
				
				<h2>Digital Minimalism: A Framework for Technology Use</h2>
				<p>Computer science professor Cal Newport suggests adopting a philosophy of "digital minimalism"—using technology intentionally and purposefully rather than letting it control our attention and time.</p>
				
				<p>Here are some principles of digital minimalism:</p>
				<ol>
					<li>Determine what digital tools add the most value to your life</li>
					<li>Eliminate or strictly limit those that don't serve your values</li>
					<li>Establish rules and boundaries for when and how you use technology</li>
				</ol>
				
				<h2>Practical Strategies for Digital Wellbeing</h2>
				
				<h3>1. Create Tech-Free Zones and Times</h3>
				<p>Designate certain spaces in your home as tech-free (like bedrooms and dining areas) and establish specific times when screens are off-limits (like the first hour after waking and the last hour before sleep).</p>
				
				<h3>2. Practice Digital Sabbaths</h3>
				<p>Take regular breaks from technology—start with a few hours each weekend and gradually build to a full day. Use this time to engage in analog activities like reading physical books, spending time in nature, or connecting with loved ones.</p>
				
				<h3>3. Disable Non-Essential Notifications</h3>
				<p>Attention is your most valuable resource. Turn off notifications for all but the most important apps to reduce distractions and reclaim your focus.</p>
				
				<h3>4. Practice Mindful Technology Use</h3>
				<p>Before picking up your phone or opening a new browser tab, pause and ask: "Why am I doing this? Is this aligned with my values and intentions?" This simple practice can dramatically reduce mindless scrolling.</p>
				
				<h3>5. Curate Your Digital Inputs</h3>
				<p>Regularly audit and edit your social media feeds, news sources, and subscriptions. Follow accounts that inspire, educate, or bring you joy, and unfollow those that trigger negative emotions or comparison.</p>
				
				<h2>Mindfulness Practices for the Digital Age</h2>
				<p>Incorporating mindfulness into your daily routine can help counteract the fragmentation of attention that digital life often brings:</p>
				
				<h3>Mindful Breathing</h3>
				<p>Take short breaks throughout the day to focus on your breath for 2-3 minutes. This resets your nervous system and improves concentration.</p>
				
				<h3>Body Scan Meditation</h3>
				<p>Practice bringing awareness to each part of your body, from toes to head. This grounds you in physical sensation rather than digital stimulation.</p>
				
				<h3>Single-Tasking</h3>
				<p>Counter the multi-tasking tendency encouraged by technology by deliberately focusing on one activity at a time, giving it your full attention.</p>
				
				<h2>Conclusion: Technology as a Tool, Not a Master</h2>
				<p>The goal isn't to reject technology but to develop a healthier relationship with it. By using digital tools mindfully and intentionally, we can enjoy their benefits while preserving our mental wellbeing and deepening our connections with ourselves and others.</p>
				
				<p>Remember: Technology should enhance your life, not consume it. The most meaningful experiences often happen when we look up from our screens and engage with the world around us.</p>
			`,
		},
		{
			id: 3,
			title: "Modern UI Design Principles",
			tag: "design",
			img: "https://images.unsplash.com/photo-1561070791-2526d30994b5?q=80&w=2000&auto=format&fit=crop",
			desc: "Exploring the latest trends and best practices in creating intuitive user interfaces.",
			readTime: 6,
			date: "Apr 14, 2025",
			author,
			content: `
				<h2>The Evolution of UI Design</h2>
				<p>User interface design has evolved dramatically over the past decade. From skeuomorphic designs that mimicked real-world objects to flat design and now to a more balanced approach often called "flat 2.0" or "material design," UI trends continue to evolve with user expectations and technological capabilities.</p>
				
				<h2>Key Principles of Modern UI Design</h2>
				
				<h3>1. Clarity</h3>
				<p>A clear interface helps users complete tasks without confusion. This means:</p>
				<ul>
					<li>Using straightforward language</li>
					<li>Creating intuitive navigation paths</li>
					<li>Eliminating unnecessary elements</li>
					<li>Providing clear feedback for user actions</li>
				</ul>
				
				<h3>2. Consistency</h3>
				<p>Consistency creates familiarity and reduces cognitive load. Apply consistent:</p>
				<ul>
					<li>Visual elements (colors, typography, icons)</li>
					<li>Interaction patterns</li>
					<li>Language and terminology</li>
					<li>UI components across the application</li>
				</ul>
				
				<h3>3. Hierarchy</h3>
				<p>Visual hierarchy guides users' attention to the most important elements first through:</p>
				<ul>
					<li>Size variation (larger elements appear more important)</li>
					<li>Color and contrast (brighter or higher contrast elements stand out)</li>
					<li>Spacing (strategic use of white space emphasizes elements)</li>
					<li>Typography hierarchy (headings, subheadings, body text)</li>
				</ul>
				
				<h3>4. Context-Awareness</h3>
				<p>Modern UIs adapt to users' contexts:</p>
				<ul>
					<li>Device adaptability (responsive design)</li>
					<li>Time-awareness (dark mode at night)</li>
					<li>Location-specific content</li>
					<li>User-specific customizations</li>
				</ul>
				
				<h3>5. Feedback</h3>
				<p>Immediate feedback keeps users informed about:</p>
				<ul>
					<li>System status (loading indicators)</li>
					<li>Action confirmations (success/error messages)</li>
					<li>Interactive elements (hover states, animations)</li>
					<li>Process completion (celebratory animations)</li>
				</ul>
				
				<h2>Current UI Design Trends</h2>
				
				<h3>Microinteractions</h3>
				<p>Small, purposeful animations that provide feedback, enhance the sense of direct manipulation, and add personality to interfaces. Examples include button state changes, form field validations, and notification animations.</p>
				
				<h3>Dark Mode</h3>
				<p>Dark themes reduce eye strain in low-light conditions, save battery on OLED screens, and can create striking visual aesthetics. Implementing both light and dark options with thoughtful color contrasts is becoming standard practice.</p>
				
				<h3>Glassmorphism</h3>
				<p>This design trend features frosted glass-like elements with background blur effects, creating depth while maintaining a clean aesthetic. Apple's iOS and Microsoft's Fluent Design System have popularized this approach.</p>
				
				<h3>3D Elements</h3>
				<p>Advancements in browser capabilities have made 3D elements more feasible for web interfaces. From subtle depth effects to fully manipulable 3D objects, this trend adds richness to user experiences.</p>
				
				<h3>Voice User Interfaces (VUI)</h3>
				<p>As voice assistants become mainstream, designing for voice interactions is increasingly important. This includes creating visual companions to voice experiences and ensuring text interfaces can be easily navigated through voice commands.</p>
				
				<h2>Accessibility: Not a Trend, But a Necessity</h2>
				<p>Modern UI design must be accessible to all users, including those with disabilities. Key considerations include:</p>
				<ul>
					<li>Sufficient color contrast (WCAG 2.1 guidelines recommend 4.5:1 for normal text)</li>
					<li>Keyboard navigability for users who can't use a mouse</li>
					<li>Screen reader compatibility with proper semantic HTML</li>
					<li>Alternative text for images</li>
					<li>Focus indicators for interactive elements</li>
					<li>Captions and transcripts for multimedia content</li>
				</ul>
				
				<h2>Conclusion: Human-Centered Design</h2>
				<p>While trends come and go, the core principle of modern UI design remains constant: putting humans at the center of the design process. The most effective interfaces are those that feel invisible, allowing users to accomplish their goals without thinking about the interface itself.</p>
				
				<p>As technology continues to advance with AI, AR/VR, and whatever comes next, successful UI designers will be those who understand not just the latest visual styles, but the fundamental principles of human perception, cognition, and behavior.</p>
			`,
		},
		{
			id: 4,
			title: "Advanced Next.js Routing Techniques",
			tag: "tech",
			img: "https://images.unsplash.com/photo-1618761714954-0b8cd0026356?q=80&w=2070&auto=format&fit=crop",
			desc: "Mastering dynamic routes, middleware, and nested layouts in Next.js applications.",
			readTime: 8,
			date: "Apr 10, 2025",
			author,
			content: `
				<h2>The Evolution of Next.js Routing</h2>
				<p>Next.js has transformed how developers approach routing in React applications. From its earliest versions with a simple pages directory to the App Router introduced in Next.js 13, the framework continues to refine its approach to creating intuitive, performant navigation systems.</p>
				
				<h2>Understanding the App Router</h2>
				<p>The App Router, based on React Server Components, represents a paradigm shift in how Next.js applications handle routing. Key features include:</p>
				
				<ul>
					<li>Server Components as the default</li>
					<li>Nested layouts with minimal re-rendering</li>
					<li>Simplified data fetching with async/await</li>
					<li>Streaming and partial rendering</li>
					<li>Built-in support for loading and error states</li>
				</ul>
				
				<h2>File-Based Routing Structure</h2>
				<p>The App Router uses a convention-based file system for defining routes:</p>
				
				<pre><code>
app/
├── layout.js      # Root layout (applied to all routes)
├── page.js        # Home route (/)
├── about/
│   └── page.js    # About route (/about)
├── blog/
│   ├── layout.js  # Layout for blog section
│   ├── page.js    # Blog index (/blog)
│   └── [slug]/    # Dynamic route
│       └── page.js # Individual blog post (/blog/post-1)
				</code></pre>
				
				<h2>Dynamic Routes</h2>
				<p>Dynamic routes allow you to create pages that can capture parameters from the URL. These parameters are then passed as props to your page component.</p>
				
				<h3>Basic Dynamic Routes</h3>
				<pre><code>
// app/products/[id]/page.js
export default function BlogExport({ params }) {
  // params.id is extracted from the URL
  return <div>Product: {params.id}</div>;
}
				</code></pre>
				
				<h3>Catch-All Routes</h3>
				<pre><code>
// app/docs/[...slug]/page.js
export default function BlogExport({ params }) {
  // For URL /docs/features/routing/dynamic-routes
  // params.slug is ['features', 'routing', 'dynamic-routes']
  return <div>Documentation: {params.slug.join('/')}</div>;
}
				</code></pre>
				
				<h3>Optional Catch-All Routes</h3>
				<pre><code>
// app/[[...slug]]/page.js
export default function BlogExport({ params }) {
  // Matches /, /about, /about/team, etc.
  const slug = params?.slug || [];
  return <div>Path: {slug.join('/')}</div>;
}
				</code></pre>
				
				<h2>Parallel Routes</h2>
				<p>Parallel routes allow you to simultaneously show multiple pages in the same layout. This is useful for split-views, dashboards, or modals.</p>
				
				<pre><code>
// app/dashboard/layout.js
export default function BlogExport({ children, team, analytics }) {
  return (
    <div>
      <div className="main">{children}</div>
      <div className="team-sidebar">{team}</div>
      <div className="analytics-panel">{analytics}</div>
    </div>
  );
}

// File structure:
// app/dashboard/page.js (default)
// app/dashboard/@team/page.js
// app/dashboard/@analytics/page.js
				</code></pre>
				
				<h2>Intercepting Routes</h2>
				<p>Intercepting routes allow you to "intercept" a route and show different content while maintaining the context of the current page. This is perfect for modals and slides.</p>
				
				<pre><code>
// app/feed/(..)photo/[id]/page.js
// This intercepts /photo/[id] when navigating from /feed
				</code></pre>
				
				<h2>Route Groups</h2>
				<p>Route groups let you organize your routes without affecting the URL structure, using parentheses in directory names.</p>
				
				<pre><code>
app/
├── (marketing)/ # Group - doesn't affect URL
│   ├── about/    # /about
│   └── team/     # /team
├── (shop)/      # Another group
│   ├── products/ # /products
│   └── cart/     # /cart
				</code></pre>
				
				<h2>Middleware for Advanced Routing Control</h2>
				<p>Middleware runs before a request is completed, allowing you to modify the response based on the incoming request.</p>
				
				<pre><code>
// middleware.js
import { NextResponse } from 'next/server';

export function middleware(request) {
  // Check if user is authenticated
  const isAuthenticated = checkAuth(request);
  
  // Redirect unauthenticated users trying to access protected routes
  if (!isAuthenticated && request.nextUrl.pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
  
  // Add headers
  const response = NextResponse.next();
  response.headers.set('x-custom-header', 'my-value');
  return response;
}

export const config = {
  matcher: ['/dashboard/:path*', '/api/:path*'],
};
				</code></pre>
				
				<h2>Server Actions for Form Handling</h2>
				<p>Server Actions, a new feature in Next.js 14, allow you to define server functions that can be called directly from your components, simplifying form handling and data mutations.</p>
				
				<pre><code>
// app/actions.js
'use server';

export async function createPost(formData) {
  const title = formData.get('title');
  const content = formData.get('content');
  
  // Server-side validation
  if (!title || title.length < 3) {
    return { error: 'Title must be at least 3 characters' };
  }
  
  // Create post in database
  await db.posts.create({ title, content });
  
  // Revalidate the posts page
  revalidatePath('/posts');
  
  return { success: true };
}

// In your component:
// app/posts/new/page.js
import { createPost } from '@/app/actions';

export default function BlogExport() {
  return (
    <form action={createPost}>
      <input name="title" placeholder="Title" />
      <textarea name="content" placeholder="Content" />
      <button type="submit">Create Post</button>
    </form>
  );
}
				</code></pre>
				
				<h2>SEO and Metadata</h2>
				<p>Next.js makes managing SEO metadata simple with the built-in Metadata API:</p>
				
				<pre><code>
// app/blog/[slug]/page.js
export async function generateMetadata({ params }) {
  const post = await getPost(params.slug);
  
  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      images: [{ url: post.image }],
    },
  };
}
				</code></pre>
				
				<h2>Advanced Navigation and Prefetching</h2>
				<p>The next/navigation module provides hooks and components for client-side navigation with built-in prefetching optimization:</p>
				
				<pre><code>
'use client';

import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import Link from 'next/link';

export default function BlogExport() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  
  function handleSearch(term) {
    const params = new URLSearchParams(searchParams);
    params.set('q', term);
    router.push(\`\${pathname}?\${params.toString()}\`);
  }
  
  return (
    <nav>
      <Link href="/dashboard" prefetch={false}>Dashboard</Link>
      <button onClick={() => router.push('/settings')}>Settings</button>
      <button onClick={() => router.back()}>Back</button>
      <input 
        type="text" 
        onChange={(e) => handleSearch(e.target.value)} 
        placeholder="Search" 
      />
    </nav>
  );
}
				</code></pre>
				
				<h2>Conclusion: The Future of Routing in Next.js</h2>
				<p>Next.js continues to innovate in making routing both powerful and developer-friendly. By understanding these advanced routing techniques, you can create more dynamic, responsive, and intuitive user experiences while maintaining performance and SEO benefits.</p>
				
				<p>As you implement these patterns, remember that good routing is ultimately about creating intuitive navigation paths for users while maintaining code organization for developers. The best routing systems feel invisible to end users while providing a maintainable structure for your application as it grows.</p>
			`,
		},
		{
			id: 5,
			title: "Essentials of Minimalist Living",
			tag: "lifestyle",
			img: "https://images.unsplash.com/photo-1449247709967-d4461a6a6103?q=80&w=2071&auto=format&fit=crop",
			desc: "How to declutter your space and mind for a more focused and intentional lifestyle.",
			readTime: 4,
			date: "Apr 5, 2025",
			author,
			content: `
				<h2>The Philosophy of Less</h2>
				<p>Minimalism isn't just an aesthetic—it's a mindful approach to living that focuses on intentionality and the removal of excess. At its core, minimalism asks a simple question: does this item, commitment, or relationship add value to my life?</p>
				
				<p>The minimalist lifestyle has roots in various cultural traditions, from Zen Buddhism to Scandinavian design principles, all emphasizing simplicity, functionality, and mindfulness. Today's minimalist movement has evolved as a response to consumerism and the psychological burden of continuous accumulation.</p>
				
				<h2>The Benefits of Minimalist Living</h2>
				
				<h3>Mental Clarity</h3>
				<p>Research shows that physical clutter competes for our attention, leading to decreased focus, increased stress, and reduced working memory. By simplifying our environments, we create space for clearer thinking and reduced anxiety.</p>
				
				<h3>Financial Freedom</h3>
				<p>When we shift from valuing possessions to valuing experiences and relationships, we naturally spend less on unnecessary items. This creates more financial flexibility and reduces the pressure to work solely for consumption.</p>
				
				<h3>Environmental Impact</h3>
				<p>Consuming less means demanding less from our planet's resources. Minimalists typically have smaller carbon footprints through reduced consumption, less waste generation, and more conscious purchasing decisions.</p>
				
				<h3>Time Abundance</h3>
				<p>Fewer possessions mean less time spent cleaning, organizing, maintaining, and eventually disposing of items. This reclaimed time can be redirected toward meaningful activities and relationships.</p>
				
				<h2>Beginning Your Minimalist Journey</h2>
				
				<h3>Start With Why</h3>
				<p>Before decluttering a single drawer, clarify your motivation. Are you seeking reduced stress? More financial freedom? Environmental consciousness? A clearer living space? Your "why" will sustain you through challenging decisions.</p>
				
				<h3>The KonMari Method</h3>
				<p>Marie Kondo's approach centers on keeping only items that "spark joy." Her category-by-category approach (rather than room-by-room) helps create more dramatic transformation:</p>
				<ol>
					<li>Clothing</li>
					<li>Books</li>
					<li>Papers</li>
					<li>Komono (miscellaneous items)</li>
					<li>Sentimental items</li>
				</ol>
				
				<h3>The Four-Box Method</h3>
				<p>For those who prefer a more methodical approach, designate four containers:</p>
				<ul>
					<li>Keep: Items you use regularly and that add value</li>
					<li>Donate/Sell: Items in good condition that could benefit others</li>
					<li>Trash/Recycle: Items that cannot be reused</li>
					<li>Storage: Seasonal items or those with genuine sentimental value</li>
				</ul>
				
				<h3>The 90/90 Rule</h3>
				<p>For each item, ask two questions:</p>
				<ol>
					<li>Have I used this in the past 90 days?</li>
					<li>Will I use this in the next 90 days?</li>
				</ol>
				<p>If the answer to both is "no," the item likely isn't essential to your life.</p>
				
				<h2>Beyond Physical Possessions</h2>
				
				<h3>Digital Minimalism</h3>
				<p>Apply minimalist principles to your digital life by:</p>
				<ul>
					<li>Unsubscribing from newsletters you don't read</li>
					<li>Removing unused apps from your devices</li>
					<li>Organizing digital files and deleting duplicates</li>
					<li>Setting boundaries for technology use</li>
					<li>Decluttering social media accounts you follow</li>
				</ul>
				
				<h3>Time Minimalism</h3>
				<p>Just as we accumulate physical possessions, we accumulate commitments. Practice saying "no" to activities that don't align with your values or bring you joy. Create margin in your schedule for rest and spontaneity.</p>
				
				<h3>Relationship Minimalism</h3>
				<p>While this doesn't mean cutting people out of your life unnecessarily, it does mean being intentional about your social energy. Prioritize relationships that are mutual, supportive, and aligned with your values.</p>
				
				<h2>Minimalist Aesthetics</h2>
				
				<h3>Color Palette</h3>
				<p>Minimalist spaces often feature neutral colors (whites, grays, beiges) with occasional strategic accent colors. This creates a sense of calm and cohesion.</p>
				
				<h3>Quality Over Quantity</h3>
				<p>Rather than having many inexpensive items, minimalists tend to invest in fewer, higher-quality pieces that will last longer and bring more satisfaction.</p>
				
				<h3>Negative Space</h3>
				<p>In minimalist design, empty space isn't wasted space—it's an intentional element that gives the eye places to rest and creates visual calm.</p>
				
				<h2>Maintaining Minimalism</h2>
				
				<h3>One In, One Out</h3>
				<p>For every new item that enters your home, remove one item of similar type or purpose. This prevents gradual re-accumulation.</p>
				
				<h3>Regular Reassessment</h3>
				<p>Schedule quarterly or bi-annual reviews of your possessions to ensure everything continues to serve a purpose or bring joy.</p>
				
				<h3>Mindful Acquisition</h3>
				<p>Before purchasing something new, implement a waiting period (24 hours for small items, 30 days for larger ones) to determine if it's truly necessary or just a momentary desire.</p>
				
				<h2>Conclusion: Minimalism as a Journey</h2>
				<p>Remember that minimalism isn't about achieving a perfect aesthetic or living with a specific number of possessions. It's a continuous journey of aligning your external environment with your internal values.</p>
				
				<p>Start small, celebrate progress, and be gentle with yourself. The goal isn't perfection but a more intentional life with less distraction and more room for what truly matters to you.</p>
			`,
		},
		{
			id: 6,
			title: "Color Psychology in Web Design",
			tag: "design",
			img: "https://images.unsplash.com/photo-1452421822248-d4c2b47f0c81?q=80&w=2074&auto=format&fit=crop",
			desc: "Understanding how color choices influence user perception and behavior on websites.",
			readTime: 6,
			date: "Apr 1, 2025",
			author,
			content: `
				<h2>The Science Behind Color Perception</h2>
				<p>Color perception is both a physiological and psychological process. Light enters our eyes, activates photoreceptors, and signals our brain, which interprets these signals influenced by personal experience, cultural context, and evolutionary history.</p>
				
				<p>We perceive colors differently based on adjacent colors (simultaneous contrast), lighting conditions, and even our emotional states. This complex interplay makes color one of the most powerful tools in a designer's toolkit.</p>
				
				<h2>Cultural Variations in Color Meaning</h2>
				<p>Before diving into specific colors, it's important to acknowledge that color meanings vary significantly across cultures:</p>
				<ul>
					<li><strong>White</strong>: Symbolizes purity and marriage in Western cultures but mourning and funerals in many Eastern cultures</li>
					<li><strong>Red</strong>: Represents danger or passion in Western contexts but good fortune and joy in Chinese culture</li>
					<li><strong>Purple</strong>: Associated with royalty in Western cultures but with mourning in some Latin American countries</li>
				</ul>
				<p>When designing for global audiences, research cultural context and consider testing with international user groups.</p>
				
				<h2>Color Psychology: Emotional Responses</h2>
				
				<h3>Red</h3>
				<p><strong>Psychological effects</strong>: Creates urgency, increases heart rate, stimulates appetite</p>
				<p><strong>Common applications</strong>: Sales, clearance sections, fast food, notifications</p>
				<p><strong>Examples</strong>: Netflix, YouTube, CNN</p>
				<p><strong>Design considerations</strong>: Use sparingly for emphasis; can overwhelm when overused</p>
				
				<h3>Blue</h3>
				<p><strong>Psychological effects</strong>: Evokes trust, security, serenity; reduces appetite</p>
				<p><strong>Common applications</strong>: Banking, technology, healthcare, corporate sites</p>
				<p><strong>Examples</strong>: Facebook, Twitter, PayPal, IBM</p>
				<p><strong>Design considerations</strong>: Versatile but can feel cold without warmer accent colors</p>
				
				<h3>Green</h3>
				<p><strong>Psychological effects</strong>: Suggests growth, health, prosperity, and environmental consciousness</p>
				<p><strong>Common applications</strong>: Health products, environmental causes, financial services</p>
				<p><strong>Examples</strong>: Whole Foods, Spotify, TripAdvisor</p>
				<p><strong>Design considerations</strong>: Different shades convey different meanings (forest green = stability, lime = energy)</p>
				
				<h3>Yellow</h3>
				<p><strong>Psychological effects</strong>: Creates optimism, clarity, warmth; can cause eye fatigue when overused</p>
				<p><strong>Common applications</strong>: Attention-grabbing elements, cheerful brands</p>
				<p><strong>Examples</strong>: McDonald's, Best Buy, IKEA</p>
				<p><strong>Design considerations</strong>: Difficult for readability in text; best as an accent color</p>
				
				<h3>Orange</h3>
				<p><strong>Psychological effects</strong>: Conveys enthusiasm, creativity, and affordability</p>
				<p><strong>Common applications</strong>: Call-to-action buttons, creative industries</p>
				<p><strong>Examples</strong>: Nickelodeon, Fanta, Home Depot</p>
				<p><strong>Design considerations</strong>: High visibility makes it excellent for important buttons and notifications</p>
				
				<h3>Purple</h3>
				<p><strong>Psychological effects</strong>: Associated with luxury, creativity, wisdom, and spirituality</p>
				<p><strong>Common applications</strong>: Beauty products, anti-aging, spiritual services</p>
				<p><strong>Examples</strong>: Yahoo, Twitch, Hallmark</p>
				<p><strong>Design considerations</strong>: Less common in nature, can feel artificial; balance with neutrals</p>
				
				<h3>Black</h3>
				<p><strong>Psychological effects</strong>: Conveys sophistication, luxury, authority; can feel heavy</p>
				<p><strong>Common applications</strong>: Luxury brands, fashion, sophisticated products</p>
				<p><strong>Examples</strong>: Chanel, Nike, Apple (product pages)</p>
				<p><strong>Design considerations</strong>: Excellent contrast with light colors; creates dramatic effects</p>
				
				<h3>White</h3>
				<p><strong>Psychological effects</strong>: Suggests simplicity, cleanliness, and neutrality</p>
				<p><strong>Common applications</strong>: Minimal designs, healthcare, tech products</p>
				<p><strong>Examples</strong>: Apple, Google, Airbnb</p>
				<p><strong>Design considerations</strong>: Creates sense of space but can feel clinical without warmth</p>
				
				<h2>Strategic Color Applications in Web Design</h2>
				
				<h3>Color for Branding</h3>
				<p>Color increases brand recognition by up to 80%. When selecting brand colors, consider:</p>
				<ul>
					<li>Industry expectations and differentiation from competitors</li>
					<li>Target audience demographics and preferences</li>
					<li>Brand personality and values</li>
					<li>Long-term viability (trendy colors may date quickly)</li>
				</ul>
				
				<h3>Color for User Experience</h3>
				<p>Strategic use of color improves usability through:</p>
				<ul>
					<li><strong>Information hierarchy</strong>: Primary actions in standout colors, secondary in less prominent hues</li>
					<li><strong>Cognitive load reduction</strong>: Color-coding related elements for easier processing</li>
					<li><strong>State changes</strong>: Consistent color signaling for hover, active, disabled states</li>
					<li><strong>Error prevention</strong>: Using red for destructive actions, requiring additional confirmation</li>
				</ul>
				
				<h3>Color for Conversion Optimization</h3>
				<p>A/B testing often reveals that button color affects conversion rates by creating:</p>
				<ul>
					<li>Contrast with surrounding elements (visibility)</li>
					<li>Urgency or excitement (emotional response)</li>
					<li>Alignment with user expectations (familiarity)</li>
				</ul>
				<p>However, no universal "best" color exists—optimal choices depend on specific context, audience, and overall design.</p>
				
				<h2>Accessibility Considerations in Color Selection</h2>
				<p>Color accessibility ensures all users, including those with visual impairments, can interact with your site:</p>
				<ul>
					<li>Maintain minimum contrast ratios (WCAG 2.1 requires 4.5:1 for normal text)</li>
					<li>Never rely solely on color to convey important information (add icons, patterns, or text)</li>
					<li>Consider how your site appears to users with various forms of color blindness</li>
					<li>Test designs with tools like Stark, Contrast, or WebAIM's color contrast checker</li>
				</ul>
				
				<h2>Color Harmony: Creating Effective Palettes</h2>
				
				<h3>Monochromatic</h3>
				<p>Different shades, tones, and tints of a single hue. Creates cohesive, elegant looks but may lack visual interest.</p>
				
				<h3>Analogous</h3>
				<p>Colors adjacent on the color wheel. Harmonious and comfortable to view, ideal for creating unified designs.</p>
				
				<h3>Complementary</h3>
				<p>Colors opposite on the color wheel. Creates maximum contrast and visual tension; use with one dominant color.</p>
				
				<h3>Split-Complementary</h3>
				<p>A base color plus two colors adjacent to its complement. High contrast with less tension than complementary.</p>
				
				<h3>Triadic</h3>
				<p>Three colors equally spaced on the color wheel. Vibrant even when using paler versions of hues.</p>
				
				<h3>60-30-10 Rule</h3>
				<p>A practical application approach:</p>
				<ul>
					<li>60% dominant color (backgrounds, large text areas)</li>
					<li>30% secondary color (supporting elements)</li>
					<li>10% accent color (calls to action, highlights)</li>
				</ul>
				
				<h2>Trending Color Approaches</h2>
				
				<h3>Dark Mode</h3>
				<p>Dark backgrounds with light text reduce eye strain in low-light conditions and create sophisticated aesthetics. When implementing:</p>
				<ul>
					<li>Avoid pure black (#000000); use soft blacks (#121212) to reduce eye strain</li>
					<li>Increase contrast for text and important elements</li>
					<li>Reduce saturation of bright colors that may cause visual vibration</li>
				</ul>
				
				<h3>Gradients</h3>
				<p>After years of flat design, gradients have returned with subtler, more sophisticated implementations:</p>
				<ul>
					<li>Subtle gradients add dimension without skeuomorphism</li>
					<li>Duotone gradients create distinctive visual identities</li>
					<li>Mesh gradients with multiple color points create organic feeling</li>
				</ul>
				
				<h3>Neutral Palettes with Bold Accents</h3>
				<p>Using primarily neutral colors with strategic bright accents maintains simplicity while adding personality:</p>
				<ul>
					<li>Creates focus on important elements</li>
					<li>Reduces visual fatigue during extended use</li>
					<li>Allows content to shine without competing elements</li>
				</ul>
				
				<h2>Conclusion: Color as Strategic Design Decision</h2>
				<p>Color choices should never be arbitrary or based solely on personal preference. Effective color strategy balances:</p>
				<ul>
					<li>Brand identity and messaging goals</li>
					<li>User emotional responses and cultural contexts</li>
					<li>Functional requirements and accessibility needs</li>
					<li>Technical implementation considerations</li>
				</ul>
				<p>By approaching color as a strategic tool rather than mere decoration, designers can create interfaces that not only look beautiful but also support users' needs, reinforce brand identity, and drive business objectives.</p>
			`,
		},
	];

	const filteredPosts = posts.filter((post) => {
		const matchesTag = tagFilter === "all" || post.tag === tagFilter;
		const matchesQuery = post.title.toLowerCase().includes(query.toLowerCase());
		return matchesTag && matchesQuery;
	});

	const likedPostsList = posts.filter((post) => likedPosts.includes(post.id));
	const bookmarkedPostsList = posts.filter((post) =>
		bookmarkedPosts.includes(post.id)
	);
	const savedPostsList =
		savedSectionTab === "liked" ? likedPostsList : bookmarkedPostsList;

	const popularTags: TagCount[] = [
		{ tag: "tech", count: posts.filter((post) => post.tag === "tech").length },
		{
			tag: "lifestyle",
			count: posts.filter((post) => post.tag === "lifestyle").length,
		},
		{
			tag: "design",
			count: posts.filter((post) => post.tag === "design").length,
		},
	];

	const getRelatedPosts = (currentPostId: number, tag: string) => {
		return posts
			.filter((post) => post.tag === tag && post.id !== currentPostId)
			.slice(0, 2);
	};

	return (
		<div
			className={`scroll-smooth min-h-screen transition-colors duration-500 ease-in-out ${
				theme === "light"
					? "bg-white text-slate-800"
					: "bg-slate-900 text-slate-100"
			}`}
		>
			<Head>
				<title>Insightful - A Personal Blog</title>
				<meta
					name="description"
					content="Explore insights on tech, design, and mindful living."
				/>
				<meta name="viewport" content="width=device-width, initial-scale=1" />
				<meta property="og:title" content="Insightful - A Personal Blog" />
				<meta
					property="og:description"
					content="Explore insights on tech, design, and mindful living."
				/>
				<meta property="og:type" content="website" />
				<link rel="icon" href="/favicon.ico" />
			</Head>

			<div className="fixed bottom-4 right-4 z-50 space-y-2">
				<AnimatePresence>
					{toasts.map((toast) => (
						<motion.div
							key={toast.id}
							initial={{ opacity: 0, y: 20, scale: 0.95 }}
							animate={{ opacity: 1, y: 0, scale: 1 }}
							exit={{ opacity: 0, y: 10, scale: 0.9 }}
							className={`px-4 py-3 rounded-lg shadow-lg flex items-center gap-2 max-w-xs ${
								toast.type === "success"
									? "bg-emerald-600 text-white"
									: toast.type === "error"
									? "bg-red-600 text-white"
									: "bg-indigo-600 text-white"
							}`}
						>
							{toast.type === "success" ? (
								<Check size={16} />
							) : toast.type === "error" ? (
								<X size={16} />
							) : (
								<svg
									xmlns="http://www.w3.org/2000/svg"
									width="16"
									height="16"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									strokeWidth="2"
									strokeLinecap="round"
									strokeLinejoin="round"
								>
									<circle cx="12" cy="12" r="10"></circle>
									<line x1="12" y1="8" x2="12" y2="12"></line>
									<line x1="12" y1="16" x2="12.01" y2="16"></line>
								</svg>
							)}
							<span>{toast.message}</span>
						</motion.div>
					))}
				</AnimatePresence>
			</div>

			<AnimatePresence>
				{showNewsletter && (
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
					>
						<motion.div
							initial={{ scale: 0.9, y: 20 }}
							animate={{ scale: 1, y: 0 }}
							exit={{ scale: 0.9, y: 20 }}
							className={`relative w-full max-w-md p-6 rounded-lg shadow-xl ${
								theme === "light" ? "bg-white" : "bg-slate-800"
							}`}
						>
							<button
								onClick={() => setShowNewsletter(false)}
								className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 cursor-pointer"
							>
								<X size={20} />
							</button>
							<h3 className="text-xl font-bold mb-2">Join Our Newsletter</h3>
							{emailSubmitted ? (
								<div className="text-center py-6">
									<div className="mb-4 text-emerald-500">
										<svg
											className="w-16 h-16 mx-auto"
											fill="none"
											viewBox="0 0 24 24"
											stroke="currentColor"
										>
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												strokeWidth={2}
												d="M5 13l4 4L19 7"
											/>
										</svg>
									</div>
									<p className="text-lg font-medium">
										Thank you for subscribing!
									</p>
									<p className="mt-2 text-sm opacity-75">
										You'll receive our next newsletter soon.
									</p>
								</div>
							) : (
								<>
									<p className="mb-4 opacity-75">
										Stay updated with our latest articles and news.
									</p>
									<form onSubmit={handleNewsletterSubmit} className="space-y-3">
										<input
											type="email"
											value={email}
											onChange={(e) => setEmail(e.target.value)}
											placeholder="Your email address"
											required
											className={`w-full px-4 py-2 rounded border focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
												theme === "light"
													? "bg-white border-gray-300"
													: "bg-slate-700 border-slate-600"
											}`}
										/>
										<button
											type="submit"
											className="w-full py-2 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded transition duration-200 cursor-pointer"
										>
											Subscribe
										</button>
									</form>
								</>
							)}
						</motion.div>
					</motion.div>
				)}
			</AnimatePresence>

			<AnimatePresence>
				{showArticleView && selectedPost && (
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						className="fixed inset-0 bg-black bg-opacity-70 z-50 overflow-y-auto"
					>
						<div className="min-h-screen flex items-center justify-center p-4">
							<motion.div
								initial={{ scale: 0.95, y: 20 }}
								animate={{ scale: 1, y: 0 }}
								exit={{ scale: 0.95, y: 20 }}
								className={`w-full max-w-4xl rounded-xl shadow-2xl overflow-hidden ${
									theme === "light" ? "bg-white" : "bg-slate-900"
								}`}
							>
								<div className="relative h-72 md:h-96 overflow-hidden">
									<img
										src={selectedPost.img}
										alt={selectedPost.title}
										className="w-full h-full object-cover"
									/>
									<div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />

									<div className="absolute top-4 left-4 flex gap-2">
										<button
											onClick={closeArticleView}
											className={`p-2 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white transition-colors cursor-pointer`}
										>
											<ArrowLeft size={20} />
										</button>

										<button
											onClick={(e) => handleShare(e)}
											className={`p-2 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white transition-colors cursor-pointer`}
										>
											<Share2 size={20} />
										</button>
									</div>

									<div className="absolute bottom-0 left-0 w-full p-6">
										<div className="space-y-1">
											<div className="flex items-center gap-2">
												<span
													className={`inline-block px-3 py-1 text-xs font-medium rounded-full ${
														selectedPost.tag === "tech"
															? "bg-blue-600 text-white"
															: selectedPost.tag === "lifestyle"
															? "bg-emerald-600 text-white"
															: "bg-purple-600 text-white"
													}`}
												>
													{selectedPost.tag.charAt(0).toUpperCase() +
														selectedPost.tag.slice(1)}
												</span>
												<span className="text-white text-sm">
													{selectedPost.date}
												</span>
											</div>
											<h1 className="text-2xl md:text-4xl font-bold text-white leading-tight">
												{selectedPost.title}
											</h1>
										</div>
									</div>
								</div>

								<div className="p-6 md:p-8">
									<div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-700 pb-6 mb-6">
										<div className="flex items-center gap-4">
											<img
												src={selectedPost.author.avatar}
												alt={selectedPost.author.name}
												className="w-12 h-12 rounded-full object-cover"
											/>
											<div>
												<h4 className="font-medium">
													{selectedPost.author.name}
												</h4>
												<p className="text-sm opacity-75">
													{selectedPost.author.role}
												</p>
											</div>
										</div>
										<div className="flex items-center gap-2 text-sm">
											<span className="flex items-center gap-1">
												<Clock size={14} />
												{selectedPost.readTime} min read
											</span>
											<span>•</span>
											<span className="flex items-center gap-1">
												<Eye size={14} />
												{Math.floor(Math.random() * 900) + 100} views
											</span>
										</div>
									</div>

									<div
										className={`prose max-w-none overflow-x-scroll ${
											theme === "light" ? "prose-slate" : "prose-invert"
										}`}
										dangerouslySetInnerHTML={{
											__html: selectedPost.content || "",
										}}
									/>

									<div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between">
										<div className="flex items-center gap-6">
											<button
												onClick={(e) => toggleLike(selectedPost.id, e)}
												className="flex items-center gap-2 group cursor-pointer"
											>
												<Heart
													size={20}
													className={
														likedPosts.includes(selectedPost.id)
															? "text-red-500 fill-red-500"
															: `text-gray-400 group-hover:text-red-500 transition-colors ${
																	theme === "light"
																		? "group-hover:text-red-500"
																		: "group-hover:text-red-400"
															  }`
													}
												/>
												<span className="text-sm font-medium">
													{likedPosts.includes(selectedPost.id)
														? "Liked"
														: "Like"}
												</span>
											</button>

											<button
												onClick={(e) => toggleBookmark(selectedPost.id, e)}
												className="flex items-center gap-2 group cursor-pointer"
											>
												<Bookmark
													size={20}
													className={
														bookmarkedPosts.includes(selectedPost.id)
															? "text-indigo-500 fill-indigo-500"
															: `text-gray-400 group-hover:text-indigo-500 transition-colors ${
																	theme === "light"
																		? "group-hover:text-indigo-500"
																		: "group-hover:text-indigo-400"
															  }`
													}
												/>
												<span className="text-sm font-medium">
													{bookmarkedPosts.includes(selectedPost.id)
														? "Saved"
														: "Save"}
												</span>
											</button>

											<button
												onClick={(e) => handleComment(e)}
												className="flex items-center gap-2 group cursor-pointer"
											>
												<MessageCircle
													size={20}
													className={`text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors`}
												/>
												<span className="text-sm font-medium">Comment</span>
											</button>
										</div>

										<button
											onClick={(e) => handleShare(e)}
											className="flex items-center gap-2 cursor-pointer"
										>
											<Copy size={18} className="text-gray-500" />
											<span className="text-sm font-medium">Copy link</span>
										</button>
									</div>

									<div className="mt-12">
										<h3 className="text-xl font-bold mb-4">Related Articles</h3>
										<div className="grid gap-6 sm:grid-cols-2">
											{getRelatedPosts(selectedPost.id, selectedPost.tag).map(
												(post) => (
													<div
														key={post.id}
														onClick={() => handleArticleClick(post)}
														className={`flex gap-4 rounded-lg p-3 cursor-pointer ${
															theme === "light"
																? "hover:bg-gray-50"
																: "hover:bg-slate-800"
														}`}
													>
														<img
															src={post.img}
															alt={post.title}
															className="w-20 h-20 rounded-lg object-cover flex-shrink-0"
														/>
														<div className="space-y-1">
															<h4 className="font-medium line-clamp-2">
																{post.title}
															</h4>
															<div className="flex items-center gap-2 text-xs text-gray-500">
																<span>{post.date}</span>
																<span>•</span>
																<span>{post.readTime} min read</span>
															</div>
														</div>
													</div>
												)
											)}
										</div>
									</div>
								</div>
							</motion.div>
						</div>
					</motion.div>
				)}
			</AnimatePresence>

			<motion.header
				initial={{ opacity: 0, y: -20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.6 }}
				className={`fixed top-0 left-0 w-full z-40 shadow-md ${
					theme === "light"
						? "bg-white shadow-gray-200"
						: "bg-slate-900 shadow-slate-800"
				}`}
			>
				<div className="container mx-auto px-4">
					<div className="flex items-center justify-between py-4">
						<div className="flex items-center gap-2">
							<span className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 text-transparent bg-clip-text">
								Insightful
							</span>
						</div>

						<nav className="hidden md:flex items-center space-x-8">
							<Link
								href="#home"
								className={`font-medium hover:text-indigo-600 transition-colors ${
									activeSection === "home" ? "text-indigo-600" : ""
								}`}
							>
								Home
							</Link>
							<Link
								href="#saved"
								className={`font-medium hover:text-indigo-600 transition-colors ${
									activeSection === "saved" ? "text-indigo-600" : ""
								}`}
							>
								Saved
							</Link>
							<Link
								href="#about"
								className={`font-medium hover:text-indigo-600 transition-colors ${
									activeSection === "about" ? "text-indigo-600" : ""
								}`}
							>
								About
							</Link>
							<Link
								href="#contact"
								className={`font-medium hover:text-indigo-600 transition-colors ${
									activeSection === "contact" ? "text-indigo-600" : ""
								}`}
							>
								Contact
							</Link>
						</nav>

						<div className="flex items-center gap-3">
							<button
								onClick={() => setTheme(theme === "light" ? "dark" : "light")}
								className={`p-2 rounded-full cursor-pointer ${
									theme === "light" ? "hover:bg-gray-100" : "hover:bg-slate-800"
								}`}
								aria-label="Toggle theme"
							>
								{theme === "light" ? <Moon size={20} /> : <Sun size={20} />}
							</button>

							<button
								onClick={() => setIsMenuOpen(!isMenuOpen)}
								className="p-2 rounded-md md:hidden cursor-pointer"
								aria-label="Toggle menu"
							>
								<Menu size={24} />
							</button>
						</div>
					</div>
				</div>
			</motion.header>

			<AnimatePresence>
				{isMenuOpen && (
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						className="fixed inset-0 z-30 md:hidden"
					>
						<motion.div
							initial={{ x: "100%" }}
							animate={{ x: 0 }}
							exit={{ x: "100%" }}
							transition={{ type: "tween", duration: 0.3 }}
							className={`fixed top-0 right-0 w-64 h-full shadow-lg ${
								theme === "light" ? "bg-white" : "bg-slate-900"
							} p-5`}
						>
							<button
								onClick={() => setIsMenuOpen(false)}
								className="absolute top-5 right-5 cursor-pointer"
								aria-label="Close menu"
							>
								<X size={24} />
							</button>

							<div className="mt-12 flex flex-col space-y-4">
								<Link
									href="#home"
									onClick={() => setIsMenuOpen(false)}
									className="font-medium py-2 hover:text-indigo-600"
								>
									Home
								</Link>
								<Link
									href="#saved"
									onClick={() => setIsMenuOpen(false)}
									className="font-medium py-2 hover:text-indigo-600"
								>
									Saved
								</Link>
								<Link
									href="#about"
									onClick={() => setIsMenuOpen(false)}
									className="font-medium py-2 hover:text-indigo-600"
								>
									About
								</Link>
								<Link
									href="#contact"
									onClick={() => setIsMenuOpen(false)}
									className="font-medium py-2 hover:text-indigo-600"
								>
									Contact
								</Link>
							</div>
						</motion.div>
					</motion.div>
				)}
			</AnimatePresence>

			<main className="pt-20 container mx-auto px-4 py-8 space-y-16">
				<motion.section
					id="home"
					ref={homeRef}
					initial={{ opacity: 0, y: 30 }}
					whileInView={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.8 }}
					viewport={{ once: true }}
					className="relative rounded-xl overflow-hidden"
				>
					<div className="absolute inset-0">
						<img
							src="https://images.unsplash.com/photo-1499750310107-5fef28a66643?q=80&w=2070&auto=format&fit=crop"
							alt="Hero background"
							className="w-full h-full object-cover"
						/>
						<div className="absolute inset-0 bg-gradient-to-r from-indigo-900/80 to-black/60" />
					</div>

					<div className="relative py-24 px-4 sm:px-6 lg:px-8 flex flex-col items-start">
						<motion.div
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ delay: 0.2, duration: 0.6 }}
							className="max-w-xl"
						>
							<h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
								Insights for the Curious Mind
							</h1>
							<p className="text-lg text-gray-200 mb-6">
								Explore thought-provoking articles on technology, design, and
								mindful living.
							</p>
							<div className="flex flex-wrap gap-3">
								<button
									onClick={() =>
										document
											.getElementById("latest-posts")
											?.scrollIntoView({ behavior: "smooth" })
									}
									className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition duration-200 flex items-center gap-2 cursor-pointer"
								>
									Explore Articles
									<ArrowRight size={16} />
								</button>
								<button
									onClick={() => setShowNewsletter(true)}
									className="px-6 py-3 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white font-medium rounded-lg transition duration-200 cursor-pointer"
								>
									Subscribe
								</button>
							</div>
						</motion.div>
					</div>
				</motion.section>

				<section id="latest-posts" className="space-y-8">
					<div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
						<motion.h2
							initial={{ opacity: 0, x: -20 }}
							whileInView={{ opacity: 1, x: 0 }}
							transition={{ duration: 0.5 }}
							viewport={{ once: true }}
							className="text-2xl font-bold"
						>
							Latest Articles
						</motion.h2>

						<motion.div
							initial={{ opacity: 0, x: 20 }}
							whileInView={{ opacity: 1, x: 0 }}
							transition={{ duration: 0.5 }}
							viewport={{ once: true }}
							className="flex flex-col sm:flex-row gap-4"
						>
							<div className="flex gap-2 flex-wrap">
								{["all", "tech", "lifestyle", "design"].map((tag) => (
									<button
										key={tag}
										onClick={() => setTagFilter(tag)}
										className={`px-4 py-1.5 rounded-full text-sm transition-colors cursor-pointer ${
											tagFilter === tag
												? "bg-indigo-600 text-white"
												: theme === "light"
												? "bg-gray-100 text-gray-800 hover:bg-gray-200"
												: "bg-slate-800 text-slate-200 hover:bg-slate-700"
										}`}
									>
										{tag.charAt(0).toUpperCase() + tag.slice(1)}
									</button>
								))}
							</div>

							<div className="relative">
								<Search
									className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
									size={16}
								/>
								<input
									type="text"
									value={query}
									onChange={(e) => setQuery(e.target.value)}
									placeholder="Search posts..."
									className={`w-full pl-10 pr-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors ${
										theme === "light"
											? "bg-white border-gray-200"
											: "bg-slate-800 border-slate-700"
									}`}
								/>
							</div>
						</motion.div>
					</div>

					{filteredPosts.length > 0 ? (
						<motion.div
							initial={{ opacity: 0, y: 20 }}
							whileInView={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.6 }}
							viewport={{ once: true }}
							className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
						>
							{filteredPosts.map((post) => (
								<motion.article
									key={post.id}
									whileHover={{ y: -5 }}
									transition={{ duration: 0.2 }}
									onClick={() => handleArticleClick(post)}
									className={`rounded-xl overflow-hidden shadow-lg ${
										theme === "light"
											? "bg-white hover:shadow-xl"
											: "bg-slate-800 hover:shadow-slate-700/50"
									} transition-all duration-300 cursor-pointer`}
								>
									<div className="relative h-48 overflow-hidden">
										<img
											src={post.img}
											alt={`Cover for ${post.title}`}
											className="w-full h-full object-cover transition-transform duration-700 hover:scale-110"
										/>
										<div className="absolute top-3 left-3">
											<span
												className={`inline-block px-3 py-1 text-xs font-medium rounded-full ${
													post.tag === "tech"
														? "bg-blue-600 text-white"
														: post.tag === "lifestyle"
														? "bg-emerald-600 text-white"
														: "bg-purple-600 text-white"
												}`}
											>
												{post.tag.charAt(0).toUpperCase() + post.tag.slice(1)}
											</span>
										</div>
									</div>

									<div className="p-5 space-y-3">
										<div className="flex items-center gap-2 text-sm text-gray-500">
											<span className="flex items-center gap-1">
												<Clock size={14} />
												{post.readTime} min read
											</span>
											<span>•</span>
											<span>{post.date}</span>
										</div>

										<h3 className="text-lg font-bold leading-tight hover:text-indigo-600 transition-colors">
											{post.title}
										</h3>

										<p
											className={`text-sm ${
												theme === "light" ? "text-gray-600" : "text-gray-300"
											}`}
										>
											{post.desc}
										</p>

										<div className="flex items-center justify-between pt-3 border-t border-gray-200 dark:border-gray-700">
											<div className="flex items-center gap-2">
												<img
													src={post.author.avatar}
													alt={post.author.name}
													className="w-8 h-8 rounded-full object-cover"
												/>
												<span className="text-sm font-medium">
													{post.author.name}
												</span>
											</div>

											<div className="flex items-center gap-3">
												<button
													onClick={(e) => toggleLike(post.id, e)}
													className="group cursor-pointer"
													aria-label="Like post"
												>
													<Heart
														size={18}
														className={
															likedPosts.includes(post.id)
																? "text-red-500 fill-red-500"
																: `text-gray-400 group-hover:text-red-500 transition-colors ${
																		theme === "light"
																			? "group-hover:text-red-500"
																			: "group-hover:text-red-400"
																  }`
														}
													/>
												</button>

												<button
													onClick={(e) => toggleBookmark(post.id, e)}
													className="group cursor-pointer"
													aria-label="Bookmark post"
												>
													<Bookmark
														size={18}
														className={
															bookmarkedPosts.includes(post.id)
																? "text-indigo-500 fill-indigo-500"
																: `text-gray-400 group-hover:text-indigo-500 transition-colors ${
																		theme === "light"
																			? "group-hover:text-indigo-500"
																			: "group-hover:text-indigo-400"
																  }`
														}
													/>
												</button>
											</div>
										</div>
									</div>
								</motion.article>
							))}
						</motion.div>
					) : (
						<div
							className={`text-center py-12 border border-dashed rounded-lg ${
								theme === "light" ? "border-gray-300" : "border-gray-700"
							}`}
						>
							<p className="text-lg font-medium">
								No posts found matching your criteria
							</p>
							<button
								onClick={() => {
									setTagFilter("all");
									setQuery("");
								}}
								className="mt-3 text-indigo-600 hover:text-indigo-700 font-medium cursor-pointer"
							>
								Clear filters
							</button>
						</div>
					)}
				</section>

				{filteredPosts.length > 0 && (
					<motion.section
						initial={{ opacity: 0, y: 30 }}
						whileInView={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.7 }}
						viewport={{ once: true }}
						className={`relative rounded-xl overflow-hidden ${
							theme === "light" ? "bg-indigo-50" : "bg-slate-800/50"
						} p-6 sm:p-8`}
					>
						<div className="flex flex-col lg:flex-row gap-8">
							<div className="lg:w-1/2">
								<img
									src={filteredPosts[0].img}
									alt={`Featured post: ${filteredPosts[0].title}`}
									className="rounded-lg w-full h-64 sm:h-80 lg:h-96 object-cover"
								/>
							</div>

							<div className="lg:w-1/2 flex flex-col justify-center space-y-4">
								<div>
									<span
										className={`inline-block px-3 py-1 text-xs font-medium rounded-full ${
											filteredPosts[0].tag === "tech"
												? "bg-blue-600 text-white"
												: filteredPosts[0].tag === "lifestyle"
												? "bg-emerald-600 text-white"
												: "bg-purple-600 text-white"
										}`}
									>
										Featured
									</span>
									<span className="text-sm ml-2">{filteredPosts[0].date}</span>
								</div>

								<h2 className="text-2xl sm:text-3xl font-bold">
									{filteredPosts[0].title}
								</h2>

								<p className="text-base sm:text-lg opacity-85">
									{filteredPosts[0].desc}
								</p>

								<div className="flex items-center gap-4 pt-2">
									<img
										src={filteredPosts[0].author.avatar}
										alt={filteredPosts[0].author.name}
										className="w-10 h-10 rounded-full object-cover"
									/>
									<div>
										<h4 className="font-medium">
											{filteredPosts[0].author.name}
										</h4>
										<p className="text-sm opacity-75">
											{filteredPosts[0].author.role}
										</p>
									</div>
								</div>

								<div className="pt-4">
									<button
										onClick={() => handleArticleClick(filteredPosts[0])}
										className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors cursor-pointer flex items-center gap-2"
									>
										Read Article
										<ArrowRight size={16} />
									</button>
								</div>
							</div>
						</div>
					</motion.section>
				)}

				<motion.section
					id="saved"
					ref={savedRef}
					initial={{ opacity: 0, y: 30 }}
					whileInView={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.7 }}
					viewport={{ once: true }}
					className={`rounded-xl ${
						theme === "light" ? "bg-gray-50" : "bg-slate-800/50"
					} p-6 sm:p-8`}
				>
					<div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
						<h2 className="text-2xl font-bold">Your Collections</h2>

						<div
							className={`inline-flex rounded-md ${
								theme === "light" ? "bg-gray-100" : "bg-slate-700"
							} p-1`}
						>
							<button
								onClick={() => setSavedSectionTab("liked")}
								className={`px-4 py-2 text-sm font-medium rounded-md cursor-pointer ${
									savedSectionTab === "liked"
										? "bg-indigo-600 text-white"
										: "hover:bg-gray-200 dark:hover:bg-slate-600"
								}`}
							>
								<span className="flex items-center gap-2">
									<Heart size={16} />
									Liked
								</span>
							</button>
							<button
								onClick={() => setSavedSectionTab("bookmarked")}
								className={`px-4 py-2 text-sm font-medium rounded-md cursor-pointer ${
									savedSectionTab === "bookmarked"
										? "bg-indigo-600 text-white"
										: "hover:bg-gray-200 dark:hover:bg-slate-600"
								}`}
							>
								<span className="flex items-center gap-2">
									<BookmarkIcon size={16} />
									Bookmarked
								</span>
							</button>
						</div>
					</div>

					{savedPostsList.length > 0 ? (
						<div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
							{savedPostsList.map((post) => (
								<motion.article
									key={post.id}
									whileHover={{ y: -5 }}
									transition={{ duration: 0.2 }}
									onClick={() => handleArticleClick(post)}
									className={`rounded-xl overflow-hidden shadow-lg ${
										theme === "light"
											? "bg-white hover:shadow-xl"
											: "bg-slate-800 hover:shadow-slate-700/50"
									} transition-all duration-300 cursor-pointer`}
								>
									<div className="relative h-48 overflow-hidden">
										<img
											src={post.img}
											alt={`Cover for ${post.title}`}
											className="w-full h-full object-cover transition-transform duration-700 hover:scale-110"
										/>
										<div className="absolute top-3 left-3">
											<span
												className={`inline-block px-3 py-1 text-xs font-medium rounded-full ${
													post.tag === "tech"
														? "bg-blue-600 text-white"
														: post.tag === "lifestyle"
														? "bg-emerald-600 text-white"
														: "bg-purple-600 text-white"
												}`}
											>
												{post.tag.charAt(0).toUpperCase() + post.tag.slice(1)}
											</span>
										</div>
									</div>

									<div className="p-5 space-y-3">
										<div className="flex items-center gap-2 text-sm text-gray-500">
											<span className="flex items-center gap-1">
												<Clock size={14} />
												{post.readTime} min read
											</span>
											<span>•</span>
											<span>{post.date}</span>
										</div>

										<h3 className="text-lg font-bold leading-tight hover:text-indigo-600 transition-colors">
											{post.title}
										</h3>

										<p
											className={`text-sm ${
												theme === "light" ? "text-gray-600" : "text-gray-300"
											}`}
										>
											{post.desc}
										</p>

										<div className="flex items-center justify-between pt-3 border-t border-gray-200 dark:border-gray-700">
											<div className="flex items-center gap-2">
												<img
													src={post.author.avatar}
													alt={post.author.name}
													className="w-8 h-8 rounded-full object-cover"
												/>
												<span className="text-sm font-medium">
													{post.author.name}
												</span>
											</div>

											<div className="flex items-center gap-3">
												<button
													onClick={(e) => toggleLike(post.id, e)}
													className="group cursor-pointer"
													aria-label="Like post"
												>
													<Heart
														size={18}
														className={
															likedPosts.includes(post.id)
																? "text-red-500 fill-red-500"
																: `text-gray-400 group-hover:text-red-500 transition-colors ${
																		theme === "light"
																			? "group-hover:text-red-500"
																			: "group-hover:text-red-400"
																  }`
														}
													/>
												</button>

												<button
													onClick={(e) => toggleBookmark(post.id, e)}
													className="group cursor-pointer"
													aria-label="Bookmark post"
												>
													<Bookmark
														size={18}
														className={
															bookmarkedPosts.includes(post.id)
																? "text-indigo-500 fill-indigo-500"
																: `text-gray-400 group-hover:text-indigo-500 transition-colors ${
																		theme === "light"
																			? "group-hover:text-indigo-500"
																			: "group-hover:text-indigo-400"
																  }`
														}
													/>
												</button>
											</div>
										</div>
									</div>
								</motion.article>
							))}
						</div>
					) : (
						<div
							className={`text-center py-16 border border-dashed rounded-lg ${
								theme === "light" ? "border-gray-300" : "border-gray-700"
							}`}
						>
							<div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center rounded-full bg-gray-100 dark:bg-slate-700">
								{savedSectionTab === "liked" ? (
									<Heart size={24} className="text-gray-400" />
								) : (
									<BookmarkIcon size={24} className="text-gray-400" />
								)}
							</div>
							<h3 className="text-lg font-medium mb-2">
								No {savedSectionTab === "liked" ? "liked" : "bookmarked"}{" "}
								articles yet
							</h3>
							<p className="text-sm opacity-75 max-w-md mx-auto">
								Browse articles and{" "}
								{savedSectionTab === "liked" ? "like" : "bookmark"} them to see
								them here.
							</p>
							<button
								onClick={() =>
									document
										.getElementById("latest-posts")
										?.scrollIntoView({ behavior: "smooth" })
								}
								className="mt-4 px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors cursor-pointer flex items-center gap-2 mx-auto"
							>
								Browse Articles
								<ArrowRight size={16} />
							</button>
						</div>
					)}
				</motion.section>

				<div className="grid md:grid-cols-2 gap-8">
					<motion.section
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.5 }}
						viewport={{ once: true }}
						className={`p-6 rounded-xl ${
							theme === "light" ? "bg-gray-50" : "bg-slate-800/50"
						}`}
					>
						<h3 className="text-xl font-bold mb-4">Popular Categories</h3>
						<div className="space-y-3">
							{popularTags.map(({ tag, count }) => (
								<div
									key={tag}
									onClick={() => setTagFilter(tag)}
									className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors ${
										theme === "light"
											? "hover:bg-gray-100"
											: "hover:bg-slate-700"
									}`}
								>
									<div className="flex items-center gap-3">
										<span
											className={`w-3 h-3 rounded-full ${
												tag === "tech"
													? "bg-blue-500"
													: tag === "lifestyle"
													? "bg-emerald-500"
													: "bg-purple-500"
											}`}
										></span>
										<span className="font-medium capitalize">{tag}</span>
									</div>
									<span
										className={`px-2 py-1 rounded-full text-xs ${
											theme === "light"
												? "bg-gray-200 text-gray-800"
												: "bg-slate-700 text-slate-200"
										}`}
									>
										{count} posts
									</span>
								</div>
							))}
						</div>
					</motion.section>

					<motion.section
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.5, delay: 0.1 }}
						viewport={{ once: true }}
						className={`p-6 rounded-xl ${
							theme === "light"
								? "bg-gradient-to-br from-indigo-50 to-purple-50"
								: "bg-gradient-to-br from-slate-800 to-indigo-900/30"
						}`}
					>
						<h3 className="text-xl font-bold mb-2">Subscribe to Newsletter</h3>
						<p className="mb-4 opacity-75">
							Get notified about the latest posts and updates.
						</p>

						<form onSubmit={handleNewsletterSubmit} className="space-y-3">
							<input
								type="email"
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								placeholder="Your email address"
								required
								className={`w-full px-4 py-2.5 rounded-lg border focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
									theme === "light"
										? "bg-white border-gray-200"
										: "bg-slate-800 border-slate-700"
								}`}
							/>
							<button
								type="submit"
								className="w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors cursor-pointer"
							>
								Subscribe
							</button>
						</form>
					</motion.section>
				</div>

				<motion.section
					id="about"
					ref={aboutRef}
					initial={{ opacity: 0, y: 30 }}
					whileInView={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.7 }}
					viewport={{ once: true }}
					className="py-10"
				>
					<div className="max-w-4xl mx-auto">
						<div className="text-center space-y-4 mb-10">
							<h2 className="text-3xl font-bold">About The Author</h2>
							<div className="w-16 h-1 bg-indigo-600 mx-auto rounded-full"></div>
						</div>

						<div className="flex flex-col md:flex-row items-center gap-8">
							<div className="md:w-1/3 flex justify-center">
								<motion.div
									whileHover={{ scale: 1.05 }}
									transition={{ duration: 0.3 }}
								>
									<img
										src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=1780&auto=format&fit=crop"
										alt="Alex Morgan"
										className="w-48 h-48 rounded-full object-cover border-4 border-indigo-100"
									/>
								</motion.div>
							</div>

							<div className="md:w-2/3 space-y-4 text-center md:text-left">
								<h3 className="text-2xl font-bold">Alex Morgan</h3>
								<p className="text-indigo-600 font-medium">
									Content Creator & Tech Enthusiast
								</p>
								<p className="opacity-85">
									Hi there! I'm Alex, a passionate writer and developer with
									over 5 years of experience in the tech industry. I created
									this blog to share insights on technology, design, and
									maintaining balance in our digital lives.
								</p>

								<div className="flex justify-center md:justify-start gap-4 pt-2">
									<a
										href="#"
										onClick={(e) => {
											e.preventDefault();
											showToast("Twitter link clicked", "info");
										}}
										className={`p-2 rounded-full ${
											theme === "light"
												? "bg-gray-100 hover:bg-gray-200"
												: "bg-slate-800 hover:bg-slate-700"
										} cursor-pointer transition-colors`}
										aria-label="Twitter"
									>
										<svg
											className="w-5 h-5"
											fill="currentColor"
											viewBox="0 0 24 24"
											aria-hidden="true"
										>
											<path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"></path>
										</svg>
									</a>
									<a
										href="#"
										onClick={(e) => {
											e.preventDefault();
											showToast("GitHub link clicked", "info");
										}}
										className={`p-2 rounded-full ${
											theme === "light"
												? "bg-gray-100 hover:bg-gray-200"
												: "bg-slate-800 hover:bg-slate-700"
										} cursor-pointer transition-colors`}
										aria-label="GitHub"
									>
										<svg
											className="w-5 h-5"
											fill="currentColor"
											viewBox="0 0 24 24"
											aria-hidden="true"
										>
											<path
												fillRule="evenodd"
												d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
												clipRule="evenodd"
											></path>
										</svg>
									</a>
									<a
										href="#"
										onClick={(e) => {
											e.preventDefault();
											showToast("LinkedIn link clicked", "info");
										}}
										className={`p-2 rounded-full ${
											theme === "light"
												? "bg-gray-100 hover:bg-gray-200"
												: "bg-slate-800 hover:bg-slate-700"
										} cursor-pointer transition-colors`}
										aria-label="LinkedIn"
									>
										<svg
											className="w-5 h-5"
											fill="currentColor"
											viewBox="0 0 24 24"
											aria-hidden="true"
										>
											<path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"></path>
										</svg>
									</a>
								</div>
							</div>
						</div>
					</div>
				</motion.section>

				<motion.section
					id="contact"
					ref={contactRef}
					initial={{ opacity: 0, y: 30 }}
					whileInView={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.7 }}
					viewport={{ once: true }}
					className={`rounded-xl ${
						theme === "light"
							? "bg-white shadow-lg"
							: "bg-slate-800 shadow-slate-700/20"
					} p-6 md:p-8`}
				>
					<div className="max-w-4xl mx-auto">
						<div className="text-center space-y-4 mb-8">
							<h2 className="text-3xl font-bold">Get In Touch</h2>
							<p className="opacity-75 max-w-md mx-auto">
								Have a question or suggestion? Feel free to reach out and I'll
								get back to you as soon as possible.
							</p>
						</div>

						<div className="grid md:grid-cols-2 gap-8">
							<div className="space-y-6">
								<div
									className={`p-5 rounded-lg ${
										theme === "light" ? "bg-gray-50" : "bg-slate-700/50"
									}`}
								>
									<h3 className="font-semibold mb-2 flex items-center gap-2">
										<svg
											xmlns="http://www.w3.org/2000/svg"
											className="h-5 w-5 text-indigo-600"
											fill="none"
											viewBox="0 0 24 24"
											stroke="currentColor"
										>
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												strokeWidth={2}
												d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
											/>
										</svg>
										Email
									</h3>
									<p className="opacity-85">alex@insightful.blog</p>
								</div>

								<div
									className={`p-5 rounded-lg ${
										theme === "light" ? "bg-gray-50" : "bg-slate-700/50"
									}`}
								>
									<h3 className="font-semibold mb-2 flex items-center gap-2">
										<svg
											xmlns="http://www.w3.org/2000/svg"
											className="h-5 w-5 text-indigo-600"
											fill="none"
											viewBox="0 0 24 24"
											stroke="currentColor"
										>
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												strokeWidth={2}
												d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
											/>
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												strokeWidth={2}
												d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
											/>
										</svg>
										Location
									</h3>
									<p className="opacity-85">San Francisco, CA</p>
								</div>

								<div
									className={`p-5 rounded-lg ${
										theme === "light" ? "bg-gray-50" : "bg-slate-700/50"
									}`}
								>
									<h3 className="font-semibold mb-2 flex items-center gap-2">
										<svg
											xmlns="http://www.w3.org/2000/svg"
											className="h-5 w-5 text-indigo-600"
											fill="none"
											viewBox="0 0 24 24"
											stroke="currentColor"
										>
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												strokeWidth={2}
												d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
											/>
										</svg>
										Response Time
									</h3>
									<p className="opacity-85">Within 24 hours</p>
								</div>
							</div>

							<form
								onSubmit={(e) => {
									e.preventDefault();
									showToast("Message sent successfully!", "success");

									console.log("Contact form submitted");
								}}
								className="space-y-4"
							>
								<div>
									<label
										htmlFor="name"
										className="block text-sm font-medium mb-1"
									>
										Name
									</label>
									<input
										type="text"
										id="name"
										placeholder="Your name"
										required
										className={`w-full px-4 py-2.5 rounded-lg border focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
											theme === "light"
												? "bg-white border-gray-200"
												: "bg-slate-800 border-slate-700"
										}`}
									/>
								</div>

								<div>
									<label
										htmlFor="email"
										className="block text-sm font-medium mb-1"
									>
										Email
									</label>
									<input
										type="email"
										id="email"
										placeholder="Your email"
										required
										className={`w-full px-4 py-2.5 rounded-lg border focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
											theme === "light"
												? "bg-white border-gray-200"
												: "bg-slate-800 border-slate-700"
										}`}
									/>
								</div>

								<div>
									<label
										htmlFor="message"
										className="block text-sm font-medium mb-1"
									>
										Message
									</label>
									<textarea
										id="message"
										placeholder="Your message"
										rows={4}
										required
										className={`w-full px-4 py-2.5 rounded-lg border focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
											theme === "light"
												? "bg-white border-gray-200"
												: "bg-slate-800 border-slate-700"
										}`}
									></textarea>
								</div>

								<button
									type="submit"
									className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors cursor-pointer"
								>
									Send Message
								</button>
							</form>
						</div>
					</div>
				</motion.section>
			</main>

			<div className="fixed bottom-8 right-8 z-20">
				<button
					onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
					className={`p-3 rounded-full shadow-lg transition-all hover:transform hover:scale-110 cursor-pointer ${
						theme === "light"
							? "bg-indigo-600 hover:bg-indigo-700 text-white"
							: "bg-indigo-600 hover:bg-indigo-700 text-white"
					}`}
					aria-label="Back to top"
				>
					<ChevronDown className="transform rotate-180" size={20} />
				</button>
			</div>

			<motion.footer
				initial={{ opacity: 0 }}
				whileInView={{ opacity: 1 }}
				transition={{ duration: 0.5 }}
				className={`mt-16 border-t ${
					theme === "light" ? "border-gray-200" : "border-slate-800"
				}`}
			>
				<div className="container mx-auto px-4 py-8">
					<div className="flex flex-col md:flex-row justify-between items-center gap-6">
						<div>
							<h2 className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 text-transparent bg-clip-text">
								Insightful
							</h2>
							<p className="mt-2 text-sm opacity-75">
								Exploring technology, design, and mindful living.
							</p>
						</div>

						<div className="flex flex-wrap justify-center gap-6 text-sm">
							<a
								href="#home"
								className="hover:text-indigo-600 transition-colors"
							>
								Home
							</a>
							<a
								href="#saved"
								className="hover:text-indigo-600 transition-colors"
							>
								Saved
							</a>
							<a
								href="#about"
								className="hover:text-indigo-600 transition-colors"
							>
								About
							</a>
							<a
								href="#contact"
								className="hover:text-indigo-600 transition-colors"
							>
								Contact
							</a>
							<a
								href="#"
								onClick={(e) => {
									e.preventDefault();
									showToast("Privacy Policy coming soon", "info");
								}}
								className="hover:text-indigo-600 transition-colors"
							>
								Privacy Policy
							</a>
							<a
								href="#"
								onClick={(e) => {
									e.preventDefault();
									showToast("Terms of Service coming soon", "info");
								}}
								className="hover:text-indigo-600 transition-colors"
							>
								Terms of Service
							</a>
						</div>

						<div className="flex gap-4">
							<a
								href="#"
								onClick={(e) => {
									e.preventDefault();
									showToast("Twitter link clicked", "info");
								}}
								className={`p-2 rounded-full ${
									theme === "light"
										? "bg-gray-100 hover:bg-gray-200"
										: "bg-slate-800 hover:bg-slate-700"
								} cursor-pointer transition-colors`}
								aria-label="Twitter"
							>
								<svg
									className="w-5 h-5"
									fill="currentColor"
									viewBox="0 0 24 24"
									aria-hidden="true"
								>
									<path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"></path>
								</svg>
							</a>
							<a
								href="#"
								onClick={(e) => {
									e.preventDefault();
									showToast("GitHub link clicked", "info");
								}}
								className={`p-2 rounded-full ${
									theme === "light"
										? "bg-gray-100 hover:bg-gray-200"
										: "bg-slate-800 hover:bg-slate-700"
								} cursor-pointer transition-colors`}
								aria-label="GitHub"
							>
								<svg
									className="w-5 h-5"
									fill="currentColor"
									viewBox="0 0 24 24"
									aria-hidden="true"
								>
									<path
										fillRule="evenodd"
										d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
										clipRule="evenodd"
									></path>
								</svg>
							</a>
							<a
								href="#"
								onClick={(e) => {
									e.preventDefault();
									showToast("LinkedIn link clicked", "info");
								}}
								className={`p-2 rounded-full ${
									theme === "light"
										? "bg-gray-100 hover:bg-gray-200"
										: "bg-slate-800 hover:bg-slate-700"
								} cursor-pointer transition-colors`}
								aria-label="LinkedIn"
							>
								<svg
									className="w-5 h-5"
									fill="currentColor"
									viewBox="0 0 24 24"
									aria-hidden="true"
								>
									<path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"></path>
								</svg>
							</a>
						</div>
					</div>

					<div className="mt-8 pt-6 border-t text-center text-sm opacity-75">
						<p>© {new Date().getFullYear()} Insightful. All rights reserved.</p>
						<p className="mt-1">
							Designed and developed with{" "}
							<span className="text-red-500">♥</span> by Alex Morgan
						</p>
					</div>
				</div>
			</motion.footer>
		</div>
	);
}
