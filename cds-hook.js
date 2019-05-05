const express = require('express');
const moment = require('moment');
const fetch = require('node-fetch');
const asyncHandler = require('express-async-handler')
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();

console.log(process.cwd());

// Services
const services = {
  "services": [
    {
      "name": "PHI 533 CDS Hook Demo",
      "title": "PHI 533 CDS Hook Demo",
      "id": "phi533-prescribe",
      "description": "Perform Public Health action based on medication prescription",
      "hook": "medication-prescribe"
    }
  ]
};

// Cards
// This patient qualifies for enrolment in a Public Health study. Click [here](https://www.doh.wa.gov/) to enroll.
const publicHealthResponse = (recoms) => {
  if(recoms.bmi === undefined)
    return {"cards": []};
  
  var bmiMessage = "Your BMI is " + recoms.bmi.value + ". You are " + recoms.bmi.status + ".";
  bmiMessage = bmiMessage + "<br>You have a " + recoms.bmi.risk;
  bmiMessage = bmiMessage + "<br>Your ideal weight is: " + recoms.ideal_weight;

  var cards = {
    "cards": [
      {
        "summary": "👨🏻‍⚕️ BMI Information and Recommendations",
        "detail": bmiMessage,
        "source": {
          "label": "WA DOH"
        },
        "indicator": "info",
        "suggestions": []
      }
    ]
  }

  return (cards);
};

const FHIR_SERVER_PREFIX = 'https://api.hspconsortium.org/cdshooksdstu2/open';
const BMI_SERVER_PREFIX = 'https://bmi.p.rapidapi.com/';

const buildObsURL = (patientId, text) => `${FHIR_SERVER_PREFIX}/Observation?patient=${patientId}&code:text=${text}&_sort:desc=date&_count=1`;
const buildPatientURL = (patientId) => `${FHIR_SERVER_PREFIX}/Patient/${patientId}`;

const getAsync = async (url) => await (await fetch(url)).json();

const bmiPostAsync = async (payload) => {
  return await (await fetch(BMI_SERVER_PREFIX, {
      method: 'POST',
      body: JSON.stringify(payload),
      headers: {
        'Content-Type': 'application/json',
        'X-RapidAPI-Host': 'bmi.p.rapidapi.com',
        'X-RapidAPI-Key': '2da80fad1cmsh95e44479f45f557p1d5c9bjsn5dbb9a6d483b',
        'Accept': 'application/json'
      }
    })).json();
};

app.use(cors());
app.use(bodyParser.json());

app.get('/', asyncHandler(async (req, res, next) => {
  res.send('PHI 533 CDS Hook Running!');
}));

app.get('/cds-services', asyncHandler(async (req, res, next) => {
  res.send(services);
}));

/**
 * Actual CDS Hook logic here
 */
app.post('/cds-services/phi533-prescribe', asyncHandler(async (req, res, next) => {
  console.log("CDS Request: \n" + JSON.stringify(req.body, null, ' '));
  
  // Extracts useful information from the data sent from the Sandbox
  const hook = req.body.hook; // Type of hook
  const fhirServer = req.body.fhirServer; // URL for FHIR Server endpoint
  const patient = req.body.patient; // Patient Identifier
  // Chosen Problem to Treat
  const med = req.body.context.medications.entry[0].resource;
  const reason = (med.reasonCodeableConcept === undefined ? "" : med.reasonCodeableConcept.text); 

  console.log("Useful parameters:");
  console.log("hook: " + hook);
  console.log("fhirServer: " + fhirServer);
  console.log("patient: " + patient);
  console.log("reason: " + reason);

  const patientReq = await getAsync(buildPatientURL('SMART-1551992'));
  const weightReq = await getAsync(buildObsURL('SMART-1551992', 'weight'));
  const heightReq = await getAsync(buildObsURL('SMART-1551992', 'height'));

  const gender = patientReq.gender;
  const birthDate = patientReq.birthDate;
  const weight = weightReq.entry[0].resource.valueQuantity.value;
  const height = heightReq.entry[0].resource.valueQuantity.value;

  const age = moment().diff(birthDate, 'years');

  console.log('Age: ', age);
  console.log('Gender: ', gender);
  console.log('Weight: ', weight);
  console.log('Height: ', height);

  const bmiData = await bmiPostAsync({
    age: 24,
    sex: 'f',
    weight: {
      value: "85.00",
      unit: "kg"
    },
    height: {
      value: "170.00",
      unit: "cm"
    }
  });

  console.log("BMI Data:" + JSON.stringify(bmiData, null, ' '));
  
  const bmiInfo = publicHealthResponse(bmiData);

  console.log("Responding with: \n" + JSON.stringify(bmiInfo, null, ' '));

  res.send(bmiInfo);
}));

app.listen(3003, () => console.log('Example app listening on port 3003!'))
