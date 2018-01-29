const express = require('express');
const fetch = require('node-fetch');
const loadJson = require('load-json-file');
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

// Sample FHIR Return


app.use(cors());
app.use(bodyParser.json());

app.get('/', (req, res) => res.send('PHI 533 CDS Hook Running!'));

app.get('/cds-services', (req, res) => res.send(services));

/**
 * Actual CDS Hook logic here
 */
app.post('/cds-services/phi533-prescribe', function (req, res) {
  fetch('https://api.hspconsortium.org/cdshooksdstu2/open/Observation?patient=SMART-1288992&code:text=bmi&_sort=date')
  // /Observation?subject=Patient/23
    .then(res => res.json())
    .then(json => console.log(json))
    .catch(err => console.error(err))

  loadJson('./sample_bmi_result.json')
    .then(json => {
      const bmi = json.entry[1].resource.valueQuantity;
      
      console.log("BMI: " + bmi.value + " " + bmi.unit);
    })
    .catch(err => console.log(err));
  // FIXME: For now, always just return the same card(s)
  res.send(publicHealthResponse);
});

app.listen(3003, () => console.log('Example app listening on port 3003!'))
