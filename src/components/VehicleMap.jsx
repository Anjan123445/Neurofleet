import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { Box } from "@mui/material";

const VehicleMap = ({ vehicles }) => {
  return (
    <Box sx={{ height: "400px", width: "100%", mt: 4 }}>
      <MapContainer
        center={[12.9716, 77.5946]}
        zoom={6}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {vehicles.map((vehicle) => (
          <Marker
            key={vehicle.id}
            position={[vehicle.lat, vehicle.lng]}
          >
            <Popup>
              <strong>{vehicle.name}</strong> <br />
              Status: {vehicle.status} <br />
              Fuel: {vehicle.fuel.toFixed(1)}% <br />
              Speed: {vehicle.speed.toFixed(1)} km/h
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </Box>
  );
};

export default VehicleMap;