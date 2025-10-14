import React, { useEffect, useState } from "react";
import {
  MapContainer,
  TileLayer,
  CircleMarker,
  Tooltip,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// 🧠 Utility to get color based on EV count
function getColor(count) {
  if (count > 1000) return "#ff0000"; // Red - very high
  if (count > 500) return "#ffa500"; // Orange - high
  if (count > 100) return "#ffff00"; // Yellow - medium
  return "#00ff00"; // Green - low
}

// 📊 Legend Component
function Legend() {
  const map = useMap();

  useEffect(() => {
    const legend = L.control({ position: "bottomright" });

    legend.onAdd = function () {
      const div = L.DomUtil.create("div", "info legend");
      div.innerHTML = `
        <h4>EV Count</h4>
        <i style="background:#00ff00"></i> Low<br>
        <i style="background:#ffff00"></i> Medium<br>
        <i style="background:#ffa500"></i> High<br>
        <i style="background:#ff0000"></i> Very High<br>
      `;
      return div;
    };

    legend.addTo(map);
    return () => {
      legend.remove();
    };
  }, [map]);

  return null;
}

const EVMap = ({ evData }) => {
  const [center, setCenter] = useState([47.5, -122.3]); // default

  // 🧭 Auto-center map based on dataset
  useEffect(() => {
    if (evData && evData.length > 0) {
      const avgLat = evData.reduce((a, b) => a + b.lat, 0) / evData.length;
      const avgLon = evData.reduce((a, b) => a + b.lon, 0) / evData.length;
      setCenter([avgLat, avgLon]);
    }
  }, [evData]);

  return (
    <div style={{ height: "90vh", width: "100%" }}>
      <MapContainer
        center={center}
        zoom={7}
        scrollWheelZoom={true}
        style={{ height: "100%", width: "100%" }}
      >
        {/* 🗺️ Base Map */}
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="© OpenStreetMap contributors"
        />

        {/* 🚗 EV Markers */}
        {evData &&
          evData.map((city, index) => (
            <CircleMarker
              key={index}
              center={[city.lat, city.lon]}
              radius={Math.sqrt(city.count) * 1.5}
              fillOpacity={0.6}
              color={getColor(city.count)}
              weight={1}
            >
              <Tooltip direction="top" offset={[0, -5]} opacity={1}>
                <div>
                  <strong>{city.city}</strong>
                  <br />
                  🚗 EV Count: <b>{city.count}</b>
                </div>
              </Tooltip>
            </CircleMarker>
          ))}

        {/* 📘 Legend */}
        <Legend />
      </MapContainer>
    </div>
  );
};

export default EVMap;
