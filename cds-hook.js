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
// This patient qualifies for enrolment in a Public Health study. Click [here](https://www.doh.wa.gov/) to enroll.
const publicHealthResponse = (recoms) => {
  var bmiMessage = "Your BMI is " + recoms.bmi.value + ". You are " + recoms.bmi.status + ".";
  bmiMessage = bmiMessage + "\nYou have a " + recoms.bmi.risk;
  bmiMessage = bmiMessage + "\nYour ideal weight is: " + recoms.ideal_weight;
  
  var cards = {
    "cards": [
      { 
        "summary": "BMI Information and Recommendations", 
        "detail": bmiMessage,
        "source": { 
          "label": "WA DOH" 
        }, 
        "indicator": "info", 
        "suggestions": [] 
      }
    ]
  }
  
  return(cards);
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
  
  // Example request to get age and sex
  // TODO: Update to use server and patient from requests
  var patientReq = fetch('https://api.hspconsortium.org/cdshooksdstu2/open/Observation?patient=SMART-1288992&code:text=bmi&_sort:desc=date&_count=1')
    .then(res => res.json())
    .then(json => {
      const age = 0;
      const sex = 0; 
      const bmi = json.entry[0].resource.valueQuantity;
      
      console.log("BMI Value: " + bmi.value + " " + bmi.unit);
    })
    .catch(err => console.error(err))
    
  // Example requests to get latest height and weight
  // TODO: Update to use server and patient from requests
  var heightReq = fetch('https://api.hspconsortium.org/cdshooksdstu2/open/Observation?patient=SMART-1288992&code:text=height&_sort:desc=date&_count=1')
    .then(res => res.json())
    .then(json => {
      const height = json.entry[0].resource.valueQuantity;
      
      console.log("Height: " + height.value + " " + height.unit);
    })
    .catch(err => console.error(err))

  var weightReq = fetch('https://api.hspconsortium.org/cdshooksdstu2/open/Observation?patient=SMART-1288992&code:text=weight&_sort:desc=date&_count=1')
    .then(res => res.json())
    .then(json => {
      const weight = json.entry[0].resource.valueQuantity;
      
      console.log("Weight: " + weight.value + " " + weight.unit);
    })
    .catch(err => console.error(err))
      
  Promise.all([patientReq, heightReq, weightReq]).then(vals => {
    const bmiData = {
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
    }

    fetch('https://bmi.p.mashape.com/', { 
	    method: 'POST',
	    body:    JSON.stringify(bmiData),
      headers: { 
        'Content-Type': 'application/json',
        'X-Mashape-Key': 'wwINWStb1qmshrr5MLefJD0RHglLp1IH4ITjsn0zitOozBqxnk',
        'Accept': 'application/json'
       },
    })
      .then(res => res.json())
      .then(json => {
        console.log("BMI RESULTS: ");
        console.log(json);
        res.send(publicHealthResponse(json));
      });

    // Returns static card
    // TODO: Update to return Info and App cards if hook == 'medication-prescribe' 
  });
  
});

app.listen(3003, () => console.log('Example app listening on port 3003!'))
