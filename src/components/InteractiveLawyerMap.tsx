'use client';

import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { Lawyer } from '@/types/lawyer';
import { useEffect } from 'react';
import L from 'leaflet';

// Custom icons using divIcon for CSS styling
const defaultIcon = new L.DivIcon({
  className: 'default-marker',
  iconSize: [16, 16],
  iconAnchor: [8, 8],
  popupAnchor: [0, -8]
});

const selectedIcon = new L.DivIcon({
  className: 'selected-marker',
  iconSize: [20, 20],
  iconAnchor: [10, 10],
  popupAnchor: [0, -10]
});

// This component will listen for changes and update the map's view.
function MapViewUpdater({ center, zoom }: { center: [number, number], zoom: number }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, zoom, {
      animate: true,
      duration: 0.5,
    });
  }, [center, zoom, map]);
  return null;
}

export default function InteractiveLawyerMap({ 
  lawyers, 
  center, 
  zoom,
  selectedLawyerId
}: { 
  lawyers: Lawyer[], 
  center: [number, number], 
  zoom: number,
  selectedLawyerId?: string | null
}) {
  return (
    <MapContainer 
      center={center} 
      zoom={zoom}
      style={{ height: '100%', width: '100%' }}
      className="rounded-lg"
      scrollWheelZoom={false}
    >
      <MapViewUpdater center={center} zoom={zoom} />
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      
      {lawyers.map(lawyer => (
        <Marker
          key={lawyer.id}
          position={[lawyer.latitude, lawyer.longitude]}
          icon={lawyer.id === selectedLawyerId ? selectedIcon : defaultIcon}
        >
          <Popup>
            <div className="p-1">
              <h3 className="font-bold text-base">{lawyer.name}</h3>
              <p className="text-sm">{lawyer.specialties.join(', ')}</p>
              <a 
                href={`/advogados/${lawyer.slug}`}
                className="text-blue-600 hover:underline text-sm"
              >
                Ver perfil
              </a>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  )
}