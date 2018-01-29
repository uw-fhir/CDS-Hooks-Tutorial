# Hooking It All Up

We learned about the standards (FHIR, SMART on FHIR, CDS Hooks) and tought about how they can foster innovation and improvement in the public health sphere. Now let's combine all of that fresh knowledge to create and test our own **Public Health CDS Service**

## Some Prereq's

1. We'll be using the official CDS Hooks sandbox that can be accessed here: (sandbox.cds-hooks.org)[sandbox.cds-hooks.org]. Open up the page and play around with it a bit!

2. Since each of your computers will be used to temporarily host a CDS Service, we'll need to make sure all of you have a couple things installed. 

    a. **Node.js, npm, and ssh**: We'll be booting up a simple server that will listen to incoming cds requests and respond with the appropriate cards. This server runs on `Node.js`; `npm` is the Node.js package manager that allows for a quick setup, and an `ssh` client will be used to listen to incoming requests from the CDS Sandbox. Follow the instructions (here)[https://github.com/uwbhi/phi533-cdshook] to install them!  

    b. **Some capable text editor**: If you don't have one, you should quickly download one. Here are some options:

    c. **Git**: (optional) We'll use it to download the server code. If you don't want to install it, you can download the code in a .zip file.


## The Scenario
You’re working on a nation-wide project whose goal is to both study and combat obesity in the United States. Your job involves designing a CDS Hook that supports the study objectives. The hook should allow you to:  
    1. Report on obesity-related health issues at the point of care 
    2. Provide feedback to the patient on how their health stacks up with their peers
    3.  the metabolic state of the patient, and 3) Recruit participants into a large-scale longitudinal obesity study. 
	In this specific scenario, patient Lisa P. Coleman is visiting her physician. The physician diagnosed her with Hypertensive disorder, and is prescribing Lopressor to Lisa to treat her high blood pressure. Your CDS Hook is designed to trigger (among other things) on the prescription of such a hypertension drug (perhaps in order to find participants with different pharmaceutical treatments for comparison). 
	Lisa and her physician receive two kinds of cards after the CDS Hook trigger: 1) an informational card comparing Lisa’s health metrics to those receiving the same treatment, and 2) an app card that allows Lisa access an app can give informational services and can consent willing participants to take part in a Info automatically received through FHIR can be used, for example, to pair participants with similar demographics and/or health metrics undergoing different interventions, and then track their progress). 
