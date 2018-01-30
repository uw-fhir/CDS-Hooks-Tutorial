# Hooking It All Up Together:
## A CDS Hooks Tutorial

We learned about the standards (FHIR, SMART on FHIR, CDS Hooks) and thought about how they can foster innovation and improvement in the public health sphere. Now let's combine all of that fresh knowledge to create and test our own **Public Health CDS Service**.

## Some Prereq's

1. We'll be using the official CDS Hooks sandbox that can be accessed [here](https://sandbox.cds-hooks.org). Open up the page and play around with it a bit!

2. Since each of your computers will be used to temporarily host a CDS Service, we'll need to make sure all of you have a couple things installed. 

    a. **Node.js, npm, and ssh**: We'll be booting up a simple server that will listen to incoming CDS requests and respond with the appropriate cards. This server runs on `Node.js`; `npm` is the Node.js package manager that allows for a quick setup, and an `ssh` client will be used to listen to incoming requests from the CDS Sandbox. Follow the instructions [here](https://github.com/uwbhi/phi533-cdshook/blob/master/readme.md) to install them!  

    b. **Some capable text editor**: If you don't have one, you should quickly download one. Here are some options:
    
      * [Atom](https://atom.io/)
      * [Sublime Text](https://www.sublimetext.com/)
      * [Notepad++](https://notepad-plus-plus.org/download/) (Windows only)
      * [VS Code](https://code.visualstudio.com/) (more advanced)

    c. **Git**: (optional) We'll use it to download the server code. If you don't want to install it, you can download the code in a [.zip file](https://github.com/uwbhi/phi533-cdshook/archive/master.zip).

3. To make this tutorial more fun, we're hooking up recomendations from an existant BMI Service - an BMI Calculator API that can be found here: https://market.mashape.com/navii/bmi-calculator

We funded the $1 fee to enable this api for a month for this class. If you're doing this tutorial and this API is not working, you might have to sign up yourself and change the `X_MASHAPE_KEY` constant in the `cds-hooks.js` file to your own key.

## The Scenario
You’re working on a nation-wide project whose goal is to study and combat obesity in the United States. Your job involves designing a CDS Hook that supports the study objectives. The hook should allow you to:

1. Report on obesity-related health issues at the point of care
2. Provide feedback to the patient on how their health stacks up with their peers
3. Allow patients to be easily recruited as participants into a large-scale longitudinal obesity study

In this specific scenario, patient **Lisa P. Coleman** is visiting her physician. The physician diagnoses her with **Hypertensive disorder**, and is prescribing **Lopressor** to treat her high blood pressure. 

## Exercise 1 - Acting out the scenario in the CDS Sandbox
1. Go to https://sandbox.cds-hooks.org
2. Click on `Change Patient` on the top menu
3. Select `Lisa P. Coleman`
4. Click the `Save` button
5. Click on `Rx View` on the top menu
6. Select `Hypertensive disorder` from `Treating:` dropdown
7. Type in `Lopressor` into `Medication` box, and select `Lopressor` => `Metoprolol Tartrate 50 MG Oral Tablet [Lopressor]`. You should see a **CMS Price Check** card returned by one of the demo CDS services. 
8. This service suggests generic drugs to replace Brand-name options by returning a **suggestion card**. Check out the **Response** section to see how this card is formatted. Test out what clicking the `change to generic` button does. 
8. Since we'll be making and testing our own service, we'll want to turn this one off for now to simplify everything. Go to `CDS Services` > `Configure CDS Services` in the top menu, find the entry for `cms-price-check`, and click the yellow `Enabled?` button to disable the service. 
9. Make sure the card doesn't show up anymore!

## Setting up a custom CDS Service
We want our hook to trigger on the same type of action as the CMS Price Check: `medication-prescribe`. In the **CDS Hooks Sandbox**, any time we make a change to the form in `Rx View`, the `medication-prescribe` hook is triggered, and a request is sent to all **CDS Services** that have this hook in their configuration. Our configuration, which can be found in *cds-hooks.js* in the `services` variable, has this hook specified and gets this exact treatment. The **Sandbox** then listens to responses from these services in the form of **Cards**. 	
    
We want Lisa and her physician to receive two **Cards** after Lisa is prescribed a medication for her hypertension:

1. An **informational card** giving Lisa some feedback on her BMI
2. An **app card** that allows Lisa to access a companion SMART on FHIR app to your obesity study. We're obviously not going to build out this app, but we can imagine that it could provide informational services and advice about achieving and keeping a healthy weight, and perhaps be able to consent willing participants to take part in obesity-related studies. For example, information automatically received through FHIR could be used in such a study to pair participants with similar demographics and health metrics who are undergoing different treatments and compare their progression. 

So, how do we get all of this up and running?? 

To save you lots of setup, we created a skeleton CDS Service application for you that has all of individual pieces up and running. You can find it at https://github.com/uwbhi/phi533-cdshook. You'll download the code on your computer and make sure it's running. Then, we will walk through modifying this CDS service and connecting the different pieces to return the two **Cards** mentioned above. 

Lot's to do, so let's go!

## Exercise 2 - Download and Run Skeleton CDS Service

Clone this repo:

```
git clone https://github.com/uwbhi/phi533-cdshook.git && cd phi533-cdshook
```

Or download directly from this link: 
https://github.com/uwbhi/phi533-cdshook/archive/master.zip

Install the dependencies:
```
npm install
```

Run the application:
```
npm start
```

In a separate terminal window, expose your new CDS Service to the Web:

```
ssh -R 80:localhost:3003 serveo.net
```

Make sure to note and copy the forwarding server name!
It should look something like: `https://XXXXX.serveo.net`.

Now go to `https://XXXXX.serveo.net`. You should get the following message:

```
PHI 533 CDS Hook Running!
```

Nice! Your **Service** is up and running!

## Exercise 3 - Add your CDS Service to the Sandbox

Now that we have a **CDS Service** that's available on the web, we need to tell the **Sandbox** about it. 
1. Your **CDS Service** endpoint provides a list of CDS Services when accessed with the following path: `https://XXXXX.serveo.net/cds-services`. Go to this url in your browser to see what it returns. 

2. Click on the `CDS Services` button in the top menu, and choose `Add CDS Service` from the dropdown

3. Fill out the `Discover Endpoint URL:` textbox with your **Service** endpoint: `https://XXXXX.serveo.net/cds-services`. 

4. Click the `Save` button. After a small pause, you should get the following message: `Success: Configured CDS Service(s) found at the discovery endpoint.` 

5. Go through **Exercise 1** again. Make sure that instead of the `Price Check` card, you're recieving a card titled `BMI Information and Recommendations`. 

And Voila! The **CDS Hooks Sandbox** is communicating with your **CDS Service** and getting a nice **Card**!

## Overview of Current CDS Service App

If you open the `phi533-cdshook` that you either created with `git checkout` or extracted from the zip file, you'll see a couple of files. By far the most important for this tutorial is the `cds-hook.js` file. This file contains all of the code for our application, and it's the file we'll be modifying later in the tutorial. Make sure you can open and edit it with your chosen text editor!

So, what does our simple, ~130-line CDS Service actually do? 

The application itself is an [Express JS Web Application](https://expressjs.com/). We don't really need to go into all the setup details - all you need to know is that when we run `npm start`, we make this app run on our local computer and listen to specific incoming web requests (for those interested, it's running on port `3003`).  

When we run the following line in our terminal - `ssh -R 80:localhost:3003 serveo.net` - we expose our local application to the web under the serveo.net domain name; this way, the **CDS Sandbox** has an actual web url to communicate with. 

Our app actually only responds to three specific url patterns. Notice how the `cds-hooks.js` file has `app.get('/'...`, `app.get('/cds-services'...`, and `app.post('/cds-services/phi533-prescribe'...` sections. Our app will respond to two `GET` requests and one `POST` request on these three paths. 

Also, notice all of the `console.log()` sections in the `cds-hook.js` file. We put these in to output some intermediate results to the terminal where `npm start` was run. This way, you can follow the app live by looking at the terminal!

All of the CDS Hooks logic lives in the code section preceded by this aptly-named comment:
```
/**
 * Actual CDS Hook logic here
 */
``` 

This is a quick overview of what's happening:

1. The app recieves a request from the **Sandbox** that has some data. You can see what data the sandbox sends by unfurling the `Request` tab on the `CDS Service Exchange` section of the **Sandbox**.

2. The app queries a hardcoded **FHIR Endpoint** whose url is stored in the `FHIR_SERVER_PREFIX` variable three times to get gender, age, height, and weight data on a patient with the hardcoded id `SMART-1551992`. It then saves the relevant info in some variables, outputs the variables to the console, and for now, promptly disregards
them. 

3. Next, the app sets up some information that the **BMI Calculator API** requires to send back BMI recommendations. Currently, this information is also hard-coded and stored in the `bmiData` variable. The info is sent to the **BMI Calculator**, and the results are passed to the `publicHealthResponse` function.

4. The `publicHealthResponse` function reads the BMI recommendations, formats them into a human-readable message, and returns an **Information Card**, created to CDS Hook specifications, that contains the message. 

5. Finally, this recommendation **Card** is returned by the app to the **CDS Hooks Sandbox**, where it is read and displayed to the user.
 
## Exercise 4 - Modify BMI Calculator Request to use Patient-specific data.
Right now, the recommendations sent back to the **Sandbox** never change, because we're using static data
to send to the **BMI Calculator API**. See [this line](https://github.com/uwbhi/phi533-cdshook/blob/d7da4e9e40a52d476e1111bea1e82227c7c1ae85/cds-hook.js#L104). 

You can check this by switching **Patients** in the **Sandbox** and noticing the the BMI recommendations never change. 

Let's fix this, and send information about the patient that we're actually treating!

To save you the time of searching through API documentations and returned data objects, we pulled out all the information you'll need to connect the dots in the sample code. The useful variables are defined in these lines:

*/cds-hook.js*
```node
  //...
  const hook = req.body.hook; // Type of hook
  const fhirServer = req.body.fhirServer; // URL for FHIR Server endpoint
  const patient = req.body.patient; // Patient Identifier
  const reason = req.body.context.medications[0].reasonCodeableConcept.text // Chosen Problem to Treat
  //...

  //...
  const gender = patientReq.gender;
  const birthDate = patientReq.birthDate;
  const weight = weightReq.entry[0].resource.valueQuantity.value;
  const height = heightReq.entry[0].resource.valueQuantity.value;
  const age = moment().diff(birthDate, 'years');
  //...
```

We're going to use these variables to make the calls for Patient data and BMI recommendations depend on the information sent from the **Sandbox**.

### Get Patient Age, Sex, Weight, and Height
Our patient id is stored in the variable `patient`, and the FHIR server endpoing where this patient's information exists is stored in `fhirServer`. We want the requests for patient age, gender, weight, and height to use these variables.

1.  Change the following lines in */cds-hook.js*:
    ```node
      const patientReq = await getAsync(buildPatientURL('SMART-1551992'));
      const weightReq = await getAsync(buildObsURL('SMART-1551992', 'weight'));
      const heightReq = await getAsync(buildObsURL('SMART-1551992', 'height'));
    ```
    to:
    ```node
      const patientReq = await getAsync(buildPatientURL(patient, fhirServer));
      const weightReq = await getAsync(buildObsURL(patient, 'weight', fhirServer));
      const heightReq = await getAsync(buildObsURL(patient, 'height', fhirServer));
    ```

2.  Change the helper functions to accept a `fhir_server` parameter. These lines in */cds-hook.js*:
    ```node
      const buildObsURL = (patientId, text) => `${FHIR_SERVER_PREFIX}/Observation?patient=${patientId}&code:text=${text}&_sort:desc=date&_count=1`;
      const buildPatientURL = (patientId) => `${FHIR_SERVER_PREFIX}/Patient/${patientId}`;
    ```
    should be replaced with these lines: 
    ```node
      const buildObsURL = (patientId, text, fhir_server) => `${fhir_server}/Observation?patient=${patientId}&code:text=${text}&_sort:desc=date&_count=1`;
      const buildPatientURL = (patientId, fhir_server) => `${fhir_server}/Patient/${patientId}`;
    ```
3.  We want to send the **BMI Tool** the correct units. Currently, we're ignoring the unit information that's sent back from the **FHIR Endpoint**. To pass this info on to the **BMI Calculator**, we need to change the `weight` and `height` variable definition up a bit. 
    Change the following lines in */cds-hook.js*:
    ```node
      const weight = weightReq.entry[0].resource.valueQuantity.value;
      const height = heightReq.entry[0].resource.valueQuantity.value;

      //...
      
      console.log('Weight: ', weight);
      console.log('Height: ', height);      
    ```
    To:
    ```node
      const weight = weightReq.entry[0].resource.valueQuantity;
      const height = heightReq.entry[0].resource.valueQuantity;

      //...

      console.log('Weight: ', weight.value);
      console.log('Height: ', height.value); 
    ```
### Update the data sent to the BMI Calculator
We're creating the information that we send to the **BMI Calculator API** with the following code:
```node
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
```
As you can see, this code has many hard-coded values. We need to replace them with the variables we just created.

Replace these lines with the following code in the */cds-hook.js* file: 
```node
  const bmiData = await bmiPostAsync({
    age: age,
    sex: (gender == 'female' ? 'f' : 'm'),
    weight: {
      value: Math.round(weight.value),
      unit: weight.unit
    },
    height: {
      value: Math.round(height.value),
      unit: height.unit
    }
  });
```

### Test Your Handiwork!
1. Reload the Sandbox by going to https://sandbox.cds-hooks.org/. Make sure your CDS Service is still added.

2. You should be in *Daniel X. Adam's* chart. Go to the `Rx View`, and again run through our scenario from **Exercise 1**. Note the information returned by the card.

3. Switch patients to *Lisa P. Coleman* and make sure the card you recieve has patient-specific information that's different from *Daniel's*.

## Exercise 5 - Return Cards only for Hypertensive disorder or Essential hypertension
Right now, our **CDS Service** returns cards for all incoming requests. However, we're making a CDS Hook that should only apply to individuals with certain metabolic-related diagnoses and related treatments. We're going to add a bit of logic that will allow our **Service** to only return **Cards** to those patients with *Hypertensive disorder* or *Essential hypertension*. 

The specs (https://cds-hooks.org/specification/1.0/) mention that when no decision support is available, the **CDS Service** should return and empty array of cards. So let's make that happen!

1. In the right side of the **Sandbox** screen labeled **CDS Service Exchange**, select your `phi533-prescribe` service from the `Select a Service` dropdown. Then, click on the `Request` section to see what data is being sent to our application by the **Sandbox**.

2. Look for the `reasonCodeableConcept` key and note the `text` field. It should be the same as the option you chose in the `Treating` dropdown. We're going to only send back a card for requests where this `text` field is equal to `Hypertensive disorder` or `Essential hypertension`

3. Find this line in the */cds-hook.js* file: `const bmiInfo = publicHealthResponse(bmiData);`

4.  Replace it with the following `if/else` statement: 
    ```node
      var cardArray = {};
      if (reason == "Hypertensive disorder" || reason == "Essential hypertension") {
        cardArray = publicHealthResponse(bmiData);
      } else {
        cardArray = { "cards": [] }
      }
    ```

5.  Update these lines in */cds-hook.js*:
    ```node
      console.log("Responding with: \n" + JSON.stringify(bmiInfo, null, ' '));
      
      res.send(bmiInfo);
    ```
    with:
    ```node
      console.log("Responding with: \n" + JSON.stringify(cardArray, null, ' '));
      res.send(cardArray);
    ```
    This allows us to send back the updated variable, which either contains an empty **Card** array or our relevant cards. 

6. In the **Sandbox**, test out the new functionality; You should be only see cards when `Hypertensive disorder` is chosen in the `Treating:` dropdown!

## Exercise 6 - Add an App Link Card to your CDS Response
Pretend you have a SMART on FHIR app that can be launched at the following url:
`https://smart.nationalobesitystudy.com/launch`. 

You don't have to worry about the details of this app; just know that as part of the SMART specs, 
SMART apps have a launch URL that an EHR can hit, and which is able to launch the app with the context of the current EHR patient. 

### Use CDS Hooks API documentation to figure out how to format your card
1. Visit http://cds-hooks.org/specification/1.0/#card-attributes 

2. Search the docs for information about the `links` attribute attribute. This attribute can be used to return cards that can launch specific SMART on FHIR apps straight from the EHR. Search for `Example response` on the page to see an example - very self-explanatory. 

3.  Add the following card - modeled on the example we just saw - to your `cards` array. 
    ```json
      {
          "summary": "Obesity Companion",
          "indicator": "info",
          "detail": "You're Eligible for the Obesity Companion App!",
          "source": {
            "label": "National Obesity Study"
          },
          "links": [
            {
              "label": "SMART Obesity Companion App",
              "url": "https://smart.nationalobesitystudy.com/launch",
              "type": "smart"
            }
          ]
        }
    ```

    This array can be found in the the `publicHealthResponse` function in the *cds-hook.js* file. It should look like this: 

    ```node
      var cards = { "cards": [
          {
            "summary": "👨🏻‍⚕️ BMI Information and Recommendations",
            "detail": bmiMessage,
            "source": {
              "label": "WA DOH"
            },
            "indicator": "info",
            "suggestions": []
          }, 
          // Put 2nd Card Here!
        ]
      }
    ```

4. Test out your card on the **CDS Hooks Sandbox** by again running through the **Scenario**
