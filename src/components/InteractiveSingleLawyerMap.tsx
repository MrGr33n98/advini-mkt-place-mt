'use client';

import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Re-use the same marker style for consistency
const defaultIcon = new L.DivIcon({
  className: 'default-marker',
  iconSize: [16, 16],
  iconAnchor: [8, 8],
});

export default function InteractiveSingleLawyerMap({ 
  latitude,
  longitude
}: { 
  latitude: number,
  longitude: number
}) {
  const position: [number, number] = [latitude, longitude];

  return (
    <MapContainer 
      center={position} 
      zoom={15}
      style={{ height: '200px', width: '100%' }}
      className="rounded-lg"
      zoomControl={false}
      scrollWheelZoom={false}
      dragging={false}
      touchZoom={false}
      doubleClickZoom={false}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      <Marker
        position={position}
        icon={defaultIcon}
        interactive={false}
      />
    </MapContainer>
  )
}