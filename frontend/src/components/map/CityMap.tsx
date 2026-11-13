import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { City } from '../../types';

// Fix leaflet default marker icon issue in webpack/vite
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

interface CityMapProps {
  currentCity: City | null;
  cities: City[];
  onCitySelect?: (cityCode: string) => void;
}

export const CityMap: React.FC<CityMapProps> = ({ currentCity, cities }) => {
  const lat = currentCity?.latitude || 3.139;
  const lng = currentCity?.longitude || 101.686855;
  const cityName = currentCity?.name || 'Selected City';

  return (
    <div className="bg-slate-900 rounded-xl border border-slate-800 overflow-hidden shadow-sm flex flex-col h-[320px]">
      <div className="px-4 py-3 bg-slate-950/50 border-b border-slate-800 flex justify-between items-center">
        <h3 className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full bg-cyan-500"></span>
          Geographic Command Center — {cityName}
        </h3>
        <span className="text-[10px] text-slate-500 font-mono">Lat: {lat.toFixed(4)}, Lng: {lng.toFixed(4)}</span>
      </div>
      <div className="flex-1 w-full relative z-0">
        <MapContainer
          key={`${lat}-${lng}`}
          center={[lat, lng]}
          zoom={12}
          scrollWheelZoom={false}
          style={{ height: '100%', width: '100%', background: '#090d16' }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors & CartoDB'
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          />
          {cities.map((city) => (
            <Marker key={city.id} position={[city.latitude, city.longitude]}>
              <Popup>
                <div className="text-slate-900 font-medium">
                  <p className="font-bold">{city.name}</p>
                  <p className="text-xs">Country: {city.country_code}</p>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
};
