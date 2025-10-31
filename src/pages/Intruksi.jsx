import React from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Divider,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CleaningServicesIcon from "@mui/icons-material/CleaningServices";
import ReportProblemIcon from "@mui/icons-material/ReportProblem";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export default function InstruksiPemakaian() {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        width: "100vw",
        minHeight: "100vh",
        bgcolor: "#fafafa",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        py: 4,
      }}
    >
      {/* Logo dan Judul */}
      <motion.img
        src="/logo.png"
        alt="Logo"
        style={{ width: 120, marginBottom: 20 }}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      />

      <Typography variant="h5" fontWeight="bold" color="text.primary" sx={{ mb: 3 }}>
        Instruksi Pemakaian Sistem
      </Typography>

      {/* Card Petugas Kebersihan */}
      <Card
        sx={{
          width: "90%",
          maxWidth: 700,
          borderRadius: 4,
          boxShadow: "0 6px 20px rgba(0,0,0,0.1)",
          mb: 3,
        }}
      >
        <CardContent>
          <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
            {/* <CleaningServicesIcon color="success" sx={{ fontSize: 30, mr: 1 }} /> */}
            <Typography variant="h6" fontWeight="bold" color="success.main">
              Panduan Petugas Kebersihan
            </Typography>
          </Box>

          <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
            Gunakan menu <b>Petugas Kebersihan</b> untuk melakukan pengecekan area dengan
            memindai <b>QR Code</b> yang tersedia. Setelah QR terbaca, isi form kondisi area,
            catatan tambahan jika ada, lalu tekan <b>Kirim</b> untuk menyimpan hasil.
          </Typography>

          <Typography variant="body2" color="text.secondary">
            Pastikan setiap area telah di-scan sesuai jadwal agar laporan kebersihan selalu
            terupdate di sistem.
          </Typography>
        </CardContent>
      </Card>

      {/* Card Laporan Keluhan */}
      <Card
        sx={{
          width: "90%",
          maxWidth: 700,
          borderRadius: 4,
          boxShadow: "0 6px 20px rgba(0,0,0,0.1)",
        }}
      >
        <CardContent>
          <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
            {/* <ReportProblemIcon color="error" sx={{ fontSize: 30, mr: 1 }} /> */}
            <Typography variant="h6" fontWeight="bold" color="error.main">
              Panduan Laporan Keluhan / Masalah
            </Typography>
          </Box>

          <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
            Pilih menu <b>Lapor Keluhan </b>Lalu  Scan area untuk melaporkan kendala atau kerusakan di area
            kerja. Isi informasi nama pelapor dan deskripsi keluhan dengan
            jelas.
          </Typography>

          <Typography variant="body2" color="text.secondary">
            Setelah dikirim, laporan akan diteruskan ke tim terkait dan dapat dipantau
            statusnya melalui sistem.
          </Typography>
        </CardContent>
      </Card>

      <Button
        variant="outlined"
        color="primary"
        startIcon={<ArrowBackIcon />}
        sx={{  mt: "auto",borderRadius: 3, textTransform: "none", px: 3 }}
        onClick={() => navigate("/")}
      >
        Kembali ke Menu Utama
      </Button>



































      <Typography
        variant="body2"
        color="text.secondary"
        sx={{ mt: "auto", mb: 2 }}
      >
        © {new Date().getFullYear()} | PT Sarana Mega Fortuna
      </Typography>
    </Box>
  );
}
