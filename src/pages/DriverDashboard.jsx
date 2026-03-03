import {
  Box,
  Typography,
  Paper,
  Button,
  Chip,
  Divider,
  Grid
} from "@mui/material";
import { useState, useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Polyline,
  useMap
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

/* -------- Marker Fix -------- */
delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const ResizeMap = () => {
  const map = useMap();
  useEffect(() => {
    setTimeout(() => map.invalidateSize(), 200);
  }, [map]);
  return null;
};

const DriverDashboard = () => {
  const [trip, setTrip] = useState({
    customer: "Rahul Sharma",
    vehicle: "Toyota Innova",
    status: "Assigned",
    pickup: [12.9716, 77.5946],
    drop: [12.2958, 76.6394],
    currentLocation: [12.9716, 77.5946]
  });

  useEffect(() => {
    if (trip.status !== "Started") return;

    const interval = setInterval(() => {
      setTrip((prev) => {
        const latDiff =
          (prev.drop[0] - prev.currentLocation[0]) * 0.003;
        const lngDiff =
          (prev.drop[1] - prev.currentLocation[1]) * 0.003;

        return {
          ...prev,
          currentLocation: [
            prev.currentLocation[0] + latDiff,
            prev.currentLocation[1] + lngDiff
          ]
        };
      });
    }, 800);

    return () => clearInterval(interval);
  }, [trip.status]);

  const statusColor = (status) => {
    if (status === "Assigned") return "warning";
    if (status === "Started") return "primary";
    if (status === "Completed") return "success";
    return "default";
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Driver Dashboard
      </Typography>

      {/* ===== STATS ===== */}
      <Grid container spacing={3} mb={4}>
        <Grid item xs={4}>
          <Paper sx={{ p: 3 }}>
            <Typography color="text.secondary">
              Total Trips
            </Typography>
            <Typography variant="h4">24</Typography>
          </Paper>
        </Grid>

        <Grid item xs={4}>
          <Paper sx={{ p: 3 }}>
            <Typography color="text.secondary">
              Active Trips
            </Typography>
            <Typography variant="h4">
              {trip.status !== "Completed" ? 1 : 0}
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={4}>
          <Paper sx={{ p: 3 }}>
            <Typography color="text.secondary">
              Rating
            </Typography>
            <Typography variant="h4">4.8</Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* ===== ACTIVE TRIP ===== */}
      <Paper sx={{ p: 3, mb: 4 }}>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
        >
          <Typography variant="h6">
            Active Trip
          </Typography>

          <Chip
            label={trip.status}
            color={statusColor(trip.status)}
          />
        </Box>

        <Divider sx={{ my: 2 }} />

        <Typography>
          Customer: {trip.customer}
        </Typography>
        <Typography>
          Vehicle: {trip.vehicle}
        </Typography>

        {trip.status === "Assigned" && (
          <Button
            variant="contained"
            sx={{ mt: 2 }}
            onClick={() =>
              setTrip({ ...trip, status: "Started" })
            }
          >
            Start Trip
          </Button>
        )}
      </Paper>

      {/* ===== MAP ===== */}
      <Paper sx={{ p: 2 }}>
        <Typography variant="h6" mb={2}>
          Live Route
        </Typography>

        <Box
          sx={{
            height: 300,
            borderRadius: 2,
            overflow: "hidden"
          }}
        >
          <MapContainer
            center={trip.pickup}
            zoom={8}
            style={{ height: "100%", width: "100%" }}
          >
            <ResizeMap />

            <TileLayer
              attribution="&copy; OpenStreetMap contributors"
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            <Marker position={trip.pickup} />
            <Marker position={trip.drop} />
            <Marker position={trip.currentLocation} />

            <Polyline
              positions={[trip.pickup, trip.drop]}
              color="#2563eb"
            />
          </MapContainer>
        </Box>
      </Paper>
    </Box>
  );
};

export default DriverDashboard;