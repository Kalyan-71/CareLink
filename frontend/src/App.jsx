// import './App.css'
import Medicine from "./Components/Medicine"
import AllMedicines from "./Components/AllMedicines";
import {BrowserRouter,Routes,Route} from 'react-router-dom';
import UserRegister from "./Components/UserRegister";
import UserLogin from "./Components/UserLogin";
import Home from "./Components/Home";
import MainPage from "./Components/Mainpage";
import VoiceAssistant from "./Components/VoiceAssistant";
import MedicalReportUploader from "./Components/MedicalReportUploader";
import { Toaster } from "react-hot-toast";

function App() {
  return (
    <>
      <Toaster position="top-center" reverseOrder={false} />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<UserRegister />} />
          <Route path="/login" element={<UserLogin />} />
          <Route path="/mainpage" element={<MainPage />} />
          <Route path="/medicine/:id" element={<Medicine />} />
          <Route path="/medicines" element={<AllMedicines />} />
          <Route path="/add-medicine" element={<Medicine />} />
          <Route
            path="/disease-prediction"
            element={<MedicalReportUploader />}
          />
          <Route path="/voice-assistant" element={<VoiceAssistant />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App


