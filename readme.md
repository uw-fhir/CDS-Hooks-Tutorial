# PHI 533 Demo CDS Hook

This project creates an HTTP endpoint that can be invoked as part of the CDS Hooks workflow in the [sandbox](http://sandbox.cds-hooks.org/).

# Instructions

Install the prerequisites, then run the application, and expose your endpoint by creating an SSH tunnel.

## Prerequisites

Install [NodeJS](https://nodejs.org/en/download/), and if you're on Windows, an SSH client. 

One option is [PuTTY](https://www.putty.org/).

Newer Windows 10 releases have an SSH client built in that can be enabled by following these instructions: 
https://www.howtogeek.com/336775/how-to-enable-and-use-windows-10s-built-in-ssh-commands/

## Run

Clone this repo:

```
git clone https://github.com/uwbhi/phi533-cdshook.git && cd phi533-cdshook
```

Install the dependencies:

```
npm install
```

Run the application:

```
npm start
```

## Testing

### Basic Check

Navigate to `https://localhost:3003/` and make sure you see a message that the service is running.

### Configure Sandbox

Navigate to the [CDS Hooks sandbox](http://sandbox.cds-hooks.org/). Click the **CDS Services** link at the
top right and choose **ADD CDS Service**.

In the input box, enter `https://localhost:3003/cds-services`, using the SSH tunnel output from above, but appending `/cds-services` to the URL.

Then test the config:

1. Navigate to the Rx View (by clicking **Rx View** from the navbar at the top), and select any problem from the **Treating** dropdown box.

2. Note the Public Health Alert card being shown.

3. Pat yourself on the back and get a beer 🍺.
