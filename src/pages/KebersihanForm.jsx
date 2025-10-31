import React, { useState, useRef, useEffect } from "react";
import { BrowserMultiFormatReader } from "@zxing/browser";
import {
  Box,
  Button,
  TextField,
  Typography,
  Checkbox,
  FormControlLabel,
  Card,
  CircularProgress,
  Grid,
  Fade,
  Snackbar,
  Alert,
} from "@mui/material";

export default function KebersihanForm() {
  const [barcode, setBarcode] = useState("");
  const [area, setArea] = useState("");
  const [petugas, setPetugas] = useState("");
  const [noteArea, setNoteArea] = useState("");
  const [scanning, setScanning] = useState(false);
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const videoRef = useRef(null);
  const readerRef = useRef(null);

  const checklistData = {
    "Ruang Kerja": [
      "Lantai bersih",
      "Meja kursi rapi",
      "Tempat sampah tidak penuh",
      "Kaca bersih",
    ],
    "Ruang Meeting": [
      "Lantai bersih",
      "Meja kursi rapi",
      "Kaca bersih",
    ],
    Pantry: [
      "Lantai kering",
      "Wastafel bersih",
      "Peralatan rapi",
    ],
    Toilet: [
      "Tidak bau",
      "Lantai kering",
      "Tersedia sabun & tisu",
    ],
    Lobby: [
      "Lantai bersih",
      "Kaca bebas noda",
      "Sofa rapi",
    ],
    "Tangga/Koridor": [
      "Bebas debu",
      "Tidak ada sampah",
      "Tidak licin",
    ],
    "Gudang GA": [
      "Barang tersusun rapi",
      "Lantai bersih",
      "Bebas sarang laba-laba",
    ],
    "Area Parkir": [
      "Tidak ada sampah berserakan",
      "Garis parkir terlihat jelas",
    ],
    Musholla: [
      "Karpet bersih",
      "Sandal/sepatu tertata",
      "Tempat wudhu kering",
    ],
    "Taman/Halaman": [
      "Rumput terpotong rapi",
      "Tidak ada sampah",
      "Tanaman terawat",
    ],
  };

  const [checks, setChecks] = useState([]);

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
          Object.keys(checklistData).forEach((key) => {
            if (lower.includes(key.toLowerCase().split("/")[0])) detectedArea = key;
          });

          if (!detectedArea) detectedArea = "Ruang Kerja";
          setArea(detectedArea);

          setChecks(
            checklistData[detectedArea].map((name) => ({
              name,
              status: false,
            }))
          );

          setScanning(false);
          reader.reset();
        }
      });
    } catch (err) {
      console.error("Camera Gagal", err);
      setSnackbar({
        open: true,
        message: "Gagal akses kamera",
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

  const handleToggle = (i) => {
    const updated = [...checks];
    updated[i].status = !updated[i].status;
    setChecks(updated);
  };

 
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const payload = {
      barcode,
      area,
      petugas,
      noteArea,
      items: checks,
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
          message: "Data berhasil dikirim ",
          severity: "success",
        });
        setBarcode("");
        setPetugas("");
        setArea("");
        setNoteArea("");
        setChecks([]);
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
        message: "Gagal mengirim data",
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
          width: "90%",
          maxWidth: 300,
          p: 3,
          borderRadius: 3,
          boxShadow: 5,
          textAlign: "center",
          bgcolor: "#ffffffff",
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
          Form Ceklis Kebersihan Area
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
                label="Nama Petugas"
                variant="outlined"
                size="small"
                fullWidth
                required
                sx={{ mb: 2 }}
                value={petugas}
                onChange={(e) => setPetugas(e.target.value)}
              />

              <Grid container spacing={1}>
                {checks.map((item, i) => (
                  <Grid item xs={12} key={i}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={item.status}
                          onChange={() => handleToggle(i)}
                        />
                      }
                      label={item.name}
                    />
                  </Grid>
                ))}
              </Grid>

              <TextField
                label="Catatan (opsional)"
                multiline
                rows={2}
                fullWidth
                value={noteArea}
                onChange={(e) => setNoteArea(e.target.value)}
                sx={{ mt: 2 }}
              />

              <Button
                variant="contained"
                color="success"
                type="submit"
                fullWidth
                sx={{ mt: 3, py: 1.2, borderRadius: 2 }}
                disabled={loading}
              >
                {loading ? <CircularProgress size={24} color="inherit" /> : "Kirim"}
              </Button>

              <Button
                variant="text"
                color="primary"
                fullWidth
                sx={{ mt: 1 }}
                onClick={() => {
                  setBarcode("");
                  setArea("");
                  setChecks([]);
                  setNoteArea("");
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