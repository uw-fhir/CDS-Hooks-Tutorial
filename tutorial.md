# Hooking It All Up

We learned about the standards (FHIR, SMART on FHIR, CDS Hooks) and tought about how they can foster innovation and improvement in the public health sphere. Now let's combine all of that fresh knowledge to create and test our own **Public Health CDS Service**

## Some Prereq's

1. We'll be using the official CDS Hooks sandbox that can be accessed [here](https://sandbox.cds-hooks.org). Open up the page and play around with it a bit!

2. Since each of your computers will be used to temporarily host a CDS Service, we'll need to make sure all of you have a couple things installed. 

    a. **Node.js, npm, and ssh**: We'll be booting up a simple server that will listen to incoming CDS requests and respond with the appropriate cards. This server runs on `Node.js`; `npm` is the Node.js package manager that allows for a quick setup, and an `ssh` client will be used to listen to incoming requests from the CDS Sandbox. Follow the instructions [here](https://github.com/uwbhi/phi533-cdshook/readme.md) to install them!  

    b. **Some capable text editor**: If you don't have one, you should quickly download one. Here are some options:
    
      * [Atom](https://atom.io/)
      * [Sublime Text](https://www.sublimetext.com/)
      * [Notepad++](https://notepad-plus-plus.org/download/) (Windows only)
      * [VS Code](https://code.visualstudio.com/) (more advanced)

    c. **Git**: (optional) We'll use it to download the server code. If you don't want to install it, you can download the code in a .zip file.


## The Scenario
You’re working on a nation-wide project whose goal is to study and combat obesity in the United States. Your job involves designing a CDS Hook that supports the study objectives. The hook should allow you to:

1. Report on obesity-related health issues at the point of care
2. Provide feedback to the patient on how their health stacks up with their peers
3. Allow patient to be easily recruited as a participants into a large-scale longitudinal obesity study

In this specific scenario, patient **Lisa P. Coleman** is visiting her physician. The physician diagnoses her with **Hypertensive disorder**, and is prescribing **Lopressor** to treat her high blood pressure. 

## Exercise 1 - Acting out the scenario in CDS Sandbox
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
We want our hook to trigger on the same type of action as the CMS Price Check - `medication-prescribe`. In the **Sandbox**, this type of hook gets triggered when the scenario above is acted out, and a request is sent to all **CDS Services** with this type of hook. The **Sandbox** then listens to responses from these services in the form of **Cards**. 	
    
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

Nice! Your service is up and running!

## Exercise 3 - Add your CDS Service to the Sandbox

And Voila! The **CDS Hooks Sandbox** is communicating with your **CDS Service** and getting a nice **Card**. 

## Exercise 4 - Modify BMI Calculator Request to use Patient-specific data.
Right now, the recommendations sent back to the **Sandbox** never change, because we're using static data
to send to the **BMI Calculator API** see [this line](https://github.com/uwbhi/phi533-cdshook/blob/d7da4e9e40a52d476e1111bea1e82227c7c1ae85/cds-hook.js#L104). Let's fix this, and send information about the patient that we're actually treating!


### Get Patient Age and Sex

### Get Patient Height and Weight

### Update BMI Calculator Data

### Test Your Handiwork!
Switch patients

1. Reload the Sandbox by going to https://sandbox.cds-hooks.org/. Make sure your CDS Service is still added.

2. You should be in *Daniel X. Adam's* chart. Go to the `Rx View`, and choose  


## Exercise 5 - Return Cards only for Hypertensive disorder
Right now, our **CDS Service** returns cards for all incoming requests. However, we're making a CDS Hook that should only apply to individuals with certain metabolic-related diagnoses and related treatments. We're going to add a bit of logic that will allow our **Service** to only return **Cards** to those patients with *Hypertensive disorder*. 

The specs (https://cds-hooks.org/specification/1.0/) mention that when no decision support is available, the **CDS Service** should return and empty array of cards. So let's make that happen!

1. In the **Sandbox**, check the `Request` section of the `phi533-prescribe` service.
2. Look for the `reasonableCodeableConcept` key and note the `text` field. It should be the same as the option you chose in the `Treating` dropdown. We're going to only send back a card for requests where this `text` field is equal to `Hypertensive disorder`
3. Find this line in your code: `const bmiInfo = publicHealthResponse(bmiData);`
4. Replace it with the following `if/else` statement: 
```
```
5. Update this line `res.send(bmiInfo);` to `res.send(cardArray);` to send the newly created variable.



## Exercise 6 - Add an App Link Card to your CDS Response
Pretend you have a SMART on FHIR app that can be launched at the following url:
`https://smart.example.com/launch`. 

You don't have to worry about the details of this app; just know that as part of the SMART specs, 
SMART apps have a launch URL that an EHR can hit, and which is able to launch the app with the context of the current EHR patient. 

### Use CDS Hooks API documentation to figure out how to format your card
1. Visit http://cds-hooks.org/specification/1.0/#card-attributes 
2. Search the docs for information about how to add a `links` card attribute to a card.
3. Add the following card to your `cards` array that gets returned in the response:
```
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
4. Test out your card on the **CDS Hooks Sandbox**!