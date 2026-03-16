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
import { supabase } from "../supabaseClient";
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

/* -------- Fix Leaflet Icons -------- */
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png"
});

/* -------- Resize Fix -------- */
const ResizeMap = () => {
  const map = useMap();
  useEffect(() => {
    setTimeout(() => map.invalidateSize(), 300);
  }, [map]);
  return null;
};

/* -------- Map Click -------- */
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
  const [vehicles, setVehicles] = useState([]);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [pickup, setPickup] = useState(null);
  const [drop, setDrop] = useState(null);
  const [driverLocation, setDriverLocation] = useState(null);
  const [currentTrip, setCurrentTrip] = useState(null);

  /* -------- Load Vehicles -------- */
  useEffect(() => {
    const loadVehicles = async () => {
      const { data } = await supabase
        .from("vehicles")
        .select("*")
        .eq("status", "available");

      setVehicles(data || []);
    };

    loadVehicles();
  }, []);

  /* -------- Subscribe to Driver Location -------- */
  useEffect(() => {
    const channel = supabase
      .channel("driver_location")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "driver_locations"
        },
        (payload) => {
          setDriverLocation(payload.new);
        }
      )
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, []);

  /* -------- Book Ride -------- */
  const bookRide = async () => {
    if (!(selectedVehicle && pickup && drop)) return;

    const user = (await supabase.auth.getUser()).data.user;

    const { data, error } = await supabase
      .from("trips")
      .insert([
        {
          customer_id: user.id,
          pickup_lat: pickup[0],
          pickup_lng: pickup[1],
          drop_lat: drop[0],
          drop_lng: drop[1],
          status: "requested"
        }
      ])
      .select()
      .single();

    if (error) {
      console.error(error);
      return;
    }

    await supabase.rpc("auto_assign_driver", {
      trip_id: data.id
    });

    setCurrentTrip(data);
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Customer Dashboard
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={4}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6">Available Vehicles</Typography>
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
            <Box sx={{ height: 250,width:600 ,borderRadius: 6, overflow: "hidden" }}>
              <MapContainer
                center={[12.9716, 77.5946]}
                zoom={12}
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

                {driverLocation && (
                  <Marker
                    position={[
                      driverLocation.lat,
                      driverLocation.lng
                    ]}
                  />
                )}
              </MapContainer>
            </Box>

            <Divider sx={{ my: 2 }} />

            <Button
              variant="contained"
              onClick={bookRide}
              disabled={!(selectedVehicle && pickup && drop)}
            >
              Book Ride
            </Button>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default CustomerDashboard;