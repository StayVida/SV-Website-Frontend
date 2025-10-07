import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, Target, Heart, Award, Globe, Shield } from "lucide-react";

function About() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              About SV Website
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Your trusted partner for seamless hotel bookings and memorable event planning. 
              We connect travelers and event organizers with the perfect accommodations and venues.
            </p>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="flex items-center mb-6">
                <Target className="w-8 h-8 text-primary mr-3" />
                <h2 className="text-3xl font-bold text-gray-900">Our Mission</h2>
              </div>
              <p className="text-lg text-gray-600 mb-6">
                To revolutionize the hospitality industry by providing a comprehensive platform 
                that seamlessly connects travelers with exceptional accommodations and event 
                organizers with perfect venues. We strive to make every stay and event 
                unforgettable through personalized service and cutting-edge technology.
              </p>
              <div className="flex items-center mb-6">
                <Heart className="w-8 h-8 text-primary mr-3" />
                <h2 className="text-3xl font-bold text-gray-900">Our Vision</h2>
              </div>
              <p className="text-lg text-gray-600">
                To become the leading global platform for hotel bookings and event planning, 
                recognized for our innovation, reliability, and commitment to creating 
                exceptional experiences for our customers worldwide.
              </p>
            </div>
            <div className="relative">
              <div className="bg-gradient-to-br from-primary/20 to-primary/5 rounded-2xl p-8">
                <img
                  src="/images/about-hero.jpg"
                  alt="Our team"
                  className="w-full h-96 object-cover rounded-xl"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "/placeholder.svg";
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Our Core Values
            </h2>
            <p className="text-xl text-gray-600">
              The principles that guide everything we do
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="text-center p-6 hover:shadow-lg transition-shadow">
              <CardContent className="p-0">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Trust & Reliability</h3>
                <p className="text-gray-600">
                  We build lasting relationships through transparency, security, and 
                  dependable service that our customers can count on.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center p-6 hover:shadow-lg transition-shadow">
              <CardContent className="p-0">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Customer First</h3>
                <p className="text-gray-600">
                  Every decision we make is centered around providing the best possible 
                  experience for our customers and partners.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center p-6 hover:shadow-lg transition-shadow">
              <CardContent className="p-0">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Award className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Excellence</h3>
                <p className="text-gray-600">
                  We continuously strive for excellence in everything we do, from 
                  technology innovation to customer service.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center p-6 hover:shadow-lg transition-shadow">
              <CardContent className="p-0">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Globe className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Innovation</h3>
                <p className="text-gray-600">
                  We embrace new technologies and creative solutions to stay ahead 
                  of industry trends and meet evolving customer needs.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center p-6 hover:shadow-lg transition-shadow">
              <CardContent className="p-0">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Heart className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Passion</h3>
                <p className="text-gray-600">
                  Our team is passionate about travel and events, bringing that 
                  enthusiasm to every interaction and service we provide.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center p-6 hover:shadow-lg transition-shadow">
              <CardContent className="p-0">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Target className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Integrity</h3>
                <p className="text-gray-600">
                  We conduct business with the highest ethical standards, ensuring 
                  fairness and honesty in all our partnerships and transactions.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Story */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="relative">
              <div className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-2xl p-8">
                <img
                  src="/images/company-story.jpg"
                  alt="Company story"
                  className="w-full h-96 object-cover rounded-xl"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "/placeholder.svg";
                  }}
                />
              </div>
            </div>
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Our Story
              </h2>
              <p className="text-lg text-gray-600 mb-6">
                Founded in 2020, SV Website began as a vision to simplify the complex 
                world of hotel bookings and event planning. Our founders, experienced 
                in both hospitality and technology, recognized the need for a platform 
                that could seamlessly connect travelers and event organizers with the 
                perfect accommodations and venues.
              </p>
              <p className="text-lg text-gray-600 mb-6">
                Starting with a small team of passionate individuals, we've grown into 
                a trusted platform serving thousands of customers worldwide. Our journey 
                has been marked by continuous innovation, strategic partnerships, and 
                an unwavering commitment to customer satisfaction.
              </p>
              <p className="text-lg text-gray-600">
                Today, we're proud to offer a comprehensive solution that combines 
                cutting-edge technology with personalized service, making every stay 
                and event planning experience exceptional.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Meet Our Team
            </h2>
            <p className="text-xl text-gray-600">
              The passionate people behind SV Website
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="text-center p-6 hover:shadow-lg transition-shadow">
              <CardContent className="p-0">
                <div className="w-32 h-32 bg-primary/10 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <Users className="w-16 h-16 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Development Team</h3>
                <p className="text-gray-600 mb-4">
                  Our skilled developers work tirelessly to create innovative solutions 
                  and maintain our platform's reliability.
                </p>
                <div className="text-sm text-gray-500">15+ Members</div>
              </CardContent>
            </Card>

            <Card className="text-center p-6 hover:shadow-lg transition-shadow">
              <CardContent className="p-0">
                <div className="w-32 h-32 bg-primary/10 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <Heart className="w-16 h-16 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Customer Support</h3>
                <p className="text-gray-600 mb-4">
                  Our dedicated support team ensures every customer receives 
                  personalized assistance and prompt resolution.
                </p>
                <div className="text-sm text-gray-500">12+ Members</div>
              </CardContent>
            </Card>

            <Card className="text-center p-6 hover:shadow-lg transition-shadow">
              <CardContent className="p-0">
                <div className="w-32 h-32 bg-primary/10 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <Award className="w-16 h-16 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Business Team</h3>
                <p className="text-gray-600 mb-4">
                  Our business development and partnership teams work to expand 
                  our network and improve our offerings.
                </p>
                <div className="text-sm text-gray-500">8+ Members</div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Experience the Difference?
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Join thousands of satisfied customers who trust SV Website for their 
            hotel bookings and event planning needs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              variant="secondary" 
              size="lg" 
              className="px-8 py-3"
              onClick={() => window.location.href = '/hotels'}
            >
              Explore Hotels
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              className="px-8 py-3 border-white text-white hover:bg-white hover:text-primary"
              onClick={() => window.location.href = '/events'}
            >
              Plan an Event
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}

export default About;
