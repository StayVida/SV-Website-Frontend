import { useEffect, useRef, useState, type ReactNode } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, Target, Heart, Award, Globe, Shield, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import teamsImg from "@/assets/teams.jpeg";
import companyImg from "@/assets/comapny.jpeg";

// Reusable animated container for scroll-reveal effects
function ScrollReveal({ children, className, delay = 0, direction = "up" }: { children: ReactNode, className?: string, delay?: number, direction?: "up" | "left" | "right" }) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }
    return () => observer.disconnect();
  }, []);

  const getTransform = () => {
    if (isVisible) return "translate-x-0 translate-y-0";
    if (direction === "up") return "translate-y-12";
    if (direction === "left") return "-translate-x-12";
    if (direction === "right") return "translate-x-12";
    return "";
  };

  return (
    <div
      ref={ref}
      className={cn(
        "transition-all duration-1000 ease-out",
        isVisible ? "opacity-100" : "opacity-0",
        getTransform(),
        className
      )}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

function About() {
  return (
    <div className="min-h-screen bg-neutral-50 overflow-hidden text-neutral-900">
      {/* Immersive Hero Section */}
      <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden">
        {/* Background Decorative Blobs for Modern Aesthetic */}
        <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-primary/20 rounded-full mix-blend-multiply filter blur-[100px] animate-blob" />
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-green-300/30 rounded-full mix-blend-multiply filter blur-[100px] animate-blob animation-delay-2000" />
        <div className="absolute -bottom-32 left-20 w-[600px] h-[600px] bg-emerald-200/40 rounded-full mix-blend-multiply filter blur-[120px] animate-blob animation-delay-4000" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-20">
          <ScrollReveal>
            <div className="inline-flex items-center rounded-full border border-primary/30 bg-primary/5 px-4 py-1.5 text-sm font-medium text-primary mb-6 backdrop-blur-sm">
              <span className="flex h-2 w-2 rounded-full bg-primary mr-2"></span>
              Redefining Hospitality
            </div>
          </ScrollReveal>

          <ScrollReveal delay={200}>
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8 drop-shadow-sm">
              Elevating Your <br className="hidden md:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-green-500">
                Booking Experience
              </span>
            </h1>
          </ScrollReveal>

          <ScrollReveal delay={400}>
            <p className="text-xl md:text-2xl text-neutral-600 max-w-3xl mx-auto mb-10 leading-relaxed font-light">
              We connect travelers and event organizers with the perfect accommodations and venues, blending cutting-edge technology with unparalleled service.
            </p>
          </ScrollReveal>

          <ScrollReveal delay={600}>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="rounded-full px-8 py-6 text-lg shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all" onClick={() => window.location.href = '/hotels'}>
                Explore Hotels
              </Button>
              <Button size="lg" variant="outline" className="rounded-full px-8 py-6 text-lg border-2 hover:bg-neutral-100 transition-all" onClick={() => window.location.href = '/events'}>
                Discover Venues
              </Button>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Our Story Section with Parallax-like Image */}
      <section className="py-24 bg-white relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <ScrollReveal direction="left">
              <div className="relative group">
                <div className="absolute -inset-4 bg-gradient-to-tr from-primary/30 to-green-200 rounded-3xl blur-xl opacity-50 group-hover:opacity-70 transition duration-500"></div>
                <div className="relative rounded-2xl overflow-hidden shadow-2xl ring-1 ring-black/5">
                  <img
                    src={companyImg}
                    alt="Our Company Story"
                    className="w-full h-[500px] object-cover transform hover:scale-105 transition duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                  <div className="absolute bottom-8 left-8 text-white">
                    <p className="font-semibold text-lg drop-shadow-md">Established 2020</p>
                    <p className="text-sm opacity-90 drop-shadow-md">Building memories worldwide</p>
                  </div>
                </div>
              </div>
            </ScrollReveal>

            <div>
              <ScrollReveal direction="right" delay={100}>
                <h2 className="text-4xl font-bold mb-6">The Journey Began With a Simple Idea</h2>
              </ScrollReveal>
              <ScrollReveal direction="right" delay={200}>
                <p className="text-lg text-neutral-600 mb-6 leading-relaxed">
                  Founded by a team of hospitality enthusiasts and tech innovators, SV Website was born from the realization that finding the perfect venue or accommodation should be as joyous as the event itself.
                </p>
              </ScrollReveal>
              <ScrollReveal direction="right" delay={300}>
                <p className="text-lg text-neutral-600 mb-8 leading-relaxed">
                  We've grown from a small startup into a globally recognized platform. By continuously refining our technology and listening to our community, we ensure that every click brings you closer to an unforgettable experience.
                </p>
              </ScrollReveal>

              <ScrollReveal direction="right" delay={400}>
                <div className="grid grid-cols-2 gap-6 mt-8 p-6 bg-neutral-50 rounded-2xl border border-neutral-100">
                  <div>
                    <h4 className="text-4xl font-black text-primary mb-2">50K+</h4>
                    <p className="text-sm text-neutral-600 font-medium tracking-wide uppercase">Happy Customers</p>
                  </div>
                  <div>
                    <h4 className="text-4xl font-black text-primary mb-2">1.2K</h4>
                    <p className="text-sm text-neutral-600 font-medium tracking-wide uppercase">Premium Venues</p>
                  </div>
                </div>
              </ScrollReveal>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values Section - Glassmorphism */}
      <section className="py-24 bg-neutral-900 text-white relative overflow-hidden">
        {/* Abstract background elements */}
        <div className="absolute top-0 right-[-10%] w-1/2 h-full bg-gradient-to-b from-primary/20 to-transparent blur-3xl opacity-50 transform -skew-x-12"></div>
        <div className="absolute bottom-0 left-[-10%] w-1/3 h-1/2 bg-gradient-to-t from-green-600/20 to-transparent blur-3xl opacity-40 transform skew-x-12"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <ScrollReveal>
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-6">Principles That Guide Us</h2>
              <p className="text-xl text-neutral-400 max-w-2xl mx-auto font-light">
                Our core values aren't just words on a page; they're the standard by which we measure every interaction and innovation.
              </p>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { icon: Shield, title: "Trust & Reliability", desc: "We build lasting relationships through transparency and dependable service you can count on." },
              { icon: Users, title: "Customer First", desc: "Every feature and decision is centered around enhancing your booking experience." },
              { icon: Award, title: "Excellence", desc: "We continually raise the bar, striving for perfection in technology and support." },
              { icon: Globe, title: "Innovation", desc: "Embracing new technologies to stay ahead of trends and exceed expectations." },
              { icon: Heart, title: "Passion", desc: "Our enthusiasm for travel and events shines through in every detail of our platform." },
              { icon: Target, title: "Integrity", desc: "Operating with unyielding ethical standards to ensure fairness in all partnerships." }
            ].map((value, idx) => (
              <ScrollReveal key={idx} delay={idx * 100}>
                <div className="group h-full bg-white/5 backdrop-blur-lg border border-white/10 p-8 rounded-3xl hover:bg-white/10 transition-all duration-300 hover:-translate-y-2">
                  <div className="w-14 h-14 bg-gradient-to-br from-primary to-green-500 rounded-2xl flex items-center justify-center mb-6 shadow-lg transform group-hover:rotate-6 transition-transform">
                    <value.icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-2xl font-semibold mb-3">{value.title}</h3>
                  <p className="text-neutral-400 leading-relaxed">
                    {value.desc}
                  </p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Meet the Team Section with Bold Split Layout */}
      <section className="py-24 bg-neutral-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-5 order-2 lg:order-1">
              <ScrollReveal direction="left">
                <h2 className="text-4xl md:text-5xl font-bold mb-6">The Minds Behind the Magic</h2>
                <p className="text-lg text-neutral-600 mb-8 leading-relaxed">
                  Our diverse team of engineers, designers, and hospitality experts share a unified goal: creating flawless, intuitive experiences for our users worldwide. We foster a culture of creativity, empathy, and relentless pursuit of quality.
                </p>
                <ul className="space-y-4 mb-8">
                  <li className="flex items-center text-neutral-700">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mr-4">
                      <ChevronRight className="w-4 h-4 text-primary" />
                    </div>
                    <span className="font-medium text-lg">Innovative Thinkers</span>
                  </li>
                  <li className="flex items-center text-neutral-700">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mr-4">
                      <ChevronRight className="w-4 h-4 text-primary" />
                    </div>
                    <span className="font-medium text-lg">Industry Veterans</span>
                  </li>
                  <li className="flex items-center text-neutral-700">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mr-4">
                      <ChevronRight className="w-4 h-4 text-primary" />
                    </div>
                    <span className="font-medium text-lg">Passionate Creators</span>
                  </li>
                </ul>
              </ScrollReveal>
            </div>

            <div className="lg:col-span-7 order-1 lg:order-2">
              <ScrollReveal direction="right">
                <div className="relative rounded-3xl overflow-hidden shadow-2xl">
                  <div className="absolute inset-0 bg-primary/20 mix-blend-overlay z-10 transition-opacity duration-500 hover:opacity-0"></div>
                  <img
                    src={teamsImg}
                    alt="Our Team"
                    className="w-full h-[600px] object-cover scale-105 hover:scale-100 transition-transform duration-1000 ease-out"
                  />
                  {/* Floating stat card over image */}
                  <div className="absolute bottom-8 right-8 z-20 bg-white/90 backdrop-blur-md p-6 rounded-2xl shadow-xl border border-white max-w-[250px]">
                    <div className="flex items-center mb-2">
                      <Users className="w-6 h-6 text-primary mr-3" />
                      <span className="text-2xl font-bold">150+</span>
                    </div>
                    <p className="text-sm text-neutral-600 font-medium">Dedicated professionals working across 5 global offices.</p>
                  </div>
                </div>
              </ScrollReveal>
            </div>
          </div>
        </div>
      </section>

      {/* Modern High-Impact CTA */}
      <section className="relative py-32 bg-primary overflow-hidden">
        {/* Animated geometric background patterns */}
        <div className="absolute top-0 left-0 w-full h-full opacity-10">
          <div className="absolute w-[40rem] h-[40rem] border border-white rounded-full -top-64 -left-64"></div>
          <div className="absolute w-[50rem] h-[50rem] border border-white rounded-full -bottom-64 -right-64"></div>
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <ScrollReveal>
            <h2 className="text-4xl md:text-6xl font-bold text-white mb-8 tracking-tight">
              Ready to Experience the Difference?
            </h2>
            <p className="text-xl md:text-2xl text-white/90 mb-12 font-light">
              Join thousands of satisfied customers who trust SV Website for their perfect stay and flawless events.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Button
                variant="secondary"
                size="lg"
                className="rounded-full px-10 py-7 text-lg font-semibold shadow-2xl hover:scale-105 transition-transform bg-white text-primary hover:bg-neutral-50"
                onClick={() => window.location.href = '/hotels'}
              >
                Plan Your Stay
              </Button>
              <Button
                variant="secondary"
                size="lg"
                className="rounded-full px-10 py-7 text-lg font-semibold shadow-2xl hover:scale-105 transition-transform bg-white text-primary hover:bg-neutral-50"
                onClick={() => window.location.href = '/events'}
              >
                Book a Venue
              </Button>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </div>
  );
}

export default About;
