import { useState, useEffect } from "react"
import { Calendar, Users, Baby } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useNavigate } from "react-router-dom"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

interface SearchData {
  destination: string
  checkIn: string
  checkOut: string
  adults: string
  children: string
}

// Utility to format yyyy-mm-dd to dd/mm/yyyy
function formatDateDMY(dateStr: string) {
  if (!dateStr) return "";
  if (dateStr.includes("-")) {
    const [year, month, day] = dateStr.split("-");
    if (!year || !month || !day) return dateStr;
    return `${day}/${month}/${year}`;
  }
  return dateStr;
}

const parseToISODate = (dateStr: string) => {
  if (!dateStr) return "";
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return dateStr;
  try {
    const parts = dateStr.trim().split(' ');
    if (parts.length >= 2) {
      const day = parseInt(parts[0], 10);
      const monthStr = parts[1].toLowerCase();
      const monthMap: Record<string, number> = {
        'jan': 0, 'feb': 1, 'mar': 2, 'apr': 3, 'may': 4, 'jun': 5,
        'jul': 6, 'aug': 7, 'sep': 8, 'oct': 9, 'nov': 10, 'dec': 11
      };
      const month = monthMap[monthStr.substring(0, 3)];
      if (month !== undefined && !isNaN(day)) {
        const d = new Date();
        d.setMonth(month);
        d.setDate(day);
        if (d < new Date(new Date().setHours(0, 0, 0, 0))) { // past date
          d.setFullYear(d.getFullYear() + 1);
        }
        const yyyy = d.getFullYear();
        const mm = String(d.getMonth() + 1).padStart(2, '0');
        const dd = String(d.getDate()).padStart(2, '0');
        return `${yyyy}-${mm}-${dd}`;
      }
    }
  } catch (e) { }
  return new Date().toISOString().split('T')[0];
}

function SearchSummary({ searchData }: { searchData: SearchData }) {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    destination: searchData.destination,
    checkIn: parseToISODate(searchData.checkIn),
    checkOut: parseToISODate(searchData.checkOut),
    adults: searchData.adults,
    children: searchData.children,
  });

  useEffect(() => {
    if (isOpen) {
      setFormData({
        destination: searchData.destination,
        checkIn: parseToISODate(searchData.checkIn),
        checkOut: parseToISODate(searchData.checkOut),
        adults: searchData.adults,
        children: searchData.children || "0",
      });
    }
  }, [searchData, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsOpen(false);
    navigate(`/search/${formData.destination}/${formData.checkIn}/${formData.checkOut}/${formData.adults}/${formData.children}`);
  };

  return (
    <div className="bg-white border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">{searchData.destination}</h1>
            <div className="flex items-center space-x-6 text-gray-600">
              <div className="flex items-center">
                <Calendar className="w-4 h-4 mr-2" />
                <span>
                  {formatDateDMY(searchData.checkIn)} - {formatDateDMY(searchData.checkOut)}
                </span>
              </div>
              <div className="flex items-center">
                <Users className="w-4 h-4 mr-2" />
                <span>{searchData.adults} Adults</span>
                {Number(searchData.children) > 0 && <>, <Baby className="w-4 h-4 mx-1" /><span>{searchData.children} children</span></>}
              </div>
            </div>
          </div>

          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button
                variant="outline"
                className="mt-4 lg:mt-0 border-green-500 text-green-600 hover:bg-green-50 bg-transparent"
              >
                Modify Search
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Modify Search</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label htmlFor="destination">Destination</Label>
                  <Input
                    id="destination"
                    value={formData.destination}
                    onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="checkIn">Check In</Label>
                    <Input
                      id="checkIn"
                      type="date"
                      value={formData.checkIn}
                      onChange={(e) => setFormData({ ...formData, checkIn: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="checkOut">Check Out</Label>
                    <Input
                      id="checkOut"
                      type="date"
                      value={formData.checkOut}
                      min={formData.checkIn}
                      onChange={(e) => setFormData({ ...formData, checkOut: e.target.value })}
                      required
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="adults">Adults</Label>
                    <Input
                      id="adults"
                      type="number"
                      min="1"
                      value={formData.adults}
                      onChange={(e) => setFormData({ ...formData, adults: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="children">Children</Label>
                    <Input
                      id="children"
                      type="number"
                      min="0"
                      value={formData.children}
                      onChange={(e) => setFormData({ ...formData, children: e.target.value })}
                    />
                  </div>
                </div>
                <Button type="submit" className="w-full mt-4">Search Again</Button>
              </form>
            </DialogContent>
          </Dialog>

        </div>
      </div>
    </div>
  )
}

export default SearchSummary