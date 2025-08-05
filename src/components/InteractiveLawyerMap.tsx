'use client';

import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { Lawyer } from '@/types/lawyer';
import { useEffect } from 'react';

// Leaflet's default icon needs to be fixed for webpack environments like Next.js
import L from 'leaflet';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

// @ts-ignore
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconUrl: markerIcon.src,
    iconRetinaUrl: markerIcon2x.src,
    shadowUrl: markerShadow.src,
});

// This component will listen for changes and update the map's view.
function MapViewUpdater({ center, zoom }: { center: [number, number], zoom: number }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, zoom, {
      animate: true,
      pan: {
        duration: 0.5,
      }
    });
  }, [center, zoom, map]);
  return null;
}

export default function InteractiveLawyerMap({ 
  lawyers, 
  center, 
  zoom 
}: { 
  lawyers: Lawyer[], 
  center: [number, number], 
  zoom: number 
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