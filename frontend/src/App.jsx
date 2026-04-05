import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import axios from 'axios';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Function to pick the right color icon based on AQI value
const getMarkerIcon = (aqi) => {
  let color = 'green'; 
  if (!aqi || aqi <= 50) color = 'green';
  else if (aqi <= 100) color = 'gold';
  else if (aqi <= 150) color = 'orange';
  else if (aqi <= 200) color = 'red';
  else color = 'violet';

  return new L.Icon({
    iconUrl: `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-${color}.png`,
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });
};

function App() {
  const [zones, setZones] = useState([]);
  const indiaCenter = [20.5937, 78.9629];

  useEffect(() => {
    const fetchZones = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:5000/api/zones');
        setZones(response.data);
      } catch (error) {
        console.error("Error fetching stations:", error);
      }
    };
    fetchZones();
  }, []);

  return (
    <div style={{ backgroundColor: '#1a1a1a', minHeight: '100vh', color: 'white', fontFamily: 'sans-serif' }}>
      <header style={{ textAlign: 'center', padding: '20px', borderBottom: '1px solid #333' }}>
        <h1 style={{ margin: 0, color: '#4db8ff' }}>AirSense India</h1>
        <p style={{ margin: '5px 0', opacity: 0.8 }}>National Real-Time Air Quality Monitoring System</p>
      </header>
      
      <div style={{ height: '75vh', width: '95%', margin: '20px auto', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 10px 30px rgba(0,0,0,0.5)' }}>
        <MapContainer center={indiaCenter} zoom={5} style={{ height: '100%', width: '100%' }}>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {zones.map((zone) => (
            <Marker 
              key={zone._id} 
              position={[zone.location.coordinates[1], zone.location.coordinates[0]]}
              icon={getMarkerIcon(zone.aqiValue)}
            >
              <Popup>
                <div style={{ color: '#333', textAlign: 'center' }}>
                  <h3 style={{ margin: '0 0 5px 0' }}>{zone.name}</h3>
                  <div style={{ fontSize: '24px', fontWeight: 'bold', color: zone.aqiValue > 100 ? '#e74c3c' : '#2ecc71' }}>
                    AQI: {zone.aqiValue || 'N/A'}
                  </div>
                  <p style={{ fontSize: '12px', color: '#666' }}>
                    Updated: {zone.lastUpdated ? new Date(zone.lastUpdated).toLocaleTimeString() : 'Just now'}
                  </p>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>

      <footer style={{ textAlign: 'center', padding: '10px', fontSize: '14px', opacity: 0.6 }}>
        Connected to {zones.length} live stations across India.
      </footer>
    </div>
  );
}

export default App;