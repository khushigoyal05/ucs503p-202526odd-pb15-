import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainLogin from "./MainLogin";
import StudentApp from "./StudentApp";
import SocietyApp from "./SocietyApp";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainLogin />} />
        <Route path="/student" element={<StudentApp />} />
        <Route path="/society" element={<SocietyApp />} />
      </Routes>
    </BrowserRouter>
  );
}