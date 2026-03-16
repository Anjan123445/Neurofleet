import {
  Box,
  Typography,
  Paper,
  Chip
} from "@mui/material";
import { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";

const DriverDashboard = () => {
  const [trip, setTrip] = useState(null);

  /* -------- Subscribe to Trip -------- */
  useEffect(() => {
    const init = async () => {
      const user = (await supabase.auth.getUser()).data.user;

      const { data } = await supabase
        .from("trips")
        .select("*")
        .eq("driver_id", user.id)
        .eq("status", "assigned")
        .single();

      if (data) setTrip(data);

      const channel = supabase
        .channel("trip_updates")
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table: "trips"
          },
          (payload) => {
            if (payload.new.driver_id === user.id) {
              setTrip(payload.new);
            }
          }
        )
        .subscribe();

      return () => supabase.removeChannel(channel);
    };

    init();
  }, []);

  /* -------- Push Live Location -------- */
  useEffect(() => {
    if (!trip) return;

    const interval = setInterval(async () => {
      const newLat = trip.pickup_lat + Math.random() * 0.001;
      const newLng = trip.pickup_lng + Math.random() * 0.001;

      await supabase
        .from("driver_locations")
        .upsert({
          driver_id: trip.driver_id,
          lat: newLat,
          lng: newLng,
          updated_at: new Date()
        });

    }, 2000);

    return () => clearInterval(interval);
  }, [trip]);

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Driver Dashboard
      </Typography>

      {trip ? (
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6">Assigned Trip</Typography>
          <Chip label={trip.status} sx={{ mt: 1 }} />

          <Typography mt={2}>
            Pickup: {trip.pickup_lat}, {trip.pickup_lng}
          </Typography>
          <Typography>
            Drop: {trip.drop_lat}, {trip.drop_lng}
          </Typography>
        </Paper>
      ) : (
        <Typography>No assigned trips</Typography>
      )}
    </Box>
  );
};

export default DriverDashboard;