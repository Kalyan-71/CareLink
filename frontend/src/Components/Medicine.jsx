import "./Medicine.css";
import { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

export default function Medicine() {
  const location = useLocation();
  const { id } = useParams();
  const medicineData = location.state;
  const navigate = useNavigate();

  const [medicineName, setMedicineName] = useState('');
  const [dosageMg, setDosageMg] = useState('');
  const [startDate, setStartDate] = useState("");
  const [startTime, setStartTime] = useState('');
  const [days, setDays] = useState([]);
  const [medicineType, setMedicineType] = useState('');
  const [intervalHours, setIntervalHours] = useState('');
  const [customInterval, setCustomInterval] = useState('');
  const [sendToRelative, setSendToRelative] = useState(false);
  const [relativeEmail, setRelativeEmail] = useState("");

  const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const intervalOptions = [
    { value: "4", label: "Every 4 hours" },
    { value: "6", label: "Every 6 hours" },
    { value: "8", label: "Every 8 hours" },
    { value: "12", label: "Every 12 hours" },
    { value: "24", label: "Once daily" },
    { value: "custom", label: "Custom" }
  ];

  const medicineTypes = [
    { type: "Tablet", icon: "📏" },
    { type: "Bottle", icon: "🧴" },
    { type: "Syringe", icon: "💉" },
    { type: "Capsule", icon: "💊" },
  ];

  
  useEffect(() => {
    if (location.state) {
        setMedicineDataToState(location.state);
    } else {
        if (id) {
            fetchMedicineDetails(id);
        }
    }
  }, [location.state]);

  async function fetchMedicineDetails(id) {
    try {
        const response = await axios.get(`https://carelink-backend-njjn.onrender.com/api/healthcare/${id}`);
        setMedicineDataToState(response.data);
    } catch (error) {
        console.error("Error fetching medicine details:", error);
    }
}
  function setMedicineDataToState(data) {
    setMedicineName(data.medicineName || '');
    setDosageMg(data.dosageMg || '');
    setStartTime(data.startTime ? formatDateForInput(data.startTime) : '');
    setMedicineType(data.medicineType || '');
    setIntervalHours(data.intervalHours || '');
    setDays(data.days || []);
  }

  // Convert date from backend format to input format (YYYY-MM-DDTHH:mm)
  function formatDateForInput(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString);
    const pad = num => num.toString().padStart(2, '0');
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
  }

  // Format date for backend (DD-MM-YYYY h:mm a)
  function formatDateForBackend(dateTimeString) {
    if (!dateTimeString) return '';
    const date = new Date(dateTimeString);
    const pad = num => num.toString().padStart(2, '0');
    const hours = date.getHours();
    const ampm = hours >= 12 ? 'p.m' : 'a.m';
    const twelveHour = hours % 12 || 12;
    
    return `${pad(date.getDate())}-${pad(date.getMonth() + 1)}-${date.getFullYear()} ${twelveHour}:${pad(date.getMinutes())} ${ampm}`;
  }

  const handleDayChange = (day) => {
    setDays(prev =>
      prev.includes(day)
        ? prev.filter(d => d !== day)
        : [...prev, day]
    );
  };

  const handleIntervalChange = (value) => {
    setIntervalHours(value);
    if (value !== "custom") {
      setCustomInterval('');
    }
  };

  const handleMedicineType = (type) => {
    setMedicineType(type);
  };
  // const userId = localStorage.getItem("userId");
  function addMedicine(medicine) {

    axios.post("https://carelink-backend-njjn.onrender.com/api/healthcare", medicine, {
          headers: {
            "X-User-Id": localStorage.getItem("userId"), 
          }
        })
        .then(response => {
            console.log("Response Data:", response.data);
            navigate("/medicines");
        })
        .catch(error => console.log(error));
  }

  function finalClick(e) {
    // alert("USer ID is: ",localStorage.getItem("userId"));
    e.preventDefault();
    if (!medicineName || !medicineType || !dosageMg || !startTime || !intervalHours || days.length === 0) {
      alert("Kindly fill all the details");
      return;
    }
    const finalInterval = intervalHours === "custom" ? customInterval : intervalHours;
    const medicine = {
      medicineName,
      medicineType,
      dosageMg,
      startDate, // Already in "YYYY-MM-DD"
      startTime, // Already in "HH:mm"
      intervalHours: finalInterval,
      days,
      email: sendToRelative ? relativeEmail : "",
    };


    console.log("Submitting medicine:", medicine);
    if (sendToRelative && !relativeEmail) {
      alert("Please enter relative's email address.");
      return;
    }
    addMedicine(medicine);
  }

  return (
    <div className="form-container">
      <div className="form-card">
        <div className="form-header">
          <h1>Add New Medicine</h1>
          <div className="form-icon">💊</div>
        </div>

        <form onSubmit={finalClick}>
          {/* Medicine Name */}
          <div className="input-group">
            <label>Medicine Name</label>
            <div className="input-wrapper">
              <input
                type="text"
                placeholder="e.g. Ibuprofen"
                value={medicineName}
                onChange={(e) => setMedicineName(e.target.value)}
                required
              />
              <span className="input-icon">📝</span>
            </div>
          </div>

          {/* Medicine Type */}
          <div className="input-group">
            <label>Medicine Type</label>
            <div className="type-grid">
              {medicineTypes.map((med) => (
                <button
                  key={med.type}
                  type="button"
                  className={`interval-btn ${
                    medicineType === med.type ? "active" : ""
                  }`}
                  onClick={() => handleMedicineType(med.type)}
                >
                  <span>{med.icon}</span> {med.type}
                </button>
              ))}
            </div>
          </div>

          {/* Dosage */}
          <div className="input-group">
            <label>Dosage (mg) </label>
            <div className="input-wrapper">
              <input
                type="number"
                placeholder="e.g. 200"
                value={dosageMg}
                onChange={(e) => setDosageMg(e.target.value)}
                min="1"
                required
              />
              <span className="input-icon">⚖️</span>
            </div>
          </div>

          {/* Start Date */}
          <div className="input-group">
            <label>Start Date</label>
            <div className="input-wrapper">
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                required
              />
              <span className="input-icon">📅</span>
            </div>
          </div>

          {/* Start Time */}
          <div className="input-group">
            <label>Start Time</label>
            <div className="input-wrapper">
              <input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                required
              />
              <span className="input-icon">⏰</span>
            </div>
          </div>

          {/* Interval Hours */}
          <div className="input-group">
            <label>Dosage Interval</label>
            <div className="interval-options">
              {intervalOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  className={`interval-btn ${
                    intervalHours === option.value ? "active" : ""
                  }`}
                  onClick={() => handleIntervalChange(option.value)}
                >
                  {option.label}
                </button>
              ))}
            </div>
            {intervalHours === "custom" && (
              <div className="custom-interval">
                <input
                  type="number"
                  placeholder="Enter hours"
                  value={customInterval}
                  onChange={(e) => setCustomInterval(e.target.value)}
                  min="1"
                  max="24"
                  required
                />
                <span className="interval-label">hours</span>
              </div>
            )}
          </div>

          {/* Days Selection */}
          <div className="input-group">
            <label>Days to Take</label>
            <div className="days-grid">
              {weekDays.map((day) => (
                <button
                  key={day}
                  type="button"
                  className={`day-btn ${days.includes(day) ? "active" : ""}`}
                  onClick={() => handleDayChange(day)}
                >
                  {day}
                </button>
              ))}
            </div>
          </div>
          <div className="input-group mt-4">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={sendToRelative}
                onChange={(e) => setSendToRelative(e.target.checked)}
              />
              <span>Send email to relative</span>
            </label>

            {sendToRelative && (
              <div className="input-wrapper mt-2">
                <input
                  type="email"
                  placeholder="Enter relative's email"
                  value={relativeEmail}
                  onChange={(e) => setRelativeEmail(e.target.value)}
                  required
                />
                <span className="input-icon">📧</span>
              </div>
            )}
          </div>

          <button type="submit" className="submit-btn">
            Add Medication
          </button>
        </form>
      </div>
    </div>
  );
}