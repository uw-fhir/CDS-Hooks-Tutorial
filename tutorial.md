# Hooking It All Up

We learned about the standards (FHIR, SMART on FHIR, CDS Hooks) and tought about how they can foster innovation and improvement in the public health sphere. Now let's combine all of that fresh knowledge to create and test our own **Public Health CDS Service**

## Some Prereq's

1. We'll be using the official CDS Hooks sandbox that can be accessed here: (sandbox.cds-hooks.org)[sandbox.cds-hooks.org]. Open up the page and play around with it a bit!

2. Since each of your computers will be used to temporarily host a CDS Service, we'll need to make sure all of you have a couple things installed. 

    a. **Node.js, npm, and ssh**: We'll be booting up a simple server that will listen to incoming cds requests and respond with the appropriate cards. This server runs on `Node.js`; `npm` is the Node.js package manager that allows for a quick setup, and an `ssh` client will be used to listen to incoming requests from the CDS Sandbox. Follow the instructions (here)[https://github.com/uwbhi/phi533-cdshook] to install them!  

    b. **Some capable text editor**: If you don't have one, you should quickly download one. Here are some options:

    c. **Git**: (optional) We'll use it to download the server code. If you don't want to install it, you can download the code in a .zip file.


## The Scenario
You’re working on a nation-wide project whose goal is to study and combat obesity in the United States. Your job involves designing a CDS Hook that supports the study objectives. The hook should allow you to:  
    1. Report on obesity-related health issues at the point of care. 
    2. Provide feedback to the patient on how their health stacks up with their peers.
    3. Allow patient to be easily recruited as a participants into a large-scale longitudinal obesity study. 

In this specific scenario, patient **Lisa P. Coleman** is visiting her physician. The physician diagnoses her with **Hypertensive disorder**, and is prescribing **Lopressor** to Lisa to treat her high blood pressure. 

## Exercise 1 - Acting out the scenario in CDS Sandbox
1. Go to https://sandbox.cds-hooks.org
2. Click on `Change Patient` on the top menu
3. Select `Lisa P. Coleman`
4. Click the `Save` button
5. Click on `Rx View` on the top menu
6. Select `Hypertensive disorder` from `Treating:` dropdown
7. Type in `Lopressor` into `Medication` box, and select `Lopressor` => `Metoprolol Tartrate 50 MG Oral Tablet [Lopressor]`. You should see a **CMS Price Check** card returned by one of the demo CDS services. Since we'll be making and testing our own service, we'll want to turn this one off for now to simplify everything.
8. Go to `CDS Services` > `Configure CDS Services` in the top menu, find the entry for `cms-price-check`, and click the yellow `Enabled?` button to disable the service. 
9. Make sure the card doesn't show up anymore!

## Setting up a custom CDS Service
We want our hook to trigger on the same type of action as the CMS Price Check - `medication-prescribe`. In the **Sandbox**, this type of hook gets triggered when the scenario above is acted out, and a request is sent to all **CDS Services** with this type of hook. The **Sandbox** then listens to responses from these services in the form of **Cards**. 	
    
We want Lisa and her physician to receive two **Cards** after Lisa is prescribed a medication for her hypertension:

1. An **informational card** giving Lisa some feedback on her BMI
2. An **app card** that allows Lisa to access a companion SMART on FHIR app to your obesity study. We're obviously not going to build out this app, but we can imagine that it could provide informational services and advice about achieving and keeping a healthy weight, and perhaps be able to consent willing participants to take part in obesity-related studies. For example, information automatically received through FHIR could be used in such a study to pair participants with similar demographics and health metrics who are undergoing different treatmentss and compare their progression. 

So, how do we get all of this up and running?? 

To save you lots of setup, we created a skeleton CDS Service application for you that has all of individual pieces up and running. You can find it at https://github.com/uwbhi/phi533-cdshook. You'll download the code on your computer and make sure it's running. Then, we will walk through modifying this CDS and connecting the different pieces to return the two **Cards** mentioned above. 

Lot's to do, so let's go!

## Exercise 2 - Download and Run Skeleton CDS Service

Nice! Your service is up and running!

## Exercise 3 - Publish your Service to the Web

## Exercise 4 - Add your CDS Service to the Sandbox

And Voila! The **CDS Hooks Sandbox** is communicating with your **CDS Service** and getting a nice Card 

## Exercise 5 - Modify BMI Calculator Request to use Patient-specific data.
Right now, the recommendations sent back to the **Sandbox** never change, because we're using static data
to send to the **BMI Calculator API** (see this line)[https://github.com/uwbhi/phi533-cdshook/blob/d7da4e9e40a52d476e1111bea1e82227c7c1ae85/cds-hook.js#L104]. Let's fix this, and send information about the patient that we're actually treating!


### Get Patient Age and Sex

### Get Patient Height and Weight

### Update BMI Calculator Data

### Test Your Handiwork!

## Exercise 6 - Add an App Link Card to your CDS Response

### Use CDS Hooks API to figure out how to format your card
1. https://cds-hooks.org/specification/1.0/
2. 

