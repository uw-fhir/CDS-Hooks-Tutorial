# PHI 533 Demo CDS Hook

This project creates an HTTP endpoint that can be invoked as part of the CDS Hooks workflow in the [sandbox](http://sandbox.cds-hooks.org/).

# Instructions

Install the prerequisites, then run the application, and expose your endpoint by creating an SSH tunnel.

## Prerequisites

Install [NodeJS](https://nodejs.org/en/download/), and if you're on Windows, an SSH client (e.g. [PuTTY](https://www.putty.org/)).

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

In a separate terminal window, expose the endpoint:

```
ssh -R 80:localhost:3003 serveo.net
```

Note the forwarding server name (something like `https://XXXXX.serveo.net`).

## Configure Sandbox

Navigate to the [CDS Hooks sandbox](http://sandbox.cds-hooks.org/). Click the **CDS Services** link at the
top right and choose **ADD CDS Service**.

In the input box, enter `https://XXXXX.serveo.net/cds-services`, using the SSH tunnel output from above, but appending `/cds-services` to the URL.

## Testing

1. Navigate to the [Rx View](http://sandbox.cds-hooks.org/#{"hook":"medication-prescribe"}), and select any problem from the **Treating** dropdown box.

2. Note the Public Health Alert card being shown.

3. Pat yourself on the back and get a beer 🍺.
