import "@/App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "@/components/Navbar";
import HomePage from "@/pages/HomePage";
import FormPage from "@/pages/FormPage";
import ResultPage from "@/pages/ResultPage";
import ModelsPage from "@/pages/ModelsPage";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/form" element={<FormPage />} />
          <Route path="/results" element={<ResultPage />} />
          <Route path="/models" element={<ModelsPage />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
