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
import "./EvMap.css";

// 🧠 Utility to get color based on EV count
function getColor(count) {
  if (count > 5000) return "#dc2626"; // Red - very high
  if (count > 2000) return "#f97316"; // Orange - high
  if (count > 1000) return "#fbbf24"; // Yellow - medium-high
  if (count > 500) return "#84cc16"; // Light green - medium
  return "#22c55e"; // Green - low
}

// 📊 Legend Component
function Legend() {
  const map = useMap();

  useEffect(() => {
    const legend = L.control({ position: "bottomright" });

    legend.onAdd = function () {
      const div = L.DomUtil.create("div", "info legend");
      div.innerHTML = `
        <div class="legend-content">
          <h4>EV Count</h4>
          <div class="legend-item"><i style="background:#22c55e"></i> <span>< 500</span></div>
          <div class="legend-item"><i style="background:#84cc16"></i> <span>500 - 1K</span></div>
          <div class="legend-item"><i style="background:#fbbf24"></i> <span>1K - 2K</span></div>
          <div class="legend-item"><i style="background:#f97316"></i> <span>2K - 5K</span></div>
          <div class="legend-item"><i style="background:#dc2626"></i> <span>> 5K</span></div>
        </div>
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

// Parse POINT string to lat/lon
function parsePoint(pointStr) {
  if (!pointStr) return null;
  const match = pointStr.match(/POINT \(([-\d.]+) ([-\d.]+)\)/);
  if (match) {
    return { lon: parseFloat(match[1]), lat: parseFloat(match[2]) };
  }
  return null;
}

const EVMap = () => {
  const [data, setData] = useState([]);
  const [locationData, setLocationData] = useState([]);
  const [filters, setFilters] = useState({
    evType: "All",
    make: "All",
    minYear: 2010,
    maxYear: 2025,
  });
  const [center, setCenter] = useState([47.5, -122.3]); // Washington State default
  const [loading, setLoading] = useState(true);

  // Load data
  useEffect(() => {
    fetch("/csvjson.json")
      .then((res) => res.json())
      .then((data) => {
        setData(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error loading JSON:", err);
        setLoading(false);
      });
  }, []);

  // Extract filter options
  const evTypes = ["All", ...new Set(data.map((d) => d["Electric Vehicle Type"]).filter(Boolean))];
  const makes = ["All", ...new Set(data.map((d) => d.Make).filter(Boolean))].sort();

  // Process data when filters change
  useEffect(() => {
    if (data.length === 0) return;

    // Apply filters
    let filtered = data;

    if (filters.evType !== "All") {
      filtered = filtered.filter((d) => d["Electric Vehicle Type"] === filters.evType);
    }

    if (filters.make !== "All") {
      filtered = filtered.filter((d) => d.Make === filters.make);
    }

    filtered = filtered.filter(
      (d) =>
        d["Model Year"] >= filters.minYear && d["Model Year"] <= filters.maxYear
    );

    // Group by location (City + County)
    const locationMap = {};

    filtered.forEach((ev) => {
      const coords = parsePoint(ev["Vehicle Location"]);
      if (!coords) return;

      const key = `${ev.City || "Unknown"}, ${ev.County || "Unknown"}`;
      
      if (!locationMap[key]) {
        locationMap[key] = {
          city: ev.City || "Unknown",
          county: ev.County || "Unknown",
          lat: coords.lat,
          lon: coords.lon,
          count: 0,
          makes: {},
          evTypes: {},
        };
      }

      locationMap[key].count++;
      
      // Track make distribution
      const make = ev.Make || "Unknown";
      locationMap[key].makes[make] = (locationMap[key].makes[make] || 0) + 1;

      // Track EV type distribution
      const evType = ev["Electric Vehicle Type"] || "Unknown";
      locationMap[key].evTypes[evType] = (locationMap[key].evTypes[evType] || 0) + 1;
    });

    const processedData = Object.values(locationMap);
    setLocationData(processedData);

    // Update map center to average of filtered data
    if (processedData.length > 0) {
      const avgLat = processedData.reduce((a, b) => a + b.lat, 0) / processedData.length;
      const avgLon = processedData.reduce((a, b) => a + b.lon, 0) / processedData.length;
      setCenter([avgLat, avgLon]);
    }
  }, [data, filters]);

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  if (loading) {
    return (
      <div className="map-loading">
        <div className="spinner"></div>
        <p>Loading EV location data...</p>
      </div>
    );
  }

  return (
    <div className="map-container">
      <div className="map-header">
        <h2 className="chart-title">🗺️ EV Distribution Map</h2>
        <div className="map-stats">
          <span className="stat-badge">📍 {locationData.length} Locations</span>
          <span className="stat-badge">🚗 {locationData.reduce((a, b) => a + b.count, 0).toLocaleString()} Vehicles</span>
        </div>
      </div>

      {/* Filters */}
      <div className="filters map-filters">
        <div>
          <label>EV Type:</label>
          <select
            value={filters.evType}
            onChange={(e) => handleFilterChange("evType", e.target.value)}
          >
            {evTypes.map((type, idx) => (
              <option key={idx} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label>Make:</label>
          <select
            value={filters.make}
            onChange={(e) => handleFilterChange("make", e.target.value)}
          >
            {makes.slice(0, 50).map((make, idx) => (
              <option key={idx} value={make}>
                {make}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label>Year Range:</label>
          <div className="year-range">
            <input
              type="number"
              min={2010}
              max={2025}
              value={filters.minYear}
              onChange={(e) => handleFilterChange("minYear", Number(e.target.value))}
            />
            <span>-</span>
            <input
              type="number"
              min={2010}
              max={2025}
              value={filters.maxYear}
              onChange={(e) => handleFilterChange("maxYear", Number(e.target.value))}
            />
          </div>
        </div>
      </div>

      {/* Map */}
      <div className="map-wrapper">
        <MapContainer
          center={center}
          zoom={8}
          scrollWheelZoom={true}
          style={{ height: "100%", width: "100%" }}
        >
          {/* 🗺️ Base Map - Dark theme */}
          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          />

          {/* 🚗 EV Markers */}
          {locationData.map((location, index) => {
            const topMake = Object.entries(location.makes).sort((a, b) => b[1] - a[1])[0];
            
            return (
              <CircleMarker
                key={index}
                center={[location.lat, location.lon]}
                radius={Math.min(Math.sqrt(location.count) * 2, 40)}
                fillOpacity={0.7}
                color={getColor(location.count)}
                fillColor={getColor(location.count)}
                weight={2}
              >
                <Tooltip direction="top" offset={[0, -10]} opacity={0.95}>
                  <div className="map-tooltip">
                    <h4>{location.city}</h4>
                    <p className="county">{location.county} County</p>
                    <div className="tooltip-divider"></div>
                    <div className="tooltip-stat">
                      <span className="label">Total EVs:</span>
                      <span className="value">{location.count.toLocaleString()}</span>
                    </div>
                    {topMake && (
                      <div className="tooltip-stat">
                        <span className="label">Top Make:</span>
                        <span className="value">{topMake[0]} ({topMake[1]})</span>
                      </div>
                    )}
                    <div className="tooltip-types">
                      {Object.entries(location.evTypes).slice(0, 2).map(([type, count]) => (
                        <div key={type} className="type-badge">
                          {type.includes("BEV") ? "🔋 BEV" : "⚡ PHEV"}: {count}
                        </div>
                      ))}
                    </div>
                  </div>
                </Tooltip>
              </CircleMarker>
            );
          })}

          {/* 📘 Legend */}
          <Legend />
        </MapContainer>
      </div>
    </div>
  );
};

export default EVMap;
