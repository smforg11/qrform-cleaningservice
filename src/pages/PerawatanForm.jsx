import React, { useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Checkbox,
  FormControlLabel,
  Button,
  TextField,
  CircularProgress,
  Snackbar,
  Alert,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function PerawatanForm() {
  const navigate = useNavigate();
  const [petugas, setPetugas] = useState("");
  const [noteArea, setNoteArea] = useState("");
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const items = [
    "Lampu",
    "AC",
    "Dispenser",
    "Kompor",
    "Meja Kerja",
    "Kursi Kerja",
    "Pupuk",
    "Tempat Sampah",
    "Alat Kebersihan (Sapu, Pel)",
    "Toilet(Flush & Air)",
  ];

  const [checks, setChecks] = useState(items.map(() => false));

  const handleToggle = (index) => {
    const updated = [...checks];
    updated[index] = !updated[index];
    setChecks(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

   const payload = {
      type: "perawatan",
      petugas,
      noteArea,
      items: items.map((name, i) => ({
        name,
        status: checks[i],
      })),
    };


    try {
      const res = await fetch("/api", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.status === "ok") {
        setSnackbar({
          open: true,
          message: "Data berhasil dikirim!",
          severity: "success",
        });
        setPetugas("");
        setNoteArea("");
        setChecks(items.map(() => false));
      } else {
        setSnackbar({
          open: true,
          message: "Gagal kirim data",
          severity: "error",
        });
      }
    } catch (err) {
      setSnackbar({
        open: true,
        message: "Terjadi kesalahan koneksi",
        severity: "error",
      });
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        width: "100vw",
        height: "100vh",
        bgcolor: "#f3f4f6",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column", 
      }}
    >
      <Card
        sx={{
        maxWidth: 500,
        width: "100%",
        borderRadius: 4,
        boxShadow: "0 8px 20px rgba(0,0,0,0.1)",
        textAlign: "center",
        backdropFilter: "blur(6px)",
        bgcolor: "#ffffffff",
        }}
      >
        <CardContent>
          <img
            src="/logo.png"
            alt="Logo"
            style={{
              width: 100,
              display: "block",
              margin: "0 auto 16px",
            }}
          />

          <Typography
            variant="h6"
            fontWeight="bold"
            textAlign="center"
            color="text.secondary"
            gutterBottom
          >
          Cek Perawatan Fasilitas
          </Typography>

          <Box component="form" onSubmit={handleSubmit}>
            <TextField
              label="Nama Petugas"
              variant="outlined"
              size="small"
              fullWidth
              required
              sx={{ mb: 2 }}
              value={petugas}
              onChange={(e) => setPetugas(e.target.value)}
            />

            <Box
              display="flex"
              flexWrap="wrap"
              gap={1}
            >
              {items.map((item, i) => (
              <Box
                key={i}
                flex="1 1 45%"
                display="flex"
                alignItems="center"
              >
                <FormControlLabel
                  control={
                  <Checkbox
                  checked={checks[i]}
                  onChange={() => handleToggle(i)}
                  />
                  }
                  label={item}
                  sx={{ width: "100%" }}
                />
                </Box>
              ))}
            </Box>

            <TextField
              label="Catatan (opsional)"
              multiline
              rows={2}
              fullWidth
              sx={{ mt: 2 }}
              value={noteArea}
              onChange={(e) => setNoteArea(e.target.value)}
            />

            <Button
              variant="contained"
              color="primary"
              type="submit"
              fullWidth
              sx={{ mt: 3, py: 1.2, borderRadius: 2 }}
              disabled={loading}
            >
              {loading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                "Kirim"
              )}
            </Button>
            {/* 
            <Button
              variant="outlined"
              color="secondary"
              fullWidth
              sx={{ mt: 1 }}
              onClick={() => {
                setPetugas("");
                setNoteArea("");
                setChecks(items.map(() => false));
              }}
            >
              Reset Form
            </Button> */}
            <Button
              variant="text"
              color="primary"
              fullWidth
              sx={{ mt: 1 }}
              onClick={() => navigate("/")}
              >
              Kembali ke Menu Utama
            </Button>
          </Box>
        </CardContent>
      </Card>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
