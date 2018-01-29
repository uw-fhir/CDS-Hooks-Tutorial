const express = require('express');
const fetch = require('node-fetch');
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
const publicHealthResponse = {
  "cards": [
    { 
      "summary": "Public Health Alert", 
      "detail": "This patient qualifies for enrolment in a Public Health study. Click [here](https://www.doh.wa.gov/) to enroll.",
      "source": { 
        "label": "WA DOH" 
      }, 
      "indicator": "info", 
      "suggestions": [] 
    }
  ]
};

app.use(cors());
app.use(bodyParser.json());

app.get('/', (req, res) => res.send('PHI 533 CDS Hook Running!'));

app.get('/cds-services', (req, res) => res.send(services));

/**
 * Actual CDS Hook logic here
 */
app.post('/cds-services/phi533-prescribe', function (req, res) {
  console.log("CDS Request: \n" + JSON.stringify(req.body));

  const hook = req.body.hook;
  const fhirServer = req.body.fhirServer;
  const patient = req.body.patient;
  const reason = req.body.context.medications[0].reasonCodeableConcept.text
  
  console.log("Useful parameters:");
  console.log("hook: " + hook);
  console.log("fhirServer: " + fhirServer);
  console.log("patient: " + patient);
  console.log("reason: " + reason);

  // Example request to get latest BMI Value
  // TODO: Update to use server and patient from requests
  fetch('https://api.hspconsortium.org/cdshooksdstu2/open/Observation?patient=SMART-1288992&code:text=bmi&_sort:desc=date&_count=1')
    .then(res => res.json())
    .then(json => {
      const bmi = json.entry[0].resource.valueQuantity;
      
      console.log("BMI Value: " + bmi.value + " " + bmi.unit);
    })
    .catch(err => console.error(err))
    
  // Returns static card
  // TODO: Update to return Info and App cards if hook == 'medication-prescribe' 
  res.send(publicHealthResponse);
});

app.listen(3003, () => console.log('Example app listening on port 3003!'))
