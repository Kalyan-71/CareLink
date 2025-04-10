// fhirClient.js

require("dotenv").config();
const { GoogleAuth } = require("google-auth-library");
const axios = require("axios");

let credentials = null;

if (process.env.GOOGLE_CREDENTIALS_B64) {
  const json = Buffer.from(process.env.GOOGLE_CREDENTIALS_B64, "base64").toString("utf-8");
  credentials = JSON.parse(json);
} else {
  throw new Error("GOOGLE_CREDENTIALS_B64 is not set");
}

const auth = new GoogleAuth({
  credentials,
  scopes: ["https://www.googleapis.com/auth/cloud-platform"],
});


async function getAccessToken() {
  const client = await auth.getClient();
  const tokenResponse = await client.getAccessToken();
  return tokenResponse.token;
}

async function createPatient(patientData) {
  const token = await getAccessToken();

  const url = `https://healthcare.googleapis.com/v1/projects/${process.env.GOOGLE_PROJECT_ID}/locations/${process.env.GCP_LOCATION}/datasets/${process.env.GCP_DATASET}/fhirStores/${process.env.FHIR_STORE_ID}/fhir/Patient`;

  const response = await axios.post(url, patientData, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/fhir+json",
    },
  });

  return response.data;
}

module.exports = { createPatient };
