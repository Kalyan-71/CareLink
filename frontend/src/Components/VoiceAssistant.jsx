import React, { useState } from "react";

const VoiceAssistant = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [spokenText, setSpokenText] = useState("");
  const [result, setResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [aiSuggestion, setAiSuggestion] = useState("");
  const [showDialog, setShowDialog] = useState(false);
  const [hospitals, setHospitals] = useState([]);
  const [loadingHospitals, setLoadingHospitals] = useState(false);
  const [showHospitals, setShowHospitals] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState("en"); // 🌍 language state

  const startRecording = () => {
    const recognition = new window.webkitSpeechRecognition();
    recognition.lang = "en-US";
    recognition.start();

    // Reset UI
    setIsRecording(true);
    setShowDialog(false);
    setShowHospitals(false);
    setResult(null);

    recognition.onresult = async (event) => {
      const speech = event.results[0][0].transcript;
      setSpokenText(speech);
      setIsRecording(false);
      setIsLoading(true);

      try {
        const res = await fetch("http://localhost:5000/api/voice-analyze", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ text: speech }),
        });
        const data = await res.json();
        setResult(data);
      } catch (err) {
        console.error("Error analyzing symptoms:", err);
      } finally {
        setIsLoading(false);
      }
    };

    recognition.onerror = () => {
      setIsRecording(false);
    };
  };

  const handleReplay = () => {
    if (spokenText) {
      const utterance = new SpeechSynthesisUtterance(spokenText);
      speechSynthesis.speak(utterance);
    }
  };

  const fetchNearbyHospitals = async () => {
    setShowDialog(false);
    setLoadingHospitals(true);
    setShowHospitals(true);
    setHospitals([]);

    try {
      navigator.geolocation.getCurrentPosition(async (position) => {
        const coords = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };

        const res = await fetch("http://localhost:5000/api/hospitals", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            locationType: "current",
            coordinates: coords,
            symptom: result.symptoms[0],
          }),
        });

        const data = await res.json();
        setHospitals(data.hospitals || []);
      });
    } catch (error) {
      console.error("Error fetching hospitals:", error.message);
    } finally {
      setLoadingHospitals(false);
    }
  };

  const fetchAiSuggestion = async (lang = selectedLanguage) => {
    setShowHospitals(false);
    setShowDialog(true);
    try {
      const res = await fetch("http://localhost:5000/api/ai-suggestions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text: spokenText, language: lang }),
      });
      const result = await res.json();
      setAiSuggestion(result.suggestion || "No suggestion found.");
    } catch (error) {
      setAiSuggestion("Error fetching AI suggestion.");
    }
  };

  const handleReadSuggestion = () => {
    if (!aiSuggestion) return;

    const langMap = {
      en: "en-US",
      hi: "hi-IN",
      te: "te-IN",
      ta: "ta-IN",
      fr: "fr-FR",
      es: "es-ES",
    };

    const targetLang = langMap[selectedLanguage] || "en-US";
    const utterance = new SpeechSynthesisUtterance(aiSuggestion);
    utterance.lang = targetLang;

    // Get all available voices
    const voices = window.speechSynthesis.getVoices();

    // Try to find a matching voice for the language
    const matchingVoice = voices.find(
      (voice) =>
        voice.lang === targetLang ||
        voice.lang.startsWith(targetLang.split("-")[0])
    );

    if (matchingVoice) {
      utterance.voice = matchingVoice;
    } else {
      console.warn(`No voice found for ${targetLang}, using default.`);
    }

    speechSynthesis.cancel(); // Stop any currently speaking voices
    speechSynthesis.speak(utterance);
  };


  return (
    <div className="flex flex-col lg:flex-row max-w-6xl mx-auto mt-10 gap-6">
      {/* Left Panel */}
      <div className="items-center bg-white dark:bg-gray-900 shadow-xl rounded-lg p-6 max-h-[380px] w-full lg:w-[500px] flex-shrink-0 transition-all duration-300">
        <h2 className="text-2xl font-bold text-center flex items-center justify-center gap-2 text-gray-800 dark:text-gray-100">
          🎤 Voice Symptom Assistant
        </h2>

        <button
          onClick={startRecording}
          disabled={isRecording}
          className={`mt-6 w-full py-2 px-4 font-bold rounded text-white transition-all ${
            isRecording
              ? "bg-gray-500 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {isRecording ? "Listening..." : "Speak Symptoms"}
        </button>

        {spokenText && (
          <div className="mt-4 text-gray-700 dark:text-gray-200">
            <p className="text-lg">
              <strong>You said:</strong> {spokenText}
              <button
                onClick={handleReplay}
                className="ml-2 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                title="Replay"
              >
                🔊
              </button>
            </p>
          </div>
        )}

        {isLoading && (
          <div className="mt-4 text-gray-500 italic text-center">
            Analyzing symptoms...
          </div>
        )}

        {result && (
          <div className="bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-100 p-4 mt-4 rounded-lg">
            <p>
              <stairong>🩺 Extracted Symptom:</stairong> {result.symptoms[0]}
            </p>
            <p>
              <strong>⚠️ Serious:</strong>{" "}
              {result.seriousness !== "common" ? "Yes" : "No"}
            </p>
            <p>
              <strong>💡 Advice:</strong> {result.advice[0].advice}
            </p>

            {result.seriousness === "common" && (
              <button
                onClick={() => fetchAiSuggestion("en")} // 🌍 default to English
                className="mt-4 bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
              >
                Get AI Suggestions
              </button>
            )}
            {result.seriousness !== "common" && (
              <button
                onClick={fetchNearbyHospitals}
                className="mt-4 bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
              >
                Consult Nearby Hospitals
              </button>
            )}
          </div>
        )}
      </div>

      {/* Right Panel - AI Suggestions */}
      {showDialog && (
        <div className="bg-white dark:bg-gray-800 shadow-xl rounded-lg p-6 flex-1 border border-gray-200 dark:border-gray-700">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">
              🤖 AI Suggestions
            </h3>
            <select
              value={selectedLanguage}
              onChange={(e) => {
                setSelectedLanguage(e.target.value);
                fetchAiSuggestion(e.target.value);
              }}
              className="border border-gray-300 dark:border-gray-600 rounded px-2 py-1 text-sm bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200"
            >
              <option value="en">English</option>
              <option value="hi">Hindi</option>
              <option value="te">Telugu</option>
              <option value="es">Spanish</option>
              <option value="ta">Tamil</option>
              <option value="fr">French</option>
            </select>
          </div>
          <p className="text-gray-700 dark:text-gray-200 whitespace-pre-line">
            {aiSuggestion}
          </p>

          <div className="mt-4 flex gap-3">
            <button
              onClick={handleReadSuggestion}
              className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded font-semibold"
            >
              🔊 Read
            </button>
            <button
              onClick={() => speechSynthesis.cancel()}
              className="bg-yellow-500 hover:bg-yellow-600 text-white py-2 px-4 rounded font-semibold"
            >
              ⏹️ Stop
            </button>
            <button
              onClick={() => {
                setShowDialog(false);
                speechSynthesis.cancel(); // make sure voice stops when closing too
              }}
              className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded font-semibold"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Right Panel - Hospitals */}
      {showHospitals && (
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md max-h-[420px] overflow-y-auto pr-2">
          <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-2">
            🏥 Nearby Hospitals
          </h3>
          {loadingHospitals ? (
            <p className="text-gray-500">Loading hospitals...</p>
          ) : hospitals.length > 0 ? (
            <ul className="space-y-3">
              {hospitals.map((h, idx) => (
                <li
                  key={idx}
                  className="border-b border-gray-200 dark:border-gray-700 pb-2"
                >
                  <p className="font-bold text-blue-500">{h.name}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {h.address}
                  </p>
                  <p className="text-sm">
                    Rating: ⭐ {h.rating} ({h.user_ratings_total} reviews)
                  </p>
                  <p className="text-sm">Open Now: {h.isOpenNow}</p>
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                      h.name + " " + h.address
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline font-bold text-sm flex justify-end mr-5"
                  >
                    📍 View on Map
                  </a>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">
              No hospitals found nearby for this symptom.
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default VoiceAssistant;
