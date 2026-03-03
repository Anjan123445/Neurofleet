import {
  Box,
  Typography,
  Paper,
  Grid,
  Chip,
  LinearProgress,
  Button,
  TextField,
  MenuItem
} from "@mui/material";
import { useState } from "react";

const FleetDashboard = () => {
  const [vehicles, setVehicles] = useState([
    {
      id: 1,
      name: "Toyota Innova",
      plate: "KA-01-AB-1234",
      type: "SUV",
      status: "Available",
      driver: "Ravi Kumar",
      fuel: 78,
      mileage: "18 km/l",
      lastService: "12 Feb 2026",
      location: "Bangalore",
      engineTemp: 72,
      speed: 0
    }
  ]);

  const [newVehicle, setNewVehicle] = useState({
    name: "",
    plate: "",
    type: "",
    driver: ""
  });

  const statusColor = (status) => {
    if (status === "Available") return "success";
    if (status === "Booked") return "warning";
    if (status === "Maintenance") return "error";
    return "default";
  };

  const addVehicle = () => {
    if (!newVehicle.name || !newVehicle.plate) return;

    const vehicle = {
      id: Date.now(),
      ...newVehicle,
      status: "Available",
      fuel: 100,
      mileage: "20 km/l",
      lastService: new Date().toLocaleDateString(),
      location: "Bangalore",
      engineTemp: 60,
      speed: 0
    };

    setVehicles([...vehicles, vehicle]);
    setNewVehicle({
      name: "",
      plate: "",
      type: "",
      driver: ""
    });
  };

  const updateStatus = (id, status) => {
    setVehicles(
      vehicles.map((v) =>
        v.id === id ? { ...v, status } : v
      )
    );
  };

  const deleteVehicle = (id) => {
    setVehicles(vehicles.filter((v) => v.id !== id));
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Fleet Dashboard
      </Typography>

      {/* ===== STATS ===== */}
      <Grid container spacing={3} mb={4}>
        <Grid item xs={4}>
          <Paper sx={{ p: 3 }}>
            <Typography color="text.secondary">
              Total Vehicles
            </Typography>
            <Typography variant="h4">
              {vehicles.length}
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={4}>
          <Paper sx={{ p: 3 }}>
            <Typography color="text.secondary">
              Available
            </Typography>
            <Typography variant="h4">
              {
                vehicles.filter(
                  (v) => v.status === "Available"
                ).length
              }
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={4}>
          <Paper sx={{ p: 3 }}>
            <Typography color="text.secondary">
              Maintenance
            </Typography>
            <Typography variant="h4">
              {
                vehicles.filter(
                  (v) =>
                    v.status === "Maintenance"
                ).length
              }
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* ===== ADD VEHICLE FORM ===== */}
      <Paper sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" mb={2}>
          Add New Vehicle
        </Typography>

        <Grid container spacing={2}>
          <Grid item xs={3}>
            <TextField
              fullWidth
              label="Vehicle Name"
              value={newVehicle.name}
              onChange={(e) =>
                setNewVehicle({
                  ...newVehicle,
                  name: e.target.value
                })
              }
            />
          </Grid>

          <Grid item xs={3}>
            <TextField
              fullWidth
              label="License Plate"
              value={newVehicle.plate}
              onChange={(e) =>
                setNewVehicle({
                  ...newVehicle,
                  plate: e.target.value
                })
              }
            />
          </Grid>

          <Grid item xs={3}>
            <TextField
              fullWidth
              label="Vehicle Type"
              value={newVehicle.type}
              onChange={(e) =>
                setNewVehicle({
                  ...newVehicle,
                  type: e.target.value
                })
              }
            />
          </Grid>

          <Grid item xs={2}>
            <TextField
              fullWidth
              label="Driver Assigned"
              value={newVehicle.driver}
              onChange={(e) =>
                setNewVehicle({
                  ...newVehicle,
                  driver: e.target.value
                })
              }
            />
          </Grid>

          <Grid item xs={1}>
            <Button
              variant="contained"
              fullWidth
              sx={{ height: "100%" }}
              onClick={addVehicle}
            >
              Add
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {/* ===== VEHICLE CARDS ===== */}
      <Grid container spacing={3}>
        {vehicles.map((vehicle) => (
          <Grid item xs={6} key={vehicle.id}>
            <Paper
              sx={{
                p: 3,
                transition: "0.3s",
                "&:hover": {
                  transform: "translateY(-4px)"
                }
              }}
            >
              <Box
                display="flex"
                justifyContent="space-between"
              >
                <Typography variant="h6">
                  {vehicle.name}
                </Typography>

                <Chip
                  label={vehicle.status}
                  color={statusColor(
                    vehicle.status
                  )}
                />
              </Box>

              <Typography variant="body2">
                Plate: {vehicle.plate}
              </Typography>
              <Typography variant="body2">
                Driver: {vehicle.driver}
              </Typography>
              <Typography variant="body2">
                Type: {vehicle.type}
              </Typography>
              <Typography variant="body2">
                Location: {vehicle.location}
              </Typography>
              <Typography variant="body2">
                Mileage: {vehicle.mileage}
              </Typography>
              <Typography variant="body2">
                Last Service: {vehicle.lastService}
              </Typography>
              <Typography variant="body2">
                Engine Temp: {vehicle.engineTemp}°C
              </Typography>
              <Typography variant="body2">
                Speed: {vehicle.speed} km/h
              </Typography>

              <Box mt={2}>
                <Typography variant="body2">
                  Fuel Level
                </Typography>
                <LinearProgress
                  variant="determinate"
                  value={vehicle.fuel}
                  sx={{ height: 8, borderRadius: 5 }}
                />
                <Typography variant="caption">
                  {vehicle.fuel}%
                </Typography>
              </Box>

              <Box mt={2} display="flex" gap={1}>
                <TextField
                  select
                  size="small"
                  label="Status"
                  onChange={(e) =>
                    updateStatus(
                      vehicle.id,
                      e.target.value
                    )
                  }
                >
                  <MenuItem value="Available">
                    Available
                  </MenuItem>
                  <MenuItem value="Booked">
                    Booked
                  </MenuItem>
                  <MenuItem value="Maintenance">
                    Maintenance
                  </MenuItem>
                </TextField>

                <Button
                  color="error"
                  variant="outlined"
                  onClick={() =>
                    deleteVehicle(vehicle.id)
                  }
                >
                  Delete
                </Button>
              </Box>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default FleetDashboard;