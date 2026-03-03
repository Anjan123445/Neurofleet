import {
  Box,
  Typography,
  Paper,
  Button,
  Grid,
  List,
  ListItemButton,
  ListItemText,
  Divider,
  Chip
} from "@mui/material";
import { useState, useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Polyline,
  useMapEvents,
  useMap
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

/* ---------------- FIX MARKERS ---------------- */
delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});

/* ---------------- RESIZE FIX ---------------- */
const ResizeMap = () => {
  const map = useMap();
  useEffect(() => {
    setTimeout(() => map.invalidateSize(), 300);
  }, [map]);
  return null;
};

/* ---------------- MAP CLICK ---------------- */
const LocationSelector = ({ pickup, drop, setPickup, setDrop }) => {
  useMapEvents({
    click(e) {
      if (!pickup) setPickup([e.latlng.lat, e.latlng.lng]);
      else if (!drop) setDrop([e.latlng.lat, e.latlng.lng]);
    }
  });
  return null;
};

const CustomerDashboard = () => {
  const vehicles = [
    { id: 1, name: "Toyota Innova", type: "SUV" },
    { id: 2, name: "Honda City", type: "Sedan" }
  ];

  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [pickup, setPickup] = useState(null);
  const [drop, setDrop] = useState(null);
  const [routes, setRoutes] = useState([]);
  const [selectedRouteIndex, setSelectedRouteIndex] = useState(null);
  const [driverPosition, setDriverPosition] = useState(null);
  const [fare, setFare] = useState(null);

  /* ---------------- FETCH ROUTE ---------------- */
  const fetchRoute = async (start, end) => {
    const res = await fetch(
      `https://router.project-osrm.org/route/v1/driving/${start[1]},${start[0]};${end[1]},${end[0]}?overview=full&geometries=geojson`
    );
    const data = await res.json();
    return {
      coords: data.routes[0].geometry.coordinates.map(
        (c) => [c[1], c[0]]
      ),
      distance: data.routes[0].distance,
      duration: data.routes[0].duration
    };
  };

  /* ---------------- GENERATE ROUTES ---------------- */
  useEffect(() => {
    if (pickup && drop) {
      fetchRoute(pickup, drop).then((base) => {
        const trafficMultiplier = 1.3;
        const ecoMultiplier = 0.9;

        setRoutes([
          {
            type: "Fastest",
            color: "#f97316",
            eta: base.duration,
            distance: base.distance,
            coords: base.coords
          },
          {
            type: "Traffic",
            color: "#3b82f6",
            eta: base.duration * trafficMultiplier,
            distance: base.distance,
            coords: base.coords
          },
          {
            type: "Eco",
            color: "#22c55e",
            eta: base.duration * ecoMultiplier,
            distance: base.distance,
            coords: base.coords
          }
        ]);

        setSelectedRouteIndex(0);
      });
    }
  }, [pickup, drop]);

  /* ---------------- LIVE DRIVER SIMULATION ---------------- */
  useEffect(() => {
    if (selectedRouteIndex === null) return;
    const selected = routes[selectedRouteIndex];
    if (!selected) return;

    let i = 0;
    setDriverPosition(selected.coords[0]);

    const interval = setInterval(() => {
      if (i < selected.coords.length - 1) {
        i++;
        setDriverPosition(selected.coords[i]);
      } else clearInterval(interval);
    }, 100);

    return () => clearInterval(interval);
  }, [selectedRouteIndex, routes]);

  /* ---------------- FARE CALCULATION ---------------- */
  useEffect(() => {
    if (selectedRouteIndex === null) return;
    const route = routes[selectedRouteIndex];
    if (!route) return;

    const baseFare = 50;
    const perKm = 12;
    const km = route.distance / 1000;
    setFare((baseFare + km * perKm).toFixed(0));
  }, [selectedRouteIndex, routes]);

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Intelligent Route Planner
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={4}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6">Vehicles</Typography>
            <List>
              {vehicles.map((v) => (
                <ListItemButton
                  key={v.id}
                  selected={selectedVehicle?.id === v.id}
                  onClick={() => setSelectedVehicle(v)}
                >
                  <ListItemText
                    primary={v.name}
                    secondary={v.type}
                  />
                </ListItemButton>
              ))}
            </List>
          </Paper>
        </Grid>

        <Grid item xs={8}>
          <Paper sx={{ p: 3 }}>
            <Box
              sx={{
                height: 400,
                borderRadius: 2,
                overflow: "hidden"
              }}
            >
              <MapContainer
                center={[12.9716, 77.5946]}
                zoom={8}
                style={{ height: "100%", width: "100%" }}
              >
                <ResizeMap />

                <TileLayer
                  attribution="&copy; OpenStreetMap contributors"
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                <LocationSelector
                  pickup={pickup}
                  drop={drop}
                  setPickup={setPickup}
                  setDrop={setDrop}
                />

                {pickup && <Marker position={pickup} />}
                {drop && <Marker position={drop} />}

                {routes.map((route, index) => (
                  <Polyline
                    key={index}
                    positions={route.coords}
                    color={
                      index === selectedRouteIndex
                        ? route.color
                        : "#555"
                    }
                    weight={
                      index === selectedRouteIndex
                        ? 6
                        : 3
                    }
                  />
                ))}

                {driverPosition && (
                  <Marker position={driverPosition} />
                )}
              </MapContainer>
            </Box>

            {/* ROUTE CARDS */}
            <Grid container spacing={2} mt={2}>
              {routes.map((route, index) => (
                <Grid item xs={4} key={index}>
                  <Paper
                    sx={{
                      p: 2,
                      cursor: "pointer",
                      border:
                        index === selectedRouteIndex
                          ? "2px solid #f97316"
                          : "1px solid #333"
                    }}
                    onClick={() =>
                      setSelectedRouteIndex(index)
                    }
                  >
                    <Typography fontWeight={600}>
                      {route.type}
                    </Typography>
                    <Typography>
                      ETA: {(route.eta / 60).toFixed(1)} min
                    </Typography>
                  </Paper>
                </Grid>
              ))}
            </Grid>

            {fare && (
              <Typography mt={2} variant="h6">
                Estimated Fare: ₹{fare}
              </Typography>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default CustomerDashboard;