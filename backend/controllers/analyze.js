const { sendObservationToFhir } = require("../utils/fhirHelper");

function assessRisk(testName, value) {
  if (testName.toLowerCase().includes("glucose") && value > 126) {
    return "High Risk of Diabetes";
  }
  // Add more logic per test
  return "Normal";
}

async function analyzeReport(req, res) {
  try {
    const { extractedText, patientId } = req.body; // extractedText is an array of test sections

    const allObservations = [];

    for (const section of extractedText) {
      for (const test of section.tests) {
        const value = parseFloat(test.result);
        if (isNaN(value)) continue;

        const observation = {
          resourceType: "Observation",
          status: "final",
          category: [
            {
              coding: [
                {
                  system:
                    "http://terminology.hl7.org/CodeSystem/observation-category",
                  code: "laboratory",
                },
              ],
            },
          ],
          code: { text: test.name },
          subject: { reference: `Patient/${patientId}` },
          effectiveDateTime: new Date().toISOString(),
          valueQuantity: {
            value: value,
            unit: test.unit || "",
          },
        };

        const response = await sendObservationToFhir(observation);
        const risk = assessRisk(test.name, value);
        allObservations.push({
          name: test.name,
          value,
          unit: test.unit,
          risk,
          fhirId: response.id,
        });
      }
    }

    res.json({ observations: allObservations });
  } catch (err) {
    console.error("Analyze error:", err);
    res.status(500).json({ error: "Failed to analyze report" });
  }
}

module.exports = { analyzeReport };
