import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, ExternalLink, Navigation } from "lucide-react";

interface LocationMapProps {
  latitude?: number;
  longitude?: number;
  city?: string;
  region?: string;
  country?: string;
}

export default function LocationMap({ latitude, longitude, city, region, country }: LocationMapProps) {
  if (!latitude || !longitude) {
    return (
      <Card className="overflow-hidden border-0 shadow-lg">
        <CardContent className="p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
              <MapPin className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">Location Map</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">Interactive map view</p>
            </div>
          </div>
          <div className="bg-gray-100 dark:bg-gray-800 rounded-xl p-8 text-center">
            <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 dark:text-gray-400">
              Location coordinates not available for map display
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const location = [city, region, country].filter(Boolean).join(", ");
  const googleMapsUrl = `https://www.google.com/maps?q=${latitude},${longitude}`;
  const appleMapsUrl = `https://maps.apple.com/?q=${latitude},${longitude}`;
  const openStreetMapUrl = `https://www.openstreetmap.org/?mlat=${latitude}&mlon=${longitude}&zoom=12`;

  // Create a static map URL using OpenStreetMap tiles via MapBox-style API
  const staticMapUrl = `https://api.mapbox.com/styles/v1/mapbox/streets-v11/static/pin-s-l+ff0000(${longitude},${latitude})/${longitude},${latitude},12,0/600x400@2x?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4M29iazA2Z2gycXA4N2pmbDZmangifQ.-g_vE53SD2WrJ6tFX7QHmA`;

  return (
    <Card className="overflow-hidden border-0 shadow-lg hover:shadow-xl transition-shadow">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
            <MapPin className="h-6 w-6 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Location Map</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">{location}</p>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        {/* Static Map Display */}
        <div className="mb-4 rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-800">
          <div 
            className="w-full h-64 bg-cover bg-center relative"
            style={{
              backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3csvg width='600' height='400' xmlns='http://www.w3.org/2000/svg'%3e%3crect width='100%25' height='100%25' fill='%23f3f4f6'/%3e%3cg%3e%3ctext x='50%25' y='30%25' text-anchor='middle' font-size='16' fill='%236b7280'%3eInteractive Map%3c/text%3e%3ctext x='50%25' y='45%25' text-anchor='middle' font-size='14' fill='%236b7280'%3e${latitude.toFixed(4)}, ${longitude.toFixed(4)}%3c/text%3e%3ccircle cx='50%25' cy='65%25' r='8' fill='%23ef4444'/%3e%3ctext x='50%25' y='80%25' text-anchor='middle' font-size='12' fill='%236b7280'%3e${location}%3c/text%3e%3c/g%3e%3c/svg%3e")`
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
            <div className="absolute bottom-4 left-4 bg-white dark:bg-gray-800 rounded-lg px-3 py-2 shadow-lg">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  {latitude.toFixed(4)}, {longitude.toFixed(4)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Map Actions */}
        <div className="space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Button 
              variant="outline" 
              className="w-full hover:bg-blue-50 hover:border-blue-300 dark:hover:bg-blue-900/20"
              onClick={() => window.open(googleMapsUrl, '_blank')}
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              Google Maps
            </Button>
            <Button 
              variant="outline" 
              className="w-full hover:bg-gray-50 hover:border-gray-300 dark:hover:bg-gray-700"
              onClick={() => window.open(appleMapsUrl, '_blank')}
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              Apple Maps
            </Button>
          </div>
          <Button 
            variant="outline" 
            className="w-full hover:bg-green-50 hover:border-green-300 dark:hover:bg-green-900/20"
            onClick={() => window.open(openStreetMapUrl, '_blank')}
          >
            <Navigation className="h-4 w-4 mr-2" />
            OpenStreetMap
          </Button>
        </div>

        {/* Coordinates Info */}
        <div className="mt-4 p-4 bg-gradient-to-r from-emerald-50 to-blue-50 dark:from-emerald-900/20 dark:to-blue-900/20 rounded-xl border border-emerald-100 dark:border-emerald-800">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium text-gray-500 dark:text-gray-400">Latitude:</span>
              <div className="font-mono text-gray-900 dark:text-white">{latitude.toFixed(6)}°</div>
            </div>
            <div>
              <span className="font-medium text-gray-500 dark:text-gray-400">Longitude:</span>
              <div className="font-mono text-gray-900 dark:text-white">{longitude.toFixed(6)}°</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}