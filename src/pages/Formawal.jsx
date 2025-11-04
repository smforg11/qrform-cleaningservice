import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from "@mui/material";
import CleaningServicesIcon from "@mui/icons-material/CleaningServices";
import InventoryIcon from "@mui/icons-material/Inventory";
import HomeRepairServiceIcon from "@mui/icons-material/HomeRepairService";
import ReportProblemIcon from "@mui/icons-material/ReportProblem";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { motion } from "framer-motion";

export default function HalamanAwal() {
  const navigate = useNavigate();
  const [menu, setMenu] = useState("utama");
  const [openPassword, setOpenPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const PASSWORD_BENAR = "fluffy11";

  const handleOpenKebersihan = () => {
    const sudahLogin = localStorage.getItem("authPetugas");
    if (sudahLogin === "true") {
      setMenu("kebersihan");
    } else {
      setOpenPassword(true);
    }
  };

  const handleCekPassword = () => {
    if (password === PASSWORD_BENAR) {
      localStorage.setItem("authPetugas", "true");
      setOpenPassword(false);
      setPassword("");
      setError("");
      setMenu("kebersihan");
    } else {
      setError("Password salah, coba lagi.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("authPetugas");
    setMenu("utama");
  };

  const kebersihanMenu = [
    {
      label: "QR Scan Kebersihan",
      color: "success",
      hoverBg: "rgba(76, 175, 80, 0.15)",
      icon: CleaningServicesIcon,
      path: "/kebersihan",
    },
    {
      label: "Cek Ketersediaan",
      color: "warning",
      hoverBg: "rgba(255, 193, 7, 0.15)",
      icon: InventoryIcon,
      path: "/ketersediaan",
    },
    {
      label: "Cek Perawatan Fasilitas",
      color: "primary",
      hoverBg: "rgba(25, 118, 210, 0.15)",
      icon: HomeRepairServiceIcon,
      path: "/perawatan",
    },
    {
      label: "List Keluhan",
      color: "error",
      hoverBg: "rgba(244, 67, 54, 0.15)",
      icon: ReportProblemIcon,
      path: "/listkeluhan",
    },
  ];

  const mainMenu = [
    {
      label: "Petugas Kebersihan",
      color: "warning",
      hoverBg: "rgba(255, 165, 0, 0.15)",
      icon: CleaningServicesIcon,
      action: handleOpenKebersihan,
    },
    {
      label: "Lapor Keluhan / Masalah",
      color: "error",
      hoverBg: "rgba(244, 67, 54, 0.15)",
      icon: ReportProblemIcon,
      action: () => navigate("/keluhan"),
    },
    {
      label: "Instruksi Pemakaian",
      color: "info",
      hoverBg: "rgba(158, 158, 158, 0.15)",
      icon: InfoOutlinedIcon,
      action: () => navigate("/instruksi"),
    },
  ];

  const currentMenu = menu === "utama" ? mainMenu : kebersihanMenu;

  return (
    <Box
      sx={{
        width: "100vw",
        minHeight: "100vh",
        bgcolor: "#ffffff",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <motion.img
        src="/logo.png"
        alt="Logo"
        style={{ width: 140, marginTop: 50 }}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      />

      <Box
        sx={{
          textAlign: "center",
          width: "100%",
          maxWidth: 1200,
          px: 2,
          position: "relative",
        }}
      >
        <Typography
          variant="h6"
          fontWeight="bold"
          color="text.secondary"
          sx={{ mt: 3, mb: 3, letterSpacing: 0.5 }}
        >
          {menu === "utama" ? "System QR Cleaning" : "Form Kebersihan"}
        </Typography>

        <Grid container spacing={3} justifyContent="center" alignItems="stretch">
          {currentMenu.map((btn, index) => {
            const Icon = btn.icon;
            return (
              <Grid
                item
                key={index}
                xs={12}
                sm={6}
                md={menu === "utama" ? 4 : 3}
                display="flex"
                justifyContent="center"
              >
                <motion.div
                  style={{ width: "100%", display: "flex" }}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Card
                    onClick={() =>
                      menu === "utama" ? btn.action() : navigate(btn.path)
                    }
                    sx={{
                      flex: 1,
                      borderRadius: 4,
                      border: `3px solid`,
                      borderColor: `${btn.color}.main`,
                      bgcolor: "#fff",
                      boxShadow: `0 4px 15px ${btn.hoverBg}`,
                      minHeight: 100,
                      minWidth: 240,
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      cursor: "pointer",
                      transition: "all 0.3s ease",
                      "&:hover": {
                        bgcolor: btn.hoverBg,
                        transform: "translateY(-5px)",
                        boxShadow: `0 8px 25px ${btn.hoverBg}`,
                      },
                    }}
                  >
                    <CardContent
                      sx={{
                        display: "flex",
                        width: "100%",
                        height: "100%",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        textAlign: "center",
                        p: 3,
                      }}
                    >
                      <Icon sx={{ fontSize: 30, color: `${btn.color}.main`, mb: 1 }} />
                      <Typography
                        variant="subtitle1"
                        fontWeight="bold"
                        color={`${btn.color}.main`}
                      >
                        {btn.label}
                      </Typography>
                    </CardContent>
                  </Card>
                </motion.div>
              </Grid>
            );
          })}
        </Grid>
      </Box>

    {menu !== "utama" && (
        <Box
          sx={{
            mt: "auto",
            mb: 2,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Button
            variant="outlined"
            color="error"
            onClick={handleLogout}
            sx={{
              borderRadius: 3,
              textTransform: "none",
              px: 3,
              mb: 3,
              mt: 3, 
            }}
          >
            Logout
          </Button>

          <Typography
            variant="body2"
            color="text.secondary"
            textAlign="center"
          >
            © {new Date().getFullYear()} | PT Sarana Mega Fortuna
          </Typography>
        </Box>
      )}

      
     <Dialog open={openPassword} onClose={() => setOpenPassword(false)}>
        <DialogTitle sx={{
          fontSize: 16,         
          textAlign: "center",  
          pb: 1,
          fontWeight: "bold",
          color: "text.secondary",                
          }}>Input Password</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            type="password"
            label="Password"
            variant="outlined"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            sx={{ mt: 1 }}
            error={!!error}
            helperText={error}
          />
        </DialogContent>
        <DialogActions>
          <Button
            variant="outlined"
            color="error"
            onClick={() => setOpenPassword(false)}
            sx={{
              borderRadius: 3,
              textTransform: "none",
              px: 3,
              py: 1,
              transition: "background-color 0.3s",
              "&:hover": {
                backgroundColor: "rgba(255, 0, 0, 0.08)", // merah lembut saat hover
              },
            }}
          >
            Batal
          </Button>

          <Button
            variant="outlined"
            color="primary"
            onClick={handleCekPassword}
            sx={{
              borderRadius: 3,
              textTransform: "none",
              px: 3,
              py: 1,
              transition: "background-color 0.3s",
              "&:hover": {
                backgroundColor: "rgba(25, 118, 210, 0.08)", // biru lembut saat hover
              },
            }}
          >
            Masuk
          </Button>
        </DialogActions>
      </Dialog>


    </Box>
  );
}
