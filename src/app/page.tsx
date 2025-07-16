//Welcome to JobSeek
"use client";
import "@/app/globals.css";
import TypingText from "@/app/components/TypingText";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { FiBriefcase, FiSearch, FiZap, FiCheckCircle, FiArrowRight } from "react-icons/fi";
import { useMemo, useState, useEffect } from "react";
import Image from 'next/image';
import CountUp from 'react-countup';

// Add this CSS to your styles file (e.g., globals.css)
const styles = `
  .welcome-page {
    @apply min-h-screen bg-gray-900 text-white relative overflow-hidden;
  }

  .animated-bg {
    @apply fixed inset-0 overflow-hidden pointer-events-none;
  }

  .animated-dot {
    @apply absolute w-2 h-2 md:w-3 md:h-3 rounded-full;
  }

  .gradient-overlay {
    @apply absolute inset-0 bg-gradient-to-b from-gray-900/50 to-gray-900/90;
  }

  .nav-container {
    @apply fixed top-0 left-0 right-0 z-50 bg-gray-900/80 backdrop-blur-md;
  }

  .nav-content {
    @apply max-w-7xl mx-auto px-4 sm:px-6 lg:px-8;
  }

  .nav-items {
    @apply flex items-center justify-between h-16 md:h-20;
  }

  .logo {
    @apply flex items-center space-x-2;
  }

  .logo-icon {
    @apply w-6 h-6 md:w-8 md:h-8 text-blue-500;
  }

  .logo-text {
    @apply text-lg md:text-xl font-bold;
  }

  .nav-buttons {
    @apply flex items-center space-x-2 md:space-x-4;
  }

  .nav-button {
    @apply px-3 py-1.5 md:px-4 md:py-2 rounded-lg text-sm md:text-base transition-all duration-200;
  }

  .login {
    @apply text-white hover:bg-white/10;
  }

  .signup {
    @apply bg-blue-500 text-white hover:bg-blue-600;
  }

  .hero-section {
    @apply relative pt-24 md:pt-32 pb-16 md:pb-24 px-4 sm:px-6 lg:px-8;
  }

  .hero-content {
    @apply max-w-4xl mx-auto text-center;
  }

  .hero-title {
    @apply text-3xl md:text-5xl lg:text-6xl font-bold mb-6 md:mb-8;
    background: linear-gradient(to right, #60A5FA, #7C3AED);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  .hero-description {
    @apply text-base md:text-lg lg:text-xl text-gray-300 max-w-2xl mx-auto mb-8 md:mb-10;
  }

  .cta-button {
    @apply inline-flex items-center justify-center px-6 py-3 md:px-8 md:py-4 
           text-base md:text-lg font-medium rounded-xl
           bg-gradient-to-r from-blue-500 to-purple-600 
           hover:from-blue-600 hover:to-purple-700 
           transform transition-all duration-200 
           hover:scale-105 hover:shadow-lg hover:shadow-blue-500/25;
  }

  .cta-button-icon {
    @apply ml-2 -mr-1 w-5 h-5 md:w-6 md:h-6;
  }

  .features-section {
    @apply relative py-16 md:py-24 px-4 sm:px-6 lg:px-8 bg-gray-800/50;
  }

  .features-grid {
    @apply max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8;
  }

  .feature-card {
    @apply relative p-6 md:p-8 rounded-2xl bg-gray-800 
           border border-gray-700 hover:border-blue-500/50
           transform transition-all duration-300 
           hover:scale-105 hover:shadow-xl hover:shadow-blue-500/10;
  }

  .feature-icon {
    @apply flex items-center justify-center w-12 h-12 md:w-14 md:h-14 
           rounded-xl bg-blue-500/10 text-blue-400 mb-4 md:mb-6;
  }

  .feature-title {
    @apply text-lg md:text-xl font-semibold mb-2 md:mb-3;
  }

  .feature-description {
    @apply text-sm md:text-base text-gray-400 leading-relaxed;
  }

  @media (max-width: 640px) {
    .hero-section {
      @apply pt-20 pb-12;
    }

    .hero-title {
      @apply text-2xl leading-tight;
    }

    .hero-description {
      @apply text-sm px-4;
    }

    .feature-card {
      @apply p-5;
    }

    .feature-icon {
      @apply w-10 h-10;
    }

    .feature-title {
      @apply text-base;
    }

    .feature-description {
      @apply text-xs;
    }
  }
`;

