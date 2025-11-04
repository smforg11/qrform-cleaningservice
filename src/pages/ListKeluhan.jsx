import React, { useEffect, useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Snackbar,
  Alert,
  Button,
  Divider,
} from "@mui/material";
import { motion } from "framer-motion";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

export default function ListKeluhan() {
  const [keluhanList, setKeluhanList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingSelesai, setLoadingSelesai] = useState(null); // ⬅️ loading per item
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const fetchKeluhan = async () => {
    try {
      const res = await fetch("/api?type=keluhan");
      const data = await res.json();
      if (Array.isArray(data)) {
        setKeluhanList(data);
      } else {
        setSnackbar({
          open: true,
          message: "Format data tidak valid dari server",
          severity: "error",
        });
      }
    } catch (err) {
      console.error(err);
      setSnackbar({
        open: true,
        message: "Gagal mengambil data keluhan",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSelesai = async (timestamp) => {
    setLoadingSelesai(timestamp); 
    try {
      const res = await fetch("/api", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "update",
          type: "keluhan",
          timestamp,
        }),
      });

      const result = await res.json();
      if (result.status === "updated") {
        setSnackbar({
          open: true,
          message: "Keluhan berhasil diselesaikan",
          severity: "success",
        });
        fetchKeluhan();
      } else {
        setSnackbar({
          open: true,
          message: "Keluhan tidak ditemukan atau gagal diupdate",
          severity: "warning",
        });
      }
    } catch (err) {
      console.error(err);
      setSnackbar({
        open: true,
        message: "Gagal memperbarui status keluhan",
        severity: "error",
      });
    } finally {
      setLoadingSelesai(null); // ⬅️ stop loading
    }
  };

  useEffect(() => {
    fetchKeluhan();
  }, []);

  return (
    <Box
      sx={{
        width: "100vw",
        minHeight: "100vh",
        bgcolor: "#f3f4f6",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        py: 4,
      }}
    >
      <img src="/logo.png" alt="Logo" style={{ width: 100, marginBottom: 10 }} />
      <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }} color="text.secondary">
        Daftar Keluhan Area
      </Typography>

      {loading ? (
        <Box sx={{ mt: 4, textAlign: "center" }}>
          <CircularProgress />
          <Typography sx={{ mt: 2 }}>Memuat data keluhan...</Typography>
        </Box>
      ) : keluhanList.length === 0 ? (
        <Typography variant="body1" color="text.secondary" sx={{ mt: 4 }}>
          Semua keluhan sudah diselesaikan
        </Typography>
      ) : (
        <Box
          sx={{
            width: "95%",
            maxWidth: 600,
            display: "flex",
            flexDirection: "column",
            gap: 2,
          }}
        >
          {keluhanList.map((item, index) => {
            const ts = item.Timestamp || item.created_at;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <Card sx={{ borderRadius: 3, boxShadow: 3, overflow: "hidden" }}>
                  <CardContent>
                    <Typography variant="subtitle1" fontWeight="bold" color="error.main">
                      {item.Barcode || item.barcode || "Area Tidak Dikenal"}
                    </Typography>
                    <Typography variant="body2" sx={{ mt: 0.5 }}>
                      <b>Pelapor:</b> {item.Petugas || item.petugas || "-"}
                    </Typography>
                    <Divider sx={{ my: 1 }} />
                    <Typography variant="body2">
                      {item.Catatan || item.noteArea || "-"}
                    </Typography>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{ display: "block", mt: 1 }}
                    >
                      {ts ? new Date(ts).toLocaleString("id-ID") : ""}
                    </Typography>

                    {/* Tombol Selesai */}
                    <Box sx={{ mt: 2, textAlign: "right" }}>
                      <Button
                        variant="contained"
                        color="success"
                        size="small"
                        startIcon={
                          loadingSelesai === ts ? (
                            <CircularProgress size={16} color="inherit" />
                          ) : (
                            <CheckCircleIcon />
                          )
                        }
                        disabled={loadingSelesai === ts}
                        onClick={() => handleSelesai(ts)}
                        sx={{ borderRadius: 2, textTransform: "none" }}
                      >
                        {loadingSelesai === ts ? "Menyimpan..." : "Selesai"}
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </Box>
      )}

      <Box sx={{ mt: 4 }}>
        <Button
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          onClick={() => (window.location.href = "/")}
          sx={{ borderRadius: 3, px: 3, textTransform: "none" }}
        >
          Kembali ke Menu Utama
        </Button>
      </Box>

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
