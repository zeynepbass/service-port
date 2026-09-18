"use client";

import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';


const customIcon = L.icon({
  iconUrl: '/marker-icon.png',
  iconSize: [35, 45],
  iconAnchor: [17, 45],
  popupAnchor: [0, -40],
});

export function LocationMap({ konum }) {
  const matches = konum.match(/Lat:\s*([0-9.-]+),\s*Lng:\s*([0-9.-]+)/);
  if (!matches) return <p>Geçersiz konum formatı</p>;

  const lat = Number(matches[1]);
  const lng = Number(matches[2]);

  return (
    <MapContainer center={[lat, lng]} zoom={13} style={{ height: '300px', width: '100%' }}>
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <Marker position={[lat, lng]} icon={customIcon} />
    </MapContainer>
  );
}
