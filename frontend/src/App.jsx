import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import axios from 'axios';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// 1.  Better Icon Logic (Handles 0 or missing AQI)
const getMarkerIcon = (aqi) => {
  let color = 'green'; 
  if (!aqi || aqi === 0) color = 'black'; // Black if data is missing
  else if (aqi <= 50) color = 'green';
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

function RecenterMap({ lat, lng }) {
  const map = useMap();
  useEffect(() => {
    if (lat && lng) {
      map.flyTo([lat, lng], 12, { animate: true, duration: 1.5 });
    }
  }, [lat, lng, map]);
  return null;
}

function App() {
  const [zones, setZones] = useState([]);
  const [activeLocation, setActiveLocation] = useState(null);

  useEffect(() => {
    const fetchZones = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:5000/api/zones');
        setZones(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchZones();
  }, []);

  // 2.  Search Functionality (Case-Insensitive, Handles Missing Data)
  const handleSearch = (e) => {
    if (e.key === 'Enter') {
      const term = e.target.value.toLowerCase().trim();
      
      const match = zones.find(z => 
        (z.city && z.city.toLowerCase().includes(term)) || 
        (z.name && z.name.toLowerCase().includes(term))
      );
      
      if (match) {
        setActiveLocation({
          lat: match.location.coordinates[1],
          lng: match.location.coordinates[0]
        });
      } else {
        alert(`Could not find "${term}". Try Nagpur, Delhi, or Mumbai.`);
      }
    }
  };

  return (
    <div style={{ backgroundColor: '#121212', minHeight: '100vh', color: 'white', fontFamily: 'Arial, sans-serif' }}>
      {/* 3. FIXED: Title Spacing (No Clashing) */}
      <header style={{ textAlign: 'center', padding: '40px 20px 20px 20px' }}>
        <h1 style={{ color: '#4db8ff', fontSize: '2.5rem', marginBottom: '10px', fontWeight: '800' }}>
          AirSense India
        </h1>
        <p style={{ opacity: 0.8, fontSize: '1.1rem', marginBottom: '20px' }}>
          National Real-Time AQI Monitor
        </p>
        
        <input 
          type="text" 
          placeholder="🔍 Type city (e.g. Bangalore) and press Enter..." 
          onKeyDown={handleSearch}
          style={{
            padding: '15px 25px',
            borderRadius: '50px',
            border: '2px solid #4db8ff',
            width: '80%',
            maxWidth: '400px',
            fontSize: '16px',
            outline: 'none',
            backgroundColor: '#1f1f1f',
            color: 'white'
          }}
        />
      </header>

      <div style={{ height: '65vh', width: '92%', margin: '0 auto', borderRadius: '20px', overflow: 'hidden', border: '1px solid #333' }}>
        <MapContainer center={[20.5937, 78.9629]} zoom={5} style={{ height: '100%', width: '100%' }}>
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          {activeLocation && <RecenterMap lat={activeLocation.lat} lng={activeLocation.lng} />}

          {zones.map((zone) => (
            <Marker 
              key={zone._id} 
              position={[zone.location.coordinates[1], zone.location.coordinates[0]]}
              icon={getMarkerIcon(zone.aqiValue)}
            >
              <Popup>
                <div style={{ color: '#333', textAlign: 'center' }}>
                  <h3 style={{ margin: '0' }}>{zone.name}</h3>
                  <p style={{ margin: '5px 0', fontSize: '20px' }}>
                    AQI: <span style={{ fontWeight: 'bold', color: zone.aqiValue > 100 ? 'red' : 'green' }}>
                      {zone.aqiValue || "No Data"}
                    </span>
                  </p>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
      
      <footer style={{ textAlign: 'center', padding: '30px', opacity: 0.4, fontSize: '0.9rem' }}>
        © AirSense Project
      </footer>
    </div>
  );
}

export default App;