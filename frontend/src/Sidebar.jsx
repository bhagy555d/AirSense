import React from 'react';
import './Sidebar.css';

const Sidebar = ({ selectedZone }) => {
    // Helper function to determine color, status, and health tips
    const getAqiDetails = (aqi) => {
        if (aqi <= 50) return { colorClass: "txt-green", status: "Good", advice: "Air is fresh. Great time for outdoor activities!" };
        if (aqi <= 100) return { colorClass: "txt-yellow", status: "Satisfactory", advice: "Air quality is acceptable. Enjoy your day." };
        if (aqi <= 200) return { colorClass: "txt-orange", status: "Moderate", advice: "Consider wearing a mask if you have respiratory issues." };
        return { colorClass: "txt-red", status: "Poor", advice: "Avoid prolonged outdoor exertion. Wear an N95 mask." };
    };

    const details = selectedZone ? getAqiDetails(selectedZone.aqiValue) : null;

    return (
        <div className="sidebar">
            {selectedZone ? (
                <div className="details">
                    <h2>{selectedZone.city}</h2>
                    <p className="station-name">{selectedZone.name}</p>

                    <div className="aqi-card">
                        <h3>AQI Index</h3>
                        {/* Dynamic color class based on the value */}
                        <div className={`aqi-value ${details.colorClass}`}>
                            {selectedZone.aqiValue}
                        </div>
                        <p className="status">Status: <strong>{details.status}</strong></p>
                    </div>

                    <div className="pollutant-grid">
                        <div className="p-tile">
                            <span>PM2.5</span>
                            <strong>{Math.round(selectedZone.aqiValue * 0.6)}</strong>
                        </div>
                        <div className="p-tile">
                            <span>PM10</span>
                            <strong>{Math.round(selectedZone.aqiValue * 0.8)}</strong>
                        </div>
                    </div>

                    {/* New Health Advisory Section */}
                    <div className="advisory-box">
                        <h4>Health Advisory</h4>
                        <p>{details.advice}</p>
                    </div>
                </div>
            ) : (
                <div className="empty-state">
                    <h3>Welcome to AirSense</h3>
                    <p>Click on a map marker to see real-time air quality analytics.</p>
                </div>
            )}
        </div>
    );
};

export default Sidebar;