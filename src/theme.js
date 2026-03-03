import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#0f172a" // deep dark blue
    },
    secondary: {
      main: "#f97316" // orange
    },
    background: {
      default: "#0b1120",
      paper: "#1e293b"
    },
    text: {
      primary: "#ffffff",
      secondary: "#94a3b8"
    }
  },
  shape: {
    borderRadius: 14
  },
  typography: {
    fontFamily: "Inter, Roboto, sans-serif",
    h4: {
      fontWeight: 700
    },
    h6: {
      fontWeight: 600
    }
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundColor: "#1e293b",
          boxShadow:
            "0 8px 20px rgba(0,0,0,0.4)"
        }
      }
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          borderRadius: 10,
          backgroundColor: "#f97316",
          "&:hover": {
            backgroundColor: "#ea580c"
          }
        }
      }
    }
  }
});

export default theme;