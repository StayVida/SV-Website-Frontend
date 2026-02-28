import { Card } from "@/components/ui/card";
import { Heart, Calendar, Building, Users, Star } from "lucide-react";
import weddingImg from "@/assets/wedding.jpeg";
import birthdayImg from "@/assets/birthday_event.jpeg";
import corporateImg from "@/assets/corprate_event.jpeg";
import privateImg from "@/assets/private_event.jpeg";
import engagementImg from "@/assets/engagement_event.jpeg";

function ExploreEvent() {
  return (
    <section className="py-6 md:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Explore Event Types
          </h2>
        </div>

        <div className="grid items-center grid-cols-2 md:grid-cols-5 gap-6 justify-center mx-auto max-w-5xl">
          <Card className="relative overflow-hidden group cursor-pointer hover:shadow-lg transition-shadow">
            <div className="relative h-48">
              <img
                src={weddingImg}
                alt="Weddings"
                className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors transition-opacity duration-300 opacity-100 group-hover:opacity-0" />
              <div className="absolute inset-0 flex flex-col items-center justify-center text-white transition-opacity duration-300 opacity-100 group-hover:opacity-0">
                <Heart className="w-8 h-8 mb-2" />
                <span className="font-semibold text-lg">Weddings</span>
              </div>
            </div>
          </Card>

          <Card className="relative overflow-hidden group cursor-pointer hover:shadow-lg transition-shadow">
            <div className="relative h-48">
              <img
                src={birthdayImg}
                alt="Birthdays"
                className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110 "
              />
              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors transition-opacity duration-300 opacity-100 group-hover:opacity-0" />
              <div className="absolute inset-0 flex flex-col items-center justify-center text-white transition-opacity duration-300 opacity-100 group-hover:opacity-0">
                <Calendar className="w-8 h-8 mb-2" />
                <span className="font-semibold text-lg">Birthdays</span>
              </div>
            </div>
          </Card>

          <Card className="relative overflow-hidden group cursor-pointer hover:shadow-lg transition-shadow">
            <div className="relative h-48">
              <img
                src={corporateImg}
                alt="Corporate Events"
                className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors transition-opacity duration-300 opacity-100 group-hover:opacity-0" />
              <div className="absolute inset-0 flex flex-col items-center justify-center text-white transition-opacity duration-300 opacity-100 group-hover:opacity-0">
                <Building className="w-8 h-8 mb-2" />
                <span className="font-semibold text-lg">Corporate Events</span>
              </div>
            </div>
          </Card>

          <Card className="relative overflow-hidden group cursor-pointer hover:shadow-lg transition-shadow">
            <div className="relative h-48">
              <img
                src={privateImg}
                alt="Private Parties"
                className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors transition-opacity duration-300 opacity-100 group-hover:opacity-0" />
              <div className="absolute inset-0 flex flex-col items-center justify-center text-white transition-opacity duration-300 opacity-100 group-hover:opacity-0">
                <Users className="w-8 h-8 mb-2" />
                <span className="font-semibold text-lg">Private Parties</span>
              </div>
            </div>
          </Card>

          <Card className="relative overflow-hidden group cursor-pointer hover:shadow-lg transition-shadow">
            <div className="relative h-48">
              <img
                src={engagementImg}
                alt="Engagements"
                className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors transition-opacity duration-300 opacity-100 group-hover:opacity-0" />
              <div className="absolute inset-0 flex flex-col items-center justify-center text-white transition-opacity duration-300 opacity-100 group-hover:opacity-0">
                <Star className="w-8 h-8 mb-2" />
                <span className="font-semibold text-lg">Engagements</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
}

export default ExploreEvent;
