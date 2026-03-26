import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  Grid,
  MenuItem,
  List,
  ListItem,
  ListItemText,
  Chip
} from "@mui/material";
import { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";

const FleetDashboard = () => {
  const [vehicles, setVehicles] = useState([]);
  const [drivers, setDrivers] = useState([]);

  /* -------- Driver Form -------- */
  const [driverEmail, setDriverEmail] = useState("");
  const [driverPassword, setDriverPassword] = useState("");
  const [driverName, setDriverName] = useState("");

  /* -------- Vehicle Form -------- */
  const [form, setForm] = useState({
    name: "",
    type: "",
    number_plate: "",
    capacity: "",
    driver_id: ""
  });

  /* ---------------- LOAD VEHICLES ---------------- */
  const loadVehicles = async () => {
    const { data } = await supabase
      .from("vehicles")
      .select("*")
      .order("created_at", { ascending: false });

    setVehicles(data || []);
  };

  /* ---------------- LOAD DRIVERS ---------------- */
  const loadDrivers = async () => {
    const { data } = await supabase
      .from("profiles")
      .select("*")
      .eq("role", "driver");

    setDrivers(data || []);
  };

  /* ---------------- INITIAL LOAD ---------------- */
  useEffect(() => {
    loadVehicles();
    loadDrivers();
  }, []);

  /* ---------------- REALTIME SYNC ---------------- */
  useEffect(() => {
    const channel = supabase
      .channel("vehicles_realtime")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "vehicles"
        },
        () => {
          loadVehicles();
        }
      )
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, []);

  /* ---------------- CREATE DRIVER ---------------- */
  const createDriver = async () => {
    if (!driverEmail || !driverName || !driverPassword) {
      alert("Enter all driver details");
      return;
    }

    const { data, error } = await supabase.auth.signUp({
      email: driverEmail,
      name: driverName,
      password: driverPassword
    });

    if (error) {
      console.error(error);
      return;
    }

    // Assign role
    await supabase
      .from("profiles")
      .update({ role: "driver" })
      .eq("id", data.user.id);

    alert("Driver created successfully!");

    setDriverEmail("");
    setDriverName("");
    setDriverPassword("");

    loadDrivers();
  };

  /* ---------------- ADD VEHICLE ---------------- */
  const addVehicle = async () => {
    if (
      !form.name ||
      !form.number_plate ||
      !form.driver_id
    ) {
      alert("Fill all required fields");
      return;
    }

    const { error } = await supabase
      .from("vehicles")
      .insert([
        {
          ...form,
          status: "available",
          fuel: 100,
          location_lat: 12.9716,
          location_lng: 77.5946
        }
      ]);

    if (error) {
      console.error(error);
      return;
    }

    setForm({
      name: "",
      type: "",
      number_plate: "",
      capacity: "",
      driver_id: ""
    });
  };

  /* ---------------- STATUS COLOR ---------------- */
  const statusColor = (status) => {
    if (status === "available") return "success";
    if (status === "booked") return "warning";
    if (status === "maintenance") return "error";
    return "default";
  };

  return (
    <Box p={4}>
      <Typography variant="h4" gutterBottom>
        Fleet Manager Dashboard
      </Typography>

      {/* ---------------- CREATE DRIVER ---------------- */}

      <Paper sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          Create Driver
        </Typography>

        <Grid container spacing={2}>
          <Grid item xs={5}>
            <TextField
              label="Driver Email"
              fullWidth
              value={driverEmail}
              onChange={(e) =>
                setDriverEmail(e.target.value)
              }
            />
          </Grid>
 <Grid item xs={5}>
            <TextField
              label="Name"
              type="text"
              fullWidth
              value={driverName}
              onChange={(e) =>
                setDriverName(e.target.value)
              }
            />

</Grid>
          <Grid item xs={5}>
            <TextField
              label="Password"
              type="password"
              fullWidth
              value={driverPassword}
              onChange={(e) =>
                setDriverPassword(e.target.value)
              }
            />
          </Grid>
          
          

          <Grid item xs={2}>
            <Button
              variant="contained"
              fullWidth
              onClick={createDriver}
            >
              Create
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {/* ---------------- ADD VEHICLE ---------------- */}

      <Paper sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          Add Vehicle
        </Typography>

        <Grid container spacing={2}>
          <Grid item xs={4}>
            <TextField
              label="Vehicle Name"
              fullWidth
              value={form.name}
              onChange={(e) =>
                setForm({ ...form, name: e.target.value })
              }
            />
          </Grid>

          <Grid item xs={4}>
            <TextField
              label="Type"
              fullWidth
              value={form.type}
              onChange={(e) =>
                setForm({ ...form, type: e.target.value })
              }
            />
          </Grid>

          <Grid item xs={4}>
            <TextField
              label="Number Plate"
              fullWidth
              value={form.number_plate}
              onChange={(e) =>
                setForm({
                  ...form,
                  number_plate: e.target.value
                })
              }
            />
          </Grid>

          <Grid item xs={4}>
            <TextField
              label="Capacity"
              fullWidth
              value={form.capacity}
              onChange={(e) =>
                setForm({
                  ...form,
                  capacity: e.target.value
                })
              }
            />
          </Grid>

          <Grid item xs={4}>
            <TextField
              select
              label="Assign Driver"
              fullWidth
              value={form.driverName}
              onChange={(e) =>
                setForm({
                  ...form,
                  driver_id: e.target.value
                })
              }
            >
              {drivers.map((d) => (
                <MenuItem key={d.id} value={d.id}>
                  {d.id}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          <Grid item xs={4}>
            <Button
              fullWidth
              variant="contained"
              sx={{ height: "100%" }}
              onClick={addVehicle}
            >
              Add Vehicle
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {/* ---------------- VEHICLE LIST ---------------- */}

      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Fleet Vehicles
        </Typography>

        <List>
          {vehicles.map((v) => (
            <ListItem key={v.id}>
              <ListItemText
                primary={`${v.name} (${v.number_plate})`}
                secondary={`Driver: ${v.driver_id}`}
              />
              <Chip
                label={v.status}
                color={statusColor(v.status)}
              />
            </ListItem>
          ))}
        </List>
      </Paper>
    </Box>
  );
};

export default FleetDashboard;