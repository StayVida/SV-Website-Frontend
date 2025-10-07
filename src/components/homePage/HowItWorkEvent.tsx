import { Card, CardContent } from "@/components/ui/card";
import { Building,CalendarIcon,Car  } from "lucide-react";

const howItWorksData = [
  {
    icon: Building,
    heading: "Submit Event Details",
    para: "Tell us your vision and requirements",
  },
  {
    icon: Car,
    heading: "Choose your venue",
    para: "Select from our curated collection",
  },
  {
    icon: CalendarIcon,
    heading: "We Handle the Rest",
    para: "Tell us your vision and requirements",
  }
];

const HowItWorkEvent = () => {

  return (
    <section className="py-12 lg:py-20 bg-white">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="mb-8 lg:text-center lg:mb-16">
        <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-4">How It Works</h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 items-center gap-4 lg:gap-8 justify-center mx-auto">
        {howItWorksData.map((item, idx) => (
          <Card key={idx} className="text-center p-4 lg:p-8 hover:shadow-lg transition-shadow">
            <CardContent className="space-y-2 lg:space-y-4">
              <div className="w-12 h-12 lg:w-16 lg:h-16 bg-green-100 rounded-lg flex items-center justify-center mx-auto">
                <item.icon className="w-6 h-6 lg:w-8 lg:h-8 text-green-600" />
              </div>
              <h3 className="text-lg lg:text-xl font-semibold">{item.heading}</h3>
              <p className="text-sm lg:text-base text-gray-600">{item.para}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  </section>
  );
};

export default HowItWorkEvent;