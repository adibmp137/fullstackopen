import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#1565C0",
      light: "#E3F2FD",
      dark: "#0D47A1",
      contrastText: "#FFFFFF",
    },
    secondary: {
      main: "#263238",
      light: "#37474F",
      dark: "#1A1A2E",
      contrastText: "#FFFFFF",
    },
    error: {
      main: "#C62828",
      light: "#FFEBEE",
      dark: "#8E0000",
    },
    success: {
      main: "#1B5E20",
      light: "#E8F5E9",
    },
    text: {
      primary: "#1A1A2E",
      secondary: "#546E7A",
    },
    background: {
      default: "#F5F7FA",
      paper: "#FFFFFF",
    },
  },
  typography: {
    fontFamily: '"Roboto", "Segoe UI", sans-serif',
    h2: {
      fontSize: "1.75rem",
      fontWeight: 400,
    },
    h3: {
      fontSize: "1.25rem",
      fontWeight: 500,
    },
  },
  shape: {
    borderRadius: 16,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          fontWeight: 500,
          borderRadius: 20,
          padding: "8px 24px",
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 12,
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            borderRadius: 16,
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          borderRadius: 0,
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
      },
    },
  },
});

export default theme;
