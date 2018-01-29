const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();

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
  // FIXME: For now, always just return the same card(s)
  res.send(publicHealthResponse);
});

app.listen(3003, () => console.log('Example app listening on port 3003!'))
