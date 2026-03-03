import { useState, useEffect } from "react";
import { Star } from "lucide-react"
import { Card, CardContent, } from "@/components/ui/card"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { useQuery } from "@tanstack/react-query";
import { getHotelRatings } from "@/api/hotelsApi";

function TestimonialForHotel() {
  const { data, isLoading } = useQuery({
    queryKey: ["homepageTestimonials"],
    queryFn: () => getHotelRatings(),
  });

  const testimonials = data?.ratings || [];

  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (testimonials.length <= 1) return;
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % testimonials.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [testimonials.length]);

  if (isLoading || !testimonials || testimonials.length === 0) return null;

  return (
    <section className="py-12 lg:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 lg:mb-16">
          <div className="flex justify-center items-center mb-4 lg:hidden">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star key={star} className="w-5 h-5 fill-yellow-400 text-yellow-400 mx-0.5" />
            ))}
          </div>
          <h2 className="text-2xl lg:text-3xl font-bold text-gray-900">What Our Guests Say</h2>
          <div className="hidden lg:flex justify-center items-center mt-4">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star key={star} className="w-6 h-6 fill-yellow-400 text-yellow-400 mx-1" />
            ))}
          </div>
        </div>

        {/* Mobile slider */}
        <div className="block lg:hidden">
          <div className="relative w-full overflow-hidden">
            <div
              className="flex transition-transform duration-700 ease-in-out"
              style={{ transform: `translateX(-${current * 100}%)` }}
            >
              {testimonials.map((testimonial, index) => (
                <div key={index} className="min-w-full px-2">
                  <Card className="p-4">
                    <CardContent className="space-y-4">
                      <div className="flex items-center space-x-3">
                        <Avatar className="w-10 h-10">
                          <AvatarImage src="/placeholder.svg?height=40&width=40" />
                          <AvatarFallback>
                            {testimonial.user_Name
                              ? testimonial.user_Name.split(" ").map((n) => n[0]).join("")
                              : "U"}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h4 className="font-semibold text-sm">{testimonial.user_Name || `User #${testimonial.user_ID}`}</h4>
                          <p className="text-xs text-gray-600">Verified Booking</p>
                        </div>
                      </div>
                      <div className="flex items-center mb-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star key={star} className={`w-4 h-4 ${star <= Math.floor(testimonial.rating_Value) ? "fill-yellow-400 text-yellow-400" : "text-gray-200"}`} />
                        ))}
                      </div>
                      <p className="text-sm text-gray-700">{testimonial.comment || "Amazing experience!"}</p>
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
        <div className="hidden lg:grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {testimonials.slice(0, 3).map((testimonial, index) => (
            <Card key={index} className="p-4 lg:p-6">
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Avatar className="w-12 h-12">
                    <AvatarImage src="/placeholder.svg?height=40&width=40" />
                    <AvatarFallback>
                      {testimonial.user_Name
                        ? testimonial.user_Name.split(" ").map((n) => n[0]).join("")
                        : "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h4 className="font-semibold text-base">{testimonial.user_Name || `User #${testimonial.user_ID}`}</h4>
                    <p className="text-sm text-gray-600">Verified Booking</p>
                  </div>
                </div>
                <div className="flex items-center mb-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} className={`w-4 h-4 ${star <= Math.floor(testimonial.rating_Value) ? "fill-yellow-400 text-yellow-400" : "text-gray-200"}`} />
                  ))}
                </div>
                <p className="text-base text-gray-700">{testimonial.comment || "Amazing experience!"}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

export default TestimonialForHotel
