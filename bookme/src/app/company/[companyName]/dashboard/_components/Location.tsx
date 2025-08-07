import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { MapPin, Clock, Save } from "lucide-react";

export function LocationSettingsPage() {
  const workingHours = [
    { day: "Monday", hours: "9:00 AM - 6:00 PM", isOpen: true },
    { day: "Tuesday", hours: "9:00 AM - 6:00 PM", isOpen: true },
    { day: "Wednesday", hours: "9:00 AM - 6:00 PM", isOpen: true },
    { day: "Thursday", hours: "9:00 AM - 6:00 PM", isOpen: true },
    { day: "Friday", hours: "9:00 AM - 6:00 PM", isOpen: true },
    { day: "Saturday", hours: "10:00 AM - 4:00 PM", isOpen: true },
    { day: "Sunday", hours: "Closed", isOpen: false },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Location Settings</h1>
        <p className="text-muted-foreground">
          Manage your business location and working hours
        </p>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Business Address
            </CardTitle>
            <CardDescription>
              Update your business location details
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="street">Street Address</Label>
              <Input
                id="street"
                placeholder="Enter street address"
                defaultValue="123 Business Street"
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="grid gap-2">
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  placeholder="Enter city"
                  defaultValue="New York"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="state">State/Province</Label>
                <Input id="state" placeholder="Enter state" defaultValue="NY" />
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="grid gap-2">
                <Label htmlFor="zip">ZIP/Postal Code</Label>
                <Input
                  id="zip"
                  placeholder="Enter ZIP code"
                  defaultValue="10001"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="country">Country</Label>
                <Input
                  id="country"
                  placeholder="Enter country"
                  defaultValue="United States"
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="directions">Additional Directions</Label>
              <Textarea
                id="directions"
                placeholder="Enter additional directions or landmarks"
                defaultValue="Located on the 5th floor, Suite 501. Parking available in the building garage."
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Contact Information</CardTitle>
            <CardDescription>Location-specific contact details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="location-phone">Phone Number</Label>
              <Input
                id="location-phone"
                type="tel"
                placeholder="Enter phone number"
                defaultValue="+1 (555) 123-4567"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="location-email">Email Address</Label>
              <Input
                id="location-email"
                type="email"
                placeholder="Enter email"
                defaultValue="location@bookingpro.com"
              />
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button className="bg-[#007FFF] hover:bg-[#007FFF]/90">
            <Save className="mr-2 h-4 w-4" />
            Save Location Settings
          </Button>
        </div>
      </div>
    </div>
  );
}
