import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Calendar, User, ArrowRight, Search } from "lucide-react";

const BLOG_POSTS = [
  {
    title: "How AI is Transforming Digital Product Design in 2025",
    excerpt: "Explore the intersection of machine learning and user experience, and why generative UI is the next frontier for agencies.",
    author: "Tanveer",
    date: "May 1, 2026",
    category: "AI & Design",
    image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=800"
  },
  {
    title: "The Rise of Agentic AI: Beyond Simple Chatbots",
    excerpt: "Why the future of software lies in autonomous agents that can plan, execute, and reason within complex workflows.",
    author: "Tanveer",
    date: "April 28, 2026",
    category: "Technology",
    image: "https://images.unsplash.com/photo-1620712943543-bcc4628c9bb5?auto=format&fit=crop&q=80&w=800"
  },
  {
    title: "Building Scalable Platforms: A Guide for Founders",
    excerpt: "Everything you need to know about infrastructure, cloud-native architecture, and preparing for 10x growth.",
    author: "Dgion Team",
    date: "April 15, 2026",
    category: "Strategy",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800"
  }
];

export default function Blog() {
  return (
    <div className="min-h-screen bg-[#050505] text-white">
      <Navbar />
      
      <main className="pt-40 pb-24 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-20">
            <motion.span 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-[#837FFB] text-sm font-bold tracking-[0.3em] uppercase"
            >
              Insights & News
            </motion.span>
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="mt-6 text-5xl md:text-7xl font-bold font-display"
              style={{ fontFamily: "the-seasons" }}
            >
              The Dgion <span className="text-[#837FFB]">Blog</span>
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mt-8 text-white/50 text-xl max-w-2xl mx-auto"
            >
              Stay ahead of the curve with our latest thoughts on AI, design, and digital engineering.
            </motion.p>
          </div>

          {/* Featured Post */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="relative rounded-3xl overflow-hidden mb-20 aspect-[16/9] md:aspect-[21/9] group"
          >
            <img 
              src={BLOG_POSTS[0].image} 
              alt="Featured" 
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/40 to-transparent" />
            <div className="absolute bottom-0 left-0 p-8 md:p-12 w-full md:w-2/3">
              <span className="px-4 py-1.5 rounded-full bg-[#837FFB] text-white text-xs font-bold mb-4 inline-block">
                {BLOG_POSTS[0].category}
              </span>
              <h2 className="text-3xl md:text-5xl font-bold mb-4 leading-tight">
                {BLOG_POSTS[0].title}
              </h2>
              <div className="flex items-center gap-6 text-white/60 text-sm">
                <span className="flex items-center gap-2"><User className="w-4 h-4" /> {BLOG_POSTS[0].author}</span>
                <span className="flex items-center gap-2"><Calendar className="w-4 h-4" /> {BLOG_POSTS[0].date}</span>
              </div>
            </div>
          </motion.div>

          {/* Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-10">
            {BLOG_POSTS.slice(1).map((post, i) => (
              <motion.article 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + (i * 0.1) }}
                className="flex flex-col group"
              >
                <div className="relative aspect-video rounded-2xl overflow-hidden mb-6">
                  <img src={post.image} alt={post.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 rounded-lg bg-black/60 backdrop-blur-md text-white text-[10px] font-bold uppercase tracking-widest">
                      {post.category}
                    </span>
                  </div>
                </div>
                <h3 className="text-xl font-bold mb-3 group-hover:text-[#837FFB] transition-colors line-clamp-2">
                  {post.title}
                </h3>
                <p className="text-white/50 text-sm mb-6 line-clamp-3">
                  {post.excerpt}
                </p>
                <div className="mt-auto flex items-center justify-between pt-6 border-t border-white/5">
                  <div className="flex items-center gap-3 text-xs text-white/40">
                    <Calendar className="w-3.5 h-3.5" /> {post.date}
                  </div>
                  <Link to="#" className="text-sm font-bold flex items-center gap-2 text-[#837FFB]">
                    Read More <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </motion.article>
            ))}
          </div>

          {/* Newsletter */}
          <div className="mt-16 md:mt-32 p-6 sm:p-8 md:p-12 rounded-[28px] md:rounded-[40px] bg-gradient-to-br from-[#837FFB]/20 to-transparent border border-white/10 text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#837FFB]/10 blur-[100px] -mr-32 -mt-32 rounded-full" />
            <h2 className="text-3xl font-bold mb-4 relative z-10">Join the Circle</h2>
            <p className="text-white/50 mb-8 relative z-10 max-w-md mx-auto text-sm">
              Get the latest insights on AI and digital transformation delivered straight to your inbox.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto relative z-10">
              <input 
                type="email" 
                placeholder="Enter your email" 
                className="flex-1 px-6 py-4 rounded-2xl bg-white/5 border border-white/10 text-sm outline-none focus:border-[#837FFB] transition-colors"
              />
              <button className="px-8 py-4 rounded-2xl bg-[#837FFB] text-white font-bold text-sm hover:scale-105 transition-transform">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
