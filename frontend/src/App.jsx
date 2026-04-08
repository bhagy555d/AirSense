import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import axios from 'axios';
import Sidebar from './Sidebar';
import 'leaflet/dist/leaflet.css';
import './App.css';

function App() {
  const [zones, setZones] = useState([]);
  const [selectedZone, setSelectedZone] = useState(null);

  // Helper function to create colored marker icons with a "Glow" effect
  const getMarkerIcon = (aqi) => {
    const color = aqi <= 50 ? '#00e400' :
      aqi <= 100 ? '#ffff00' :
        aqi <= 200 ? '#ff7e00' : '#ff0000';

    return L.divIcon({
      className: 'custom-marker',
      html: `<div style="
        background-color: ${color}; 
        width: 14px; 
        height: 14px; 
        border-radius: 50%; 
        border: 2px solid white; 
        box-shadow: 0 0 12px ${color}; 
      "></div>`,
      iconSize: [14, 14],
      iconAnchor: [7, 7]
    });
  };

  useEffect(() => {
    const fetchZones = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/zones');
        setZones(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchZones();
  }, []);

  return (
    <div className="main-layout">
      <div className="map-side">
        <MapContainer
          center={[20.5937, 78.9629]}
          zoom={5}
          style={{ height: "100%", width: "100%" }}
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

          {zones.map((zone) => {
            const lng = zone.location?.coordinates[0];
            const lat = zone.location?.coordinates[1];

            if (lat === undefined || lng === undefined) return null;

            return (
              <Marker
                key={zone._id}
                position={[lat, lng]}
                icon={getMarkerIcon(zone.aqiValue)}
                eventHandlers={{
                  click: () => setSelectedZone(zone),
                }}
              >
                <Popup>
                  <strong>{zone.city}</strong> <br />
                  AQI: {zone.aqiValue}
                </Popup>
              </Marker>
            );
          })}
        </MapContainer>
      </div>

      <Sidebar selectedZone={selectedZone} />
    </div>
  );
}

export default App;