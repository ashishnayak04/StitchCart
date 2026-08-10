const Stripe = require("stripe");

let _client = null;

const getStripeClient = () => {
  if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error("STRIPE_SECRET_KEY is not configured");
  }
  if (!_client) {
    _client = Stripe(process.env.STRIPE_SECRET_KEY);
  }
  return _client;
};

module.exports = { getStripeClient };
