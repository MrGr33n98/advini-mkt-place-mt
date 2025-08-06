'use client';

import { MapContainer, TileLayer, Marker, Popup, useMap, Circle } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { Lawyer } from '@/types/lawyer';
import { useEffect, useState } from 'react';
import { LawyerMapPopup } from './LawyerMapPopup';
import { Button } from './ui/button';
import { MapPin, Navigation } from 'lucide-react';
import { useGeolocation } from '@/hooks/use-geolocation';
import { toast } from 'sonner';
import L from 'leaflet';

// Fix for default markers in Next.js
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom icons using divIcon for CSS styling
const createMarkerIcon = (plan: string, isSelected: boolean = false) => {
  let className = 'map-marker';
  
  if (isSelected) {
    className += ' selected';
  }
  
  switch (plan) {
    case 'gold':
      className += ' gold';
      break;
    case 'silver':
      className += ' silver';
      break;
    default:
      className += ' basic';
      break;
  }

  return new L.DivIcon({
    className,
    iconSize: isSelected ? [24, 24] : [18, 18],
    iconAnchor: isSelected ? [12, 12] : [9, 9],
    popupAnchor: [0, isSelected ? -12 : -9]
  });
};

const userLocationIcon = new L.DivIcon({
  className: 'user-location-marker',
  iconSize: [16, 16],
  iconAnchor: [8, 8],
  popupAnchor: [0, -8]
});

// Component to handle map view updates and user location
function MapController({ 
  center, 
  zoom, 
  userLocation,
  onLocationFound 
}: { 
  center: [number, number], 
  zoom: number,
  userLocation: { latitude: number; longitude: number } | null,
  onLocationFound: (lat: number, lng: number) => void
}) {
  const map = useMap();

  useEffect(() => {
    map.setView(center, zoom, {
      animate: true,
      duration: 0.5,
    });
  }, [center, zoom, map]);

  useEffect(() => {
    if (userLocation) {
      onLocationFound(userLocation.latitude, userLocation.longitude);
    }
  }, [userLocation, onLocationFound]);

  return null;
}

// Geolocation control component
function GeolocationControl({ onLocationFound }: { onLocationFound: (lat: number, lng: number) => void }) {
  const { latitude, longitude, error, loading, getCurrentPosition, isSupported } = useGeolocation();
  const map = useMap();

  useEffect(() => {
    if (latitude && longitude) {
      map.setView([latitude, longitude], 15, { animate: true });
      onLocationFound(latitude, longitude);
      toast.success('Localização encontrada!');
    }
  }, [latitude, longitude, map, onLocationFound]);

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  if (!isSupported) return null;

  return (
    <div className="leaflet-top leaflet-right">
      <div className="leaflet-control leaflet-bar">
        <Button
          size="sm"
          variant="outline"
          className="rounded-none border-0 bg-white hover:bg-gray-50"
          onClick={getCurrentPosition}
          disabled={loading}
        >
          <Navigation className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
        </Button>
      </div>
    </div>
  );
}

export default function EnhancedInteractiveLawyerMap({ 
  lawyers, 
  center, 
  zoom,
  selectedLawyerId,
  onMarkerClick
}: { 
  lawyers: Lawyer[], 
  center: [number, number], 
  zoom: number,
  selectedLawyerId?: string | null,
  onMarkerClick?: (lawyerId: string) => void
}) {
  const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null);

  const handleLocationFound = (lat: number, lng: number) => {
    setUserLocation({ latitude: lat, longitude: lng });
  };

  const handleMarkerClick = (lawyer: Lawyer) => {
    if (onMarkerClick) {
      onMarkerClick(lawyer.id);
    }
  };

  return (
    <MapContainer 
      center={center} 
      zoom={zoom}
      style={{ height: '100%', width: '100%' }}
      className="rounded-lg"
      scrollWheelZoom={true}
      zoomControl={true}
    >
      <MapController 
        center={center} 
        zoom={zoom} 
        userLocation={userLocation}
        onLocationFound={handleLocationFound}
      />
      
      <GeolocationControl onLocationFound={handleLocationFound} />
      
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      
      {/* User location marker and radius */}
      {userLocation && (
        <>
          <Marker
            position={[userLocation.latitude, userLocation.longitude]}
            icon={userLocationIcon}
          >
            <Popup>
              <div className="p-2 text-center">
                <MapPin className="h-4 w-4 mx-auto mb-1 text-primary" />
                <p className="text-sm font-medium">Sua localização</p>
              </div>
            </Popup>
          </Marker>
          <Circle
            center={[userLocation.latitude, userLocation.longitude]}
            radius={2000} // 2km radius
            pathOptions={{
              color: 'hsl(var(--primary))',
              fillColor: 'hsl(var(--primary))',
              fillOpacity: 0.1,
              weight: 2,
              opacity: 0.5
            }}
          />
        </>
      )}
      
      {/* Lawyer markers */}
      {lawyers.map(lawyer => (
        <Marker
          key={lawyer.id}
          position={[lawyer.latitude, lawyer.longitude]}
          icon={createMarkerIcon(lawyer.plan, lawyer.id === selectedLawyerId)}
          eventHandlers={{
            click: () => handleMarkerClick(lawyer)
          }}
        >
          <Popup
            maxWidth={320}
            minWidth={280}
            closeButton={true}
            autoClose={false}
            closeOnEscapeKey={true}
          >
            <LawyerMapPopup lawyer={lawyer} />
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}