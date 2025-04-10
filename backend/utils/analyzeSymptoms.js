const language = require("@google-cloud/language");



const client = new language.LanguageServiceClient();

async function analyzeSymptoms(text) {
  // console.log("Analyzing symptoms:", text);
  if (!text || typeof text !== "string") {
    throw new Error("Invalid input: Expected a string.");
  }

  const document = {
    content: text,
    type: "PLAIN_TEXT",
  };

  try {
    const [result] = await client.analyzeEntities({ document });
    // console.log("NLP Result:", result);

    const entities = result.entities.map((entity) => entity.name.toLowerCase());

    const seriousSymptomsAdvice = {
      "chest pain":
        "This could indicate a heart problem. Seek immediate medical attention.",
      "shortness of breath":
        "Can be a sign of respiratory or cardiac issues. Consult a doctor urgently.",
      bleeding:
        "Uncontrolled bleeding can be life-threatening. Visit emergency services.",
      severe:
        "You mentioned severe symptoms—please consult a physician for a detailed evaluation.",
      "difficulty breathing":
        "Critical sign of lung or heart distress. Seek emergency care.",
      "vomiting blood":
        "This may indicate internal bleeding. Visit the ER immediately.",
      "loss of consciousness":
        "Could be a neurological issue or trauma. Needs emergency evaluation.",
      "high fever":
        "Persistent high fever might indicate serious infection. See a doctor.",
      confusion: "Sudden confusion may be neurological. Get emergency care.",
      seizure: "Seizures require neurological evaluation. Seek urgent help.",
      "uncontrolled bleeding":
        "Could lead to shock. Immediate medical attention required.",
      "persistent pain":
        "Chronic or persistent pain shouldn't be ignored. Get a diagnosis.",
      "sharp abdominal pain":
        "Might be appendicitis or internal injury. See a doctor quickly.",
      numbness: "Could signal stroke or nerve damage. Don’t delay treatment.",
      paralysis: "Serious nervous system issue. Go to a hospital immediately.",
    };

    const commonAdvice = {
      fever: "Stay hydrated, rest, and take paracetamol if needed.",
      cold: "Drink fluids, take vitamin C, and rest well.",
      cough: "Use warm fluids, steam inhalation, and avoid cold air.",
      headache: "Lie down in a quiet dark room and avoid screen time.",
      sore: "Gargle with salt water and drink warm liquids.",
      nausea: "Eat light meals, avoid greasy food, and rest.",
      vomiting: "Sip water slowly and avoid solid food temporarily.",
      diarrhea: "Stay hydrated with ORS and avoid dairy products.",
      fatigue: "Ensure proper rest and maintain hydration.",
      dizziness: "Sit or lie down, and avoid sudden movements.",
    };

    const matchedAdvice = entities
      .map((symptom) => {
        if (seriousSymptomsAdvice[symptom]) {
          return {
            symptom,
            advice: seriousSymptomsAdvice[symptom],
            type: "serious",
          };
        } else if (commonAdvice[symptom]) {
          return { symptom, advice: commonAdvice[symptom], type: "common" };
        }
        return null;
      })
      .filter(Boolean);

    const isSerious = matchedAdvice.some((item) => item.type === "serious");

    return {
      symptoms: entities,
      seriousness: isSerious ? "serious" : "common",
      advice:
        matchedAdvice.length > 0
          ? matchedAdvice
          : [
              {
                symptom: "general",
                advice: "Please consult a doctor for further advice.",
                type: "unknown",
              },
            ],
    };
  } catch (error) {
    console.error("NLP Error:", error);
    throw new Error("Failed to analyze symptoms.");
  }
}

module.exports = analyzeSymptoms;