// Add these new sections to your existing styles
const additionalStyles = `
  .stats-section {
    @apply relative py-16 md:py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-gray-900 to-gray-800;
  }

  .stats-grid {
    @apply max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8;
  }

  .stat-card {
    @apply text-center p-4 md:p-6;
  }

  .stat-number {
    @apply text-2xl md:text-4xl font-bold text-blue-400 mb-2;
  }

  .stat-label {
    @apply text-sm md:text-base text-gray-400;
  }

  .testimonials-section {
    @apply relative py-16 md:py-24 px-4 sm:px-6 lg:px-8;
  }

  .testimonials-grid {
    @apply max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8;
  }

  .testimonial-card {
    @apply bg-gray-800/50 p-6 rounded-xl border border-gray-700;
  }

  .testimonial-content {
    @apply text-gray-300 mb-4;
  }

  .testimonial-author {
    @apply flex items-center;
  }

  .author-avatar {
    @apply w-10 h-10 rounded-full bg-gray-600 mr-3;
  }

  .author-info {
    @apply flex flex-col;
  }

  .author-name {
    @apply text-white font-medium;
  }

  .author-title {
    @apply text-sm text-gray-400;
  }

  .how-it-works-section {
    @apply relative py-16 md:py-24 px-4 sm:px-6 lg:px-8 bg-gray-800/30;
  }

  .steps-container {
    @apply max-w-4xl mx-auto;
  }

  .step-item {
    @apply flex items-start space-x-4 mb-8;
  }

  .step-number {
    @apply flex-shrink-0 w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold;
  }

  .companies-section {
    @apply relative py-12 md:py-16 px-4;
  }

  .companies-grid {
    @apply max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8 items-center;
  }

  .company-logo {
    @apply h-8 md:h-12 opacity-50 hover:opacity-100 transition-opacity filter grayscale hover:grayscale-0;
  }

  .cta-section {
    @apply relative py-16 md:py-24 px-4 text-center bg-gradient-to-r from-blue-600/20 to-purple-600/20;
  }
`;

