import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import './Map.css';

const Map = ({ events }) => {
  const [coordinates, setCoordinates] = useState([]);
  const [locationData, setLocationData] = useState({ lat: 51.505, lng: -0.09 });
  const token =
    'pk.eyJ1Ijoiam9ubnkxMSIsImEiOiJjbHpudDQ4OXQwdHAzMmxxdTJmcDRmMGZ3In0.vVWqXTnEe2_gtjJtQKA1Sw';

  const getCoordinates = async (location) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
          location
        )}&format=json&limit=1`
      );
      const data = await response.json();
      if (data && data.length > 0) {
        return { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) };
      }
    } catch (error) {
      console.error('Error fetching coordinates:', error);
    }
    return { lat: 51.505, lng: -0.09 };
  };

  useEffect(() => {
    const fetchCoordinates = async () => {
      if (events.length > 0) {
        const coords = await Promise.all(
          events.map((event) => getCoordinates(event.location))
        );
        setCoordinates(coords);
        setLocationData(coords[0] || { lat: 51.505, lng: -0.09 });
      }
    };
    fetchCoordinates();
  }, [events]);

  // Custom icon for raindrop
  const raindropIcon = new L.Icon({
    iconUrl:
      'https://res.cloudinary.com/dhxtzhs6h/image/upload/v1723276686/r5yqpxezyzxryibcjqkv.png',
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  });

  return (
    <div className="map-container">
      <MapContainer
        center={locationData}
        zoom={13}
        style={{ height: '600px', width: '100%' }}>
        <TileLayer
          url={`https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=${token}`}
          attribution="&copy; <a href='https://www.openstreetmap.org/copyright'>OpenStreetMap</a> contributors"
          id="mapbox/streets-v11" // Replace with your preferred Mapbox style ID
        />
        {coordinates.map((coord, index) => (
          <Marker key={events[index].id} position={coord} icon={raindropIcon}>
            <Popup>
              <strong>{events[index].title}</strong>
              <br />
              {events[index].description}
              <br />
              {events[index].location}
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default Map;
