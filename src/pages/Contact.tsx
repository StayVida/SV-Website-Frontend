import { useState, useEffect, useRef, type ReactNode } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  Send,
  CheckCircle,
  HelpCircle,
  MessageSquare
} from "lucide-react";
import { cn } from "@/lib/utils";
import { API_BASE_URI, API_ENDPOINTS } from "@/config/api";

// Reusable animated container for scroll-reveal effects
function ScrollReveal({ children, className, delay = 0, direction = "up" }: { children: ReactNode, className?: string, delay?: number, direction?: "up" | "left" | "right" | "fade" }) {
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
    if (isVisible) return "translate-x-0 translate-y-0 scale-100";
    if (direction === "up") return "translate-y-12";
    if (direction === "left") return "-translate-x-12";
    if (direction === "right") return "translate-x-12";
    if (direction === "fade") return "scale-95";
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

function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "+91 ",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);

    const payload = {
      fullName: formData.name,
      email: formData.email,
      phoneNumber: formData.phone,
      subject: formData.subject,
      message: formData.message,
    };

    try {
      const response = await fetch(
        `${API_BASE_URI}${API_ENDPOINTS.CONTACT_SUBMIT}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-api-key": import.meta.env.VITE_X_API_KEY,
          },
          body: JSON.stringify(payload),
        }
      );

      const result = await response.json().catch(() => null);

      if (!response.ok || result?.status !== "success") {
        const message =
          result?.message || "Failed to submit contact form. Please try again.";
        throw new Error(message);
      }

      setIsSubmitted(true);
      // Reset form after 4 seconds
      setTimeout(() => {
        setIsSubmitted(false);
        setFormData({
          name: "",
          email: "",
          phone: "+91 ",
          subject: "",
          message: "",
        });
      }, 4000);
    } catch (error: any) {
      setSubmitError(error?.message || "An unexpected error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50 overflow-hidden text-neutral-900">

      {/* Immersive Hero Section */}
      <section className="relative pt-10 pb-20 lg:pt-32 lg:pb-32 flex items-center justify-center overflow-hidden bg-white">
        {/* Animated Background Blobs */}
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-primary/20 rounded-full mix-blend-multiply filter blur-[100px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-green-300/30 rounded-full mix-blend-multiply filter blur-[120px] animate-pulse" style={{ animationDelay: '2s' }} />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <ScrollReveal>
            <div className="inline-flex items-center rounded-full border border-primary/30 bg-primary/5 px-4 py-1.5 text-sm font-medium text-primary mb-6 backdrop-blur-sm">
              <MessageSquare className="w-4 h-4 mr-2" />
              We're Here to Help
            </div>
          </ScrollReveal>

          <ScrollReveal delay={200}>
            <h1 className="text-4xl md:text-5xl lg:text-7xl font-extrabold tracking-tight mb-6 drop-shadow-sm">
              Get in <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-green-500">Touch</span>
            </h1>
          </ScrollReveal>

          <ScrollReveal delay={400}>
            <p className="text-lg md:text-xl lg:text-2xl text-neutral-600 max-w-3xl mx-auto leading-relaxed font-light px-4 md:px-0">
              Whether you have a question about bookings, partnerships, or need assistance, our team is ready to respond.
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* Modern Contact Info Cards - Negative Margin to pull them up */}
      <section className="relative z-20 -mt-6 lg:-mt-16 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Phone, title: "Phone", details: ["+1 (555) 123-4567", "+1 (555) 987-6543"], color: "from-blue-500 to-cyan-400" },
              { icon: Mail, title: "Email", details: ["info@svwebsite.com", "support@svwebsite.com"], color: "from-primary to-green-500" },
              { icon: MapPin, title: "Address", details: ["123 Business Street", "Suite 100, City 12345"], color: "from-purple-500 to-pink-500" },
              { icon: Clock, title: "Hours", details: ["Mon-Fri: 9AM - 6PM", "Sat-Sun: 10AM - 4PM"], color: "from-amber-500 to-orange-500" }
            ].map((info, idx) => (
              <ScrollReveal delay={idx * 150} key={idx} direction="up">
                <Card className="group h-full bg-white/80 backdrop-blur-xl border-white/40 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 overflow-hidden relative rounded-3xl">
                  {/* Subtle hover gradient background */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${info.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500`} />

                  <CardContent className="p-8 text-center relative z-10 flex flex-col h-full justify-center">
                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${info.color} flex items-center justify-center mx-auto mb-6 shadow-lg shadow-black/5 transform group-hover:rotate-6 transition-transform duration-300`}>
                      <info.icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-neutral-900 mb-4">{info.title}</h3>
                    {info.details.map((text, i) => (
                      <p key={i} className="text-neutral-600 font-medium text-[15px]">{text}</p>
                    ))}
                  </CardContent>
                </Card>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form & Premium FAQ */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">

            {/* Left: Contact Form */}
            <div className="lg:col-span-7">
              <ScrollReveal direction="left">
                <div className="mb-10">
                  <h2 className="text-4xl font-bold text-neutral-900 mb-4">
                    Send us a Message
                  </h2>
                  <p className="text-lg text-neutral-500 leading-relaxed max-w-xl">
                    Fill out the form below and we'll get back to you within 24 hours. Your inquiries are important to us.
                  </p>
                </div>

                <div className="relative">
                  {/* Background decoration for form */}
                  <div className="absolute -inset-4 bg-gradient-to-tr from-primary/5 to-neutral-100 rounded-[2.5rem] -z-10" />

                  <Card className="border-0 shadow-2xl rounded-3xl overflow-hidden bg-white/70 backdrop-blur-md">
                    <CardContent className="p-6 md:p-12">
                      {isSubmitted ? (
                        <div className="text-center py-16 animate-in zoom-in duration-500">
                          <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <CheckCircle className="w-12 h-12 text-green-500" />
                          </div>
                          <h3 className="text-3xl font-bold text-neutral-900 mb-4">
                            Message Sent!
                          </h3>
                          <p className="text-lg text-neutral-600">
                            Thank you for reaching out. A confirmation email has been sent, and we'll be in touch shortly.
                          </p>
                        </div>
                      ) : (
                        <form onSubmit={handleSubmit} className="space-y-8">
                          {submitError && (
                            <div className="p-4 rounded-xl bg-red-50 border border-red-100 text-red-700 text-sm flex items-start">
                              <HelpCircle className="w-5 h-5 mr-3 shrink-0 mt-0.5" />
                              <span>{submitError}</span>
                            </div>
                          )}

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                            <div className="space-y-3">
                              <Label htmlFor="name" className="text-sm font-semibold text-neutral-700 uppercase tracking-wider">
                                Full Name <span className="text-primary">*</span>
                              </Label>
                              <Input
                                id="name"
                                name="name"
                                type="text"
                                required
                                value={formData.name}
                                onChange={handleInputChange}
                                placeholder="John Doe"
                                className="h-14 bg-neutral-50/50 border-neutral-200 focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-lg rounded-xl"
                              />
                            </div>
                            <div className="space-y-3">
                              <Label htmlFor="email" className="text-sm font-semibold text-neutral-700 uppercase tracking-wider">
                                Email Address <span className="text-primary">*</span>
                              </Label>
                              <Input
                                id="email"
                                name="email"
                                type="email"
                                required
                                value={formData.email}
                                onChange={handleInputChange}
                                placeholder="john@example.com"
                                className="h-14 bg-neutral-50/50 border-neutral-200 focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-lg rounded-xl"
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                            <div className="space-y-3">
                              <Label htmlFor="phone" className="text-sm font-semibold text-neutral-700 uppercase tracking-wider">
                                Phone Number
                              </Label>
                              <Input
                                id="phone"
                                name="phone"
                                type="tel"
                                value={formData.phone}
                                onChange={handleInputChange}
                                placeholder="+1 (555) 123-4567"
                                className="h-14 bg-neutral-50/50 border-neutral-200 focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-lg rounded-xl"
                              />
                            </div>
                            <div className="space-y-3">
                              <Label htmlFor="subject" className="text-sm font-semibold text-neutral-700 uppercase tracking-wider">
                                Subject <span className="text-primary">*</span>
                              </Label>
                              <Input
                                id="subject"
                                name="subject"
                                type="text"
                                required
                                value={formData.subject}
                                onChange={handleInputChange}
                                placeholder="How can we help?"
                                className="h-14 bg-neutral-50/50 border-neutral-200 focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-lg rounded-xl"
                              />
                            </div>
                          </div>

                          <div className="space-y-3">
                            <Label htmlFor="message" className="text-sm font-semibold text-neutral-700 uppercase tracking-wider">
                              Message <span className="text-primary">*</span>
                            </Label>
                            <textarea
                              id="message"
                              name="message"
                              required
                              rows={5}
                              value={formData.message}
                              onChange={handleInputChange}
                              placeholder="Tell us everything we need to know..."
                              className="w-full px-4 py-4 bg-neutral-50/50 border border-neutral-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-lg resize-none"
                            />
                          </div>

                          <Button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full h-14 text-lg font-bold rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all"
                          >
                            {isSubmitting ? (
                              <div className="flex items-center">
                                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                                Sending Message...
                              </div>
                            ) : (
                              <div className="flex items-center">
                                <Send className="w-5 h-5 mr-3" />
                                Send Message
                              </div>
                            )}
                          </Button>
                        </form>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </ScrollReveal>
            </div>

            {/* Right: Premium FAQ */}
            <div className="lg:col-span-5 space-y-8 lg:pt-8">
              <ScrollReveal direction="right">
                <h3 className="text-3xl font-bold text-neutral-900 mb-8 flex items-center">
                  <HelpCircle className="w-8 h-8 text-primary mr-3" />
                  Common Questions
                </h3>

                <div className="space-y-6">
                  {[
                    { q: "How quickly do you respond?", a: "We prioritize swift communication. You can expect a detailed response within 24 hours during standard business days." },
                    { q: "Is 24/7 support available?", a: "Yes, our dedicated success team monitors the hotline 24/7 specifically for urgent booking modifications and critical assistance." },
                    { q: "Can we schedule a consultation?", a: "Absolutely. Mention your preferred timezone and availability within your message, and we'll gladly coordinate a direct call or virtual meeting." }
                  ].map((faq, i) => (
                    <div key={i} className="group p-6 rounded-2xl bg-neutral-50 hover:bg-primary/5 border border-transparent hover:border-primary/20 transition-all duration-300">
                      <h4 className="text-lg font-bold text-neutral-900 mb-3 group-hover:text-primary transition-colors">
                        {faq.q}
                      </h4>
                      <p className="text-neutral-600 leading-relaxed font-light text-[15px]">
                        {faq.a}
                      </p>
                    </div>
                  ))}
                </div>
              </ScrollReveal>
            </div>

          </div>
        </div>
      </section>

      {/* High-Impact Emergency CTA */}
      <section className="relative py-24 bg-neutral-900 overflow-hidden text-center z-10">
        <div className="absolute inset-0 w-full h-full opacity-10 pointer-events-none">
          <div className="absolute w-[80rem] h-[80rem] border border-white/20 rounded-full top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 mix-blend-overlay"></div>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20">
          <ScrollReveal direction="up">
            <div className="w-20 h-20 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center mx-auto mb-8 border border-white/20">
              <Phone className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6 tracking-tight">
              Need Immediate Assistance?
            </h2>
            <p className="text-lg md:text-xl text-neutral-400 mb-10 max-w-2xl mx-auto font-light px-4 md:px-0">
              For urgent booking modifications or emergency venue support, our hotline bypasses the queue.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 md:gap-6 justify-center">
              <Button
                variant="secondary"
                size="lg"
                className="rounded-full px-10 py-7 text-lg font-bold shadow-2xl hover:scale-105 transition-transform bg-white text-neutral-900 hover:bg-neutral-100"
                onClick={() => window.open('tel:+15551234567')}
              >
                Call Hotline Now
              </Button>
              <Button
                variant="secondary"
                size="lg"
                className="rounded-full px-10 py-7 text-lg font-bold shadow-2xl hover:scale-105 transition-transform bg-white text-neutral-900 hover:bg-neutral-100"
                onClick={() => window.location.href = '/hotels'}
              >
                Return to Bookings
              </Button>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </div>
  );
}

export default Contact;
