import { useState } from "react"
import heroBg from "@/assets/hero-bg.jpg";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import BookingSearchForm from "@/components/homePage/BookingSearchForm";
import EventBookingForm from "@/components/homePage/EventBookingForm";
import ServicesCard from "@/components/homePage/ServicesCard";
import HowItWorkEvent from "@/components/homePage/HowItWorkEvent";
import FeaturedProperties from "@/components/homePage/FeaturedProperties";
import WhyChoose from "@/components/homePage/WhyChoose";
import TestimonialForHotel from "@/components/homePage/TestimonialForHotel";
import ExploreEvent from "@/components/homePage/ExploreEvent";
import PopularVenues from "@/components/homePage/PopularVenues";
import TestimonialForEvent from "@/components/homePage/TestimonialForEvent";
import WhyChooseEvent from "@/components/homePage/WhyChooseEvent";

function HomePage() {
  const [activeForm,setActiveForm] = useState("hotel")
  return (
    <>
   <section className="relative py-8 sm:py-10 md:py-20 flex items-center justify-center overflow-hidden">
      {/* Hero Background */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url(${heroBg})`,
        }}
      >
        <div
          className="absolute inset-0 w-full"
          style={{
            background: "linear-gradient(135deg, hsl(240 16% 12% / 0.9), hsl(240 16% 12% / 0.7))"
          }}
        ></div>
      </div>

      {/* Hero Content */}
      <div className="relative z-10 w-full md:w-4/5 mx-auto px-2 sm:px-4 md:px-6 flex justify-center items-center">
        <div className="w-full">
          <h1 className="text-2xl sm:text-3xl md:text-6xl font-bold text-white mb-4 sm:mb-6 text-center md:text-left">
            Discover Local Stays &
            <br />
            Event Friendly Hotels
          </h1>
          <p className="text-base sm:text-lg text-white/90 mb-6 sm:mb-8 max-w-2xl mx-auto md:mx-0 text-center md:text-left">
            Stay, Travel, Celebrate - All in one platform
          </p>
          
          {/* CTA Buttons */}
          <div className="w-full md:w-1/2 flex flex-row justify-center md:justify-start gap-3 sm:gap-4 items-center mb-8 sm:mb-12">
            <Button
              variant="default"
              size="lg"
              className={cn(
                "flex-1 min-w-0",
                activeForm === "hotel"
                  ? "bg-primary text-white border-primary px-4 sm:px-12 py-3 sm:py-4 text-base sm:text-lg rounded-full"
                  : "bg-white text-primary border-2 hover:bg-white hover:scale-105 px-4 sm:px-12 py-3 sm:py-4 text-base sm:text-lg rounded-full"
              )}
              onClick={() => setActiveForm("hotel")}
            >
              Explore Hotels
            </Button>
            <Button
              variant="default"
              size="lg"
              className={cn(
                "flex-1 min-w-0",
                activeForm === "event"
                  ? "bg-primary text-white border-primary px-4 sm:px-12 py-3 sm:py-4 text-base sm:text-lg rounded-full"
                  : "bg-white text-primary border-2 hover:bg-white hover:scale-105 px-4 sm:px-12 py-3 sm:py-4 text-base sm:text-lg rounded-full"
              )}
              onClick={() => setActiveForm("event")}
            >
              Plan an Event
            </Button>
          </div>

          {/* Booking Search Form */}
          {activeForm === "hotel" ? <BookingSearchForm/> : <EventBookingForm/>}

        </div>
      </div>
    </section>
    {activeForm == "hotel" ? <ServicesCard /> : <HowItWorkEvent/>}
    {activeForm == "hotel" && <FeaturedProperties />}
    {activeForm == "hotel" && <WhyChoose />}
    {activeForm == "hotel" && <TestimonialForHotel />}
    {activeForm == "event" && <ExploreEvent />}
    {activeForm == "event" && <PopularVenues />}
    {activeForm == "event" && <TestimonialForEvent />}
    {activeForm == "event" && <WhyChooseEvent />}
    </>
  )
}

export default HomePage