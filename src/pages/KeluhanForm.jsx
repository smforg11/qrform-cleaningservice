import React, { useState, useRef, useEffect } from "react";
import { BrowserMultiFormatReader } from "@zxing/browser";
import {
  Box,
  Button,
  TextField,
  Typography,
  Card,
  CircularProgress,
  Fade,
  Snackbar,
  Alert,
} from "@mui/material";

export default function KeluhanForm() {
  const [barcode, setBarcode] = useState("");
  const [area, setArea] = useState("");
  const [petugas, setPetugas] = useState("");
  const [keluhan, setKeluhan] = useState("");
  const [scanning, setScanning] = useState(false);
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const videoRef = useRef(null);
  const readerRef = useRef(null);

  const startScan = async () => {
     setScanning(true);
    const reader = new BrowserMultiFormatReader();

    try {
      const devices = await BrowserMultiFormatReader.listVideoInputDevices();
      const deviceId = devices[1]?.deviceId;

      reader.decodeFromVideoDevice(deviceId || null, videoRef.current, (result) => {
        if (result) {
          const code = result.getText();
          setBarcode(code);

          const lower = code.toLowerCase().replace(/_/g, " ");
          let detectedArea = "";

          const possibleAreas = [
            "toilet",
            "pantry",
            "ruang kerja",
            "ruang meeting",
            "lobby",
            "tangga",
            "koridor",
            "gudang",
            "area parkir",
            "musholla",
            "taman",
            "halaman",
          ];

          possibleAreas.forEach((key) => {
            if (lower.includes(key)) detectedArea = key.replace(/^\w/, (c) => c.toUpperCase());
          });

          if (!detectedArea) detectedArea = "Area Tidak Dikenal";
          setArea(detectedArea);

          setScanning(false);
          reader.reset();
        }
      });
    } catch (err) {
      console.error("Gagal akses kamera:", err);
      setSnackbar({
        open: true,
        message: "Tidak bisa mengakses kamera",
        severity: "error",
      });
      setScanning(false);
    }
  };

  useEffect(() => {
    startScan();
    return () => {
      if (readerRef.current) readerRef.current.reset();
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const payload = {
      type: "keluhan",
      barcode,
      area,
      petugas,
      noteArea: keluhan,
      items: [],
      belumSelesai: false,
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
          message: "Keluhan berhasil dikirim",
          severity: "success",
        });
        setBarcode("");
        setArea("");
        setPetugas("");
        setKeluhan("");
        startScan();
      } else {
        setSnackbar({
          open: true,
          message: "Gagal mengirim data",
          severity: "error",
        });
      }
    } catch (err) {
      console.error(err);
      setSnackbar({
        open: true,
        message: "Terjadi kesalahan koneksi",
        severity: "error",
      });
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
          width: "90%",
          maxWidth: 320,
          p: 3,
          borderRadius: 3,
          boxShadow: 5,
          textAlign: "center",
          bgcolor: "#fff",
          position: "relative",
        }}
      >
        {loading && (
          <Box
            sx={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              bgcolor: "rgba(255,255,255,0.7)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: 3,
              zIndex: 10,
              flexDirection: "column",
            }}
          >
            <CircularProgress />
            <Typography variant="body1" sx={{ mt: 2, fontWeight: "bold" }}>
              Mohon tunggu...
            </Typography>
          </Box>
        )}

        <img src="/logo.png" alt="Logo" style={{ width: 80, margin: "0 auto 12px" }} />

        <Typography variant="h6" fontWeight="bold" color="text.secondary" gutterBottom>
          Form Keluhan Area
        </Typography>

        {!barcode && (
          <Box mt={2}>
            <video
              ref={videoRef}
              style={{
                width: "100%",
                borderRadius: 8,
                background: "#000",
              }}
              autoPlay
              muted
            />
            <Typography variant="body2" sx={{ mt: 1, color: "text.secondary" }}>
              Arahkan kamera ke QR area...
            </Typography>
          </Box>
        )}

        {barcode && (
          <Fade in>
            <Box component="form" onSubmit={handleSubmit} mt={2}>
              <Typography variant="body1" sx={{ mb: 1 }}>
                Area : <b>{area}</b>
              </Typography>

              <TextField
                label="Nama Pelapor"
                variant="outlined"
                size="small"
                fullWidth
                required
                sx={{ mb: 2 }}
                value={petugas}
                onChange={(e) => setPetugas(e.target.value)}
              />

              <TextField
                label="Isi Keluhan"
                multiline
                rows={3}
                fullWidth
                required
                value={keluhan}
                onChange={(e) => setKeluhan(e.target.value)}
                sx={{ mb: 2 }}
              />

              <Button
                variant="contained"
                color="error"
                type="submit"
                fullWidth
                sx={{ py: 1.2, borderRadius: 2 }}
                disabled={loading}
              >
                Kirim Keluhan
              </Button>

              <Button
                variant="text"
                color="primary"
                fullWidth
                sx={{ mt: 1 }}
                onClick={() => {
                  setBarcode("");
                  setArea("");
                  setKeluhan("");
                  startScan();
                }}
              >
                Scan Ulang
              </Button>
            </Box>
          </Fade>
        )}
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
