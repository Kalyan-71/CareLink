const axios = require("axios");
const { GoogleAuth } = require("google-auth-library");
require("dotenv").config();

let credentials = null;

// Load service account from base64-encoded env variable
if (process.env.GOOGLE_CREDENTIALS_B64) {
  const json = Buffer.from(process.env.GOOGLE_CREDENTIALS_B64, "base64").toString("utf-8");
  credentials = JSON.parse(json);
} else {
  throw new Error("GOOGLE_CREDENTIALS_B64 is not set in environment variables");
}

const auth = new GoogleAuth({
  credentials,
  scopes: ["https://www.googleapis.com/auth/cloud-platform"],
});

async function sendObservationToFhir(observation) {
  const token = await auth
    .getClient()
    .then((client) => client.getAccessToken())
    .then((res) => res.token);

  const url = `https://healthcare.googleapis.com/v1/projects/${process.env.GOOGLE_PROJECT_ID}/locations/${process.env.GCP_LOCATION}/datasets/${process.env.GCP_DATASET}/fhirStores/${process.env.FHIR_STORE_ID}/fhir/Observation`;

  const response = await axios.post(url, observation, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/fhir+json",
    },
  });

  return response.data;
}

module.exports = { sendObservationToFhir };
