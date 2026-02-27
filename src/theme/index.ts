import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#2E6F95",   // header & brand color
      contrastText: "#fff",
    },
    secondary: {
      main: "#F7941D",   // CTA buttons & highlights
      contrastText: "#fff",
    },
    success: {
      main: "#7BC043",   // discount / offers
    },
    error: {
      main: "#E53935",   // hot deals / sale badges
    },
    background: {
      default: "#F5F7FA",
      paper: "#FFFFFF",
    },
    text: {
      primary: "#2B2B2B",
      secondary: "#6B7280",
    },
    divider: "#E4E7ED",
  },

  typography: {
     fontFamily: `"Public Sans", sans-serif`,

    h1: { fontWeight: 700, fontSize: "2.2rem" },
    h2: { fontWeight: 700, fontSize: "1.8rem" },
    h3: { fontWeight: 600, fontSize: "1.4rem" },
    h4: { fontWeight: 600 },
    h5: { fontWeight: 600 },
    h6: { fontWeight: 600 },

    body1: {
      fontSize: "0.95rem",
    },
    body2: {
      fontSize: "0.85rem",
      color: "#6B7280",
    },

    button: {
      textTransform: "uppercase",
      fontWeight: 600,
      letterSpacing: "0.5px",
    },
  },

  shape: {
    borderRadius: 10, // cards & product tiles
  },



  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 6,
          padding: "8px 18px",
        },
        containedSecondary: {
          boxShadow: "none",
          "&:hover": {
            boxShadow: "0 4px 10px rgba(0,0,0,0.15)",
          },
        },
      },
    },

    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          border: "1px solid #E4E7ED",
          boxShadow: "0 2px 6px rgba(0,0,0,0.06)",
        },
      },
    },

    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: "#2E6F95",
        },
      },
    },

    MuiChip: {
      styleOverrides: {
        root: {
          fontWeight: 600,
        },
        colorSuccess: {
          backgroundColor: "#7BC043",
          color: "#fff",
        },
        colorError: {
          backgroundColor: "#E53935",
          color: "#fff",
        },
      },
    },

    MuiDivider: {
      styleOverrides: {
        root: {
          borderColor: "#E4E7ED",
        },
      },
    },
  },
});

export default theme;
