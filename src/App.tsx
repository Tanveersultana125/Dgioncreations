import { lazy, Suspense } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SmoothScrollProvider } from "@/lib/smooth-scroll";
import { AuthProvider } from "@/lib/auth-context";
import RouteFallback from "@/components/RouteFallback";
import ScrollToTop from "@/components/ScrollToTop";

// The landing page is the only eager import — it is what most visitors hit
// first, so shipping it in the entry chunk avoids a loading flash. Everything
// else is split out so the first paint no longer has to download the admin
// panel, Spline, three.js, recharts and every secondary page up front.
import Index from "./pages/Index.tsx";

const Services = lazy(() => import("./pages/Services.tsx"));
const Industries = lazy(() => import("./pages/Industries.tsx"));
const Process = lazy(() => import("./pages/Process.tsx"));
const Portfolio = lazy(() => import("./pages/Portfolio.tsx"));
const About = lazy(() => import("./pages/About.tsx"));
const Contact = lazy(() => import("./pages/Contact.tsx"));
const Reviews = lazy(() => import("./pages/Reviews.tsx"));
const ProjectDetail = lazy(() => import("./pages/ProjectDetail.tsx"));
const ServiceDetail = lazy(() => import("./pages/ServiceDetail.tsx"));
const Blog = lazy(() => import("./pages/Blog.tsx"));
const Support = lazy(() => import("./pages/Support.tsx"));
const Privacy = lazy(() => import("./pages/Privacy.tsx"));
const ComingSoon = lazy(() => import("./pages/ComingSoon.tsx"));
const NotFound = lazy(() => import("./pages/NotFound.tsx"));

// Admin — never touched by a normal visitor, so it must never be in their bundle.
const AdminLogin = lazy(() => import("./pages/admin/Login.tsx"));
const AdminDashboard = lazy(() => import("./pages/admin/Dashboard.tsx"));
const HomeEditor = lazy(() => import("./pages/admin/HomeEditor.tsx"));
const ExploreEditor = lazy(() => import("./pages/admin/ExploreEditor.tsx"));
const ClientsEditor = lazy(() => import("./pages/admin/ClientsEditor.tsx"));
const CtaEditor = lazy(() => import("./pages/admin/CtaEditor.tsx"));
const ServicesEditor = lazy(() => import("./pages/admin/ServicesEditor.tsx"));
const PortfolioEditor = lazy(() => import("./pages/admin/PortfolioEditor.tsx"));
const ProcessEditor = lazy(() => import("./pages/admin/ProcessEditor.tsx"));
const IndustriesEditor = lazy(() => import("./pages/admin/IndustriesEditor.tsx"));
const AboutEditor = lazy(() => import("./pages/admin/AboutEditor.tsx"));
const ContactEditor = lazy(() => import("./pages/admin/ContactEditor.tsx"));
const FooterEditor = lazy(() => import("./pages/admin/FooterEditor.tsx"));
const NavbarEditor = lazy(() => import("./pages/admin/NavbarEditor.tsx"));
const TestimonialsEditor = lazy(() => import("./pages/admin/TestimonialsEditor.tsx"));
const AdminUsers = lazy(() => import("./pages/admin/Users.tsx"));
const ProtectedRoute = lazy(() => import("./pages/admin/ProtectedRoute.tsx"));
const AdminLayout = lazy(() => import("./components/admin/AdminLayout.tsx"));

// The chat widget is not needed for first paint — let it arrive after the page.
const AIAgent = lazy(() => import("./components/AIAgent.tsx"));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Content is edited rarely; don't re-fetch on every window focus.
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000,
      retry: 1,
    },
  },
});

const AIAgentWrapper = () => {
  const { pathname } = useLocation();
  if (pathname.startsWith("/admin")) return null;
  return (
    <Suspense fallback={null}>
      <AIAgent />
    </Suspense>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      {/* AuthProvider wraps everything — exposes the current Firebase user to
          admin pages AND to public pages (e.g. to show an "Edit" overlay later). */}
      <AuthProvider>
        <SmoothScrollProvider>
          <BrowserRouter
            future={{
              v7_startTransition: true,
              v7_relativeSplatPath: true,
            }}
          >
            <ScrollToTop />
            <AIAgentWrapper />
            <Suspense fallback={<RouteFallback />}>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/services" element={<Services />} />
                <Route path="/industries" element={<Industries />} />
                <Route path="/process" element={<Process />} />
                <Route path="/portfolio" element={<Portfolio />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/reviews" element={<Reviews />} />
                <Route path="/project/:id" element={<ProjectDetail />} />
                <Route path="/service/:id" element={<ServiceDetail />} />

                {/* Content Pages */}
                <Route path="/blog" element={<Blog />} />
                <Route path="/case-studies" element={<ComingSoon />} />
                <Route path="/support" element={<Support />} />
                <Route path="/privacy" element={<Privacy />} />
                <Route path="/careers" element={<ComingSoon />} />

                {/* Admin routes — login is public, everything else requires Firebase auth */}
                <Route path="/admin/login" element={<AdminLogin />} />
                <Route element={<ProtectedRoute />}>
                  <Route element={<AdminLayout />}>
                    <Route path="/admin" element={<AdminDashboard />} />
                    <Route path="/admin/home" element={<HomeEditor />} />
                    <Route path="/admin/explore" element={<ExploreEditor />} />
                    <Route path="/admin/clients" element={<ClientsEditor />} />
                    <Route path="/admin/cta" element={<CtaEditor />} />
                    <Route path="/admin/services" element={<ServicesEditor />} />
                    <Route path="/admin/portfolio" element={<PortfolioEditor />} />
                    <Route path="/admin/process" element={<ProcessEditor />} />
                    <Route path="/admin/industries" element={<IndustriesEditor />} />
                    <Route path="/admin/about" element={<AboutEditor />} />
                    <Route path="/admin/contact" element={<ContactEditor />} />
                    <Route path="/admin/footer" element={<FooterEditor />} />
                    <Route path="/admin/navbar" element={<NavbarEditor />} />
                    <Route path="/admin/testimonials" element={<TestimonialsEditor />} />
                    <Route path="/admin/users" element={<AdminUsers />} />
                  </Route>
                </Route>

                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </BrowserRouter>
        </SmoothScrollProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
