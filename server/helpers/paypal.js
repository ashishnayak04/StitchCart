const paypal = require("paypal-rest-sdk");

paypal.configure({
  mode: "sandbox",
  client_id: "AaIiyUcVcKd3buFvQ6ri78YQiXr7SjD9MmDXJ2KXhKK4sh6SiLFeyAXtHr1H_veuNRVXF9Tuk32ThVAu",
  client_secret: "ENFHKAtNaX4lT0Qo8aKe2eMHwXjNcTSRV1AivX41IPwISvFJ3oDmZ-oipgg3byBj0hNQPmUXm7EQqAFl",
});

module.exports = paypal;
