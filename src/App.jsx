import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HalamanAwal from "./pages/Formawal";
import KebersihanForm from "./pages/KebersihanForm";
import KetersediaanForm from "./pages/KetersediaanForm";
import PerawatanForm from "./pages/PerawatanForm";
import KeluhanForm from "./pages/KeluhanForm";
import ListKeluhan from "./pages/ListKeluhan";
import Intruksi from "./pages/Intruksi";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HalamanAwal />} />
        <Route path="/kebersihan" element={<KebersihanForm />} />
        <Route path="/ketersediaan" element={<KetersediaanForm />} />
        <Route path="/perawatan" element={<PerawatanForm />} />
        <Route path="/keluhan" element={<KeluhanForm />} />
        <Route path="/listkeluhan" element={<ListKeluhan />} />
        <Route path="/Instruksi" element={<Intruksi />} />
      </Routes>
    </Router>
  );
}
