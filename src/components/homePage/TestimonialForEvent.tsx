import { useState, useEffect } from "react";
import { Card,CardContent } from "@/components/ui/card"
import { Avatar,AvatarImage,AvatarFallback } from "@/components/ui/avatar"
import { Star } from "lucide-react"

function TestimonialForEvent() {
  const testimonials = [
    {
      name: "Sarah Johnson",
      event: "Wedding Event",
      review:
        "StayVida made our dream wedding come true. The attention to detail and professional service exceeded our expectations.",
      avatar: "SJ",
    },
    {
      name: "Michael Chen",
      event: "Corporate Event",
      review:
        "Outstanding event management! Our corporate conference was flawlessly executed. Highly recommend their services.",
      avatar: "MC",
    },
    {
      name: "Emily Davis",
      event: "Birthday Party",
      review:
        "Amazing experience from start to finish. The team handled everything perfectly and made our celebration memorable.",
      avatar: "ED",
    },
  ];

  const [current, setCurrent] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % testimonials.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [testimonials.length]);

  return (
    <section className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900">What Our Clients Say</h2>
        </div>

        {/* Mobile slider */}
        <div className="block md:hidden">
          <div className="relative w-full overflow-hidden">
            <div
              className="flex transition-transform duration-700 ease-in-out"
              style={{ transform: `translateX(-${current * 100}%)` }}
            >
              {testimonials.map((testimonial, index) => (
                <div key={index} className="min-w-full px-2">
                  <Card className="p-6">
                    <CardContent className="space-y-4">
                      <div className="flex items-center space-x-4">
                        <Avatar className="w-12 h-12">
                          <AvatarImage src="/placeholder.svg?height=48&width=48" />
                          <AvatarFallback>{testimonial.avatar}</AvatarFallback>
                        </Avatar>
                        <div>
                          <h4 className="font-semibold">{testimonial.name}</h4>
                          <p className="text-sm text-gray-600">{testimonial.event}</p>
                        </div>
                      </div>
                      <div className="flex items-center mb-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star key={star} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        ))}
                      </div>
                      <p className="text-gray-700">{testimonial.review}</p>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          </div>
          {/* Dots */}
          <div className="flex justify-center mt-4 gap-2">
            {testimonials.map((_, idx) => (
              <button
                key={idx}
                className={`w-2 h-2 rounded-full ${current === idx ? "bg-primary" : "bg-gray-300"}`}
                onClick={() => setCurrent(idx)}
                aria-label={`Go to testimonial ${idx + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Grid for desktop */}
        <div className="hidden md:grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="p-6">
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-4">
                  <Avatar className="w-12 h-12">
                    <AvatarImage src="/placeholder.svg?height=48&width=48" />
                    <AvatarFallback>{testimonial.avatar}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h4 className="font-semibold">{testimonial.name}</h4>
                    <p className="text-sm text-gray-600">{testimonial.event}</p>
                  </div>
                </div>
                <div className="flex items-center mb-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-700">{testimonial.review}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

export default TestimonialForEvent