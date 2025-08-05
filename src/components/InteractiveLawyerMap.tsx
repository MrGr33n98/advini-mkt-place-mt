'use client';

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { Lawyer } from '@/types/lawyer';

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


export default function InteractiveLawyerMap({ lawyers }: { lawyers: Lawyer[] }) {
  return (
    <MapContainer 
      center={[-15.5989, -56.0949]} // Cuiabá
      zoom={13}
      style={{ height: '500px', width: '100%' }}
      className="rounded-lg"
    >
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