export default function Home() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Generate deterministic positions for the dots
  const dots = useMemo(() => {
    return Array.from({ length: 50 }, (_, i) => ({
      color: i % 3 === 0 ? "#4F46E5" : i % 3 === 1 ? "#7C3AED" : "#2563EB",
      left: `${(i * 7) % 100}%`,
      top: `${(i * 5) % 100}%`,
      xOffset: ((i * 13) % 100) - 50,
      yOffset: ((i * 17) % 100) - 50,
      duration: 10 + (i % 10)
    }));
  }, []);

  if (!mounted) {
    return null;
  }

  const features = [
    {
      icon: <FiSearch className="w-6 h-6" />,
      title: "Smart Job Discovery",
      description: "AI-powered job matching that understands your skills and career goals"
    },
    {
      icon: <FiZap className="w-6 h-6" />,
      title: "Quick Apply",
      description: "One-click applications with your pre-filled profile information"
    },
    {
      icon: <FiCheckCircle className="w-6 h-6" />,
      title: "Application Tracking",
      description: "Monitor your job applications and interview status in real-time"
    }
  ];

  const stats = [
    {
      icon: <FiBriefcase className="w-8 h-8" />,
      value: 100000,
      suffix: "+",
      label: "Jobs Posted",
      color: "from-blue-500 to-blue-600"
    },
    {
      icon: <FiCheckCircle className="w-8 h-8" />,
      value: 50000,
      suffix: "+",
      label: "Successful Matches",
      color: "from-green-500 to-green-600"
    },
    {
      icon: <FiZap className="w-8 h-8" />,
      value: 95,
      suffix: "%",
      label: "Success Rate",
      color: "from-purple-500 to-purple-600"
    },
    {
      icon: <FiSearch className="w-8 h-8" />,
      value: 24,
      suffix: "/7",
      label: "Support Available",
      color: "from-pink-500 to-pink-600"
    }
  ];

  const testimonials = [
    {
      content: "JobSeek helped me land my dream job in just two weeks! The AI matching is incredibly accurate.",
      author: "Sarah Johnson",
      title: "Software Engineer at Google",
      avatar: "/avatars/sarah.jpg"
    },
    {
      content: "The one-swipe apply feature saved me countless hours of filling out applications.",
      author: "Michael Chen",
      title: "Product Manager at Meta",
      avatar: "/avatars/michael.jpg"
    },
    {
      content: "Best job searching platform I've ever used. Found a perfect match for my skills!",
      author: "Emily Rodriguez",
      title: "UX Designer at Apple",
      avatar: "/avatars/emily.jpg"
    }
  ];

  const steps = [
    {
      number: "1",
      title: "Build Your Profile",
      description: "Create a comprehensive profile showcasing your skills, experience, and career aspirations."
    },
    {
      number: "2",
      title: "Discover Opportunities",
      description: "Browse through personalized job recommendations and company profiles."
    },
    {
      number: "3",
      title: "Apply with Ease",
      description: "Submit applications with a single click using your pre-filled information."
    },
    {
      number: "4",
      title: "Track & Succeed",
      description: "Monitor your applications and receive updates on your job search progress."
    }
  ];

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white">
      {/* Animated Background */}
      <div className="animated-bg">
        {dots.map((dot, i) => (
          <motion.div
            key={i}
            className="animated-dot"
            style={{
              background: dot.color,
              left: dot.left,
              top: dot.top,
              opacity: 0.15,
            }}
            animate={{
              x: [0, dot.xOffset],
              y: [0, dot.yOffset],
            }}
            transition={{
              duration: dot.duration,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "linear",
            }}
          />
        ))}
        <div className="gradient-overlay" />
      </div>

      {/* Navigation */}
      <nav className="nav-container">
        <div className="nav-content">
          <div className="nav-items">
            <div className="logo">
              <FiBriefcase className="logo-icon" />
              <span className="logo-text">JobSeek</span>
            </div>
            <div className="nav-buttons">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => router.push("/login")}
                className="nav-button login"
              >
                Login
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => router.push("/signup")}
                className="nav-button signup"
              >
                Sign Up
              </motion.button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="hero-title"
          >
            <TypingText />
          </motion.div>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="hero-description"
          >
            Finding your dream job shouldn't be complicated. Swipe right on your future career with our AI-powered job matching platform.
          </motion.p>
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            onClick={() => router.push("/signup")}
            className="cta-button"
          >
            Get Started
            <FiArrowRight className="cta-button-icon" />
          </motion.button>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="features-grid"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
              className="feature-card"
            >
              <div className="feature-icon">
                {feature.icon}
              </div>
              <h3 className="feature-title">{feature.title}</h3>
              <p className="feature-description">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Stats Section */}
      <section className="relative py-20 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-gradient-to-b from-gray-900 to-gray-800">
          <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              Empowering Your Career Journey
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Join thousands of professionals who have already found their dream jobs through our platform
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="relative group"
              >
                <div className="absolute inset-0 bg-gradient-to-r opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl blur-xl"
                     style={{ background: `linear-gradient(to right, var(--${stat.color}-from), var(--${stat.color}-to))` }}>
                </div>
                
                <div className="relative bg-gray-800 rounded-xl p-8 border border-gray-700 hover:border-gray-600 transition-all duration-300 group-hover:transform group-hover:scale-[1.02] group-hover:shadow-2xl">
                  <div className={`inline-flex p-3 rounded-lg bg-gradient-to-r ${stat.color} bg-opacity-10 mb-4`}>
                    {stat.icon}
                  </div>
                  
                  <div className="flex items-end space-x-1 mb-2">
                    <CountUp
                      end={stat.value}
                      duration={2.5}
                      separator=","
                      className="text-4xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent"
                    />
                    <span className="text-2xl font-bold text-gray-400">{stat.suffix}</span>
                  </div>
                  
                  <p className="text-gray-400 text-lg">{stat.label}</p>
                  
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${stat.color} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 rounded-b-xl"></div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Floating Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 rounded-full bg-blue-500 opacity-20"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, -30, 0],
                opacity: [0.2, 0.5, 0.2],
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            />
          ))}
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 md:py-24 px-4 bg-gray-800/30">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-12">How It Works</h2>
          <div className="space-y-8">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="flex items-start space-x-4 bg-gray-800/50 p-6 rounded-lg border border-gray-700"
              >
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">
                  {step.number}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">{step.title}</h3>
                  <p className="text-gray-400">{step.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 md:py-24 px-4">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-12">What Our Users Say</h2>
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-gray-800/50 p-6 rounded-xl border border-gray-700"
            >
              <p className="text-gray-300 mb-6">{testimonial.content}</p>
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-gray-600 relative overflow-hidden">
                  <Image
                    src={testimonial.avatar}
                    alt={testimonial.author}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="ml-3">
                  <div className="font-medium text-white">{testimonial.author}</div>
                  <div className="text-sm text-gray-400">{testimonial.title}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-16 md:py-24 px-4 text-center bg-gradient-to-r from-blue-600/20 to-purple-600/20">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Find Your Dream Job?</h2>
          <p className="text-gray-300 mb-8">Join thousands of professionals who found their perfect career match with JobSeek</p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => router.push("/signup")}
            className="inline-flex items-center justify-center px-8 py-4 text-lg font-medium rounded-xl
                     bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700
                     transform transition-all duration-200"
          >
            Start Your Journey
            <FiArrowRight className="ml-2 w-6 h-6" />
          </motion.button>
        </div>
      </section>
    </main>
  );
}
