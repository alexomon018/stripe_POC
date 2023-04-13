import {
  makeFullPayment,
  CreateACustomer,
  CreateASubscription,
} from "../stripe.js";

export const makeSinglePayment = async (req, res) => {
  try {
    const session = req.session || {};

    if (!session.customerId) {
      res.status(400).send({
        error: {
          message: "You must be logged in to make a payment",
        },
      });
    }

    //create a customer with stripe

    const paymentIntent = await makeFullPayment(
      session.customerId,
      calculateOrderAmount(session?.amount)
    );
    res.send({
      clientSecret: paymentIntent.client_secret,
      publishableKey: process.env.STRIPE_PUBLISHABLE_KEY,
    });
  } catch (error) {
    console.log("error", error);
    res.status(400).send({
      error: {
        message: error.message,
      },
    });
  }
};

export const makeInstallmentPayment = async (req, res) => {
  const { email, payment_method } = req.body;

  const customer = await CreateACustomer(email, payment_method);

  const subscription = await CreateASubscription(customer.id);

  const subscriptionStatus = subscription.latest_invoice.payment_intent.status;
  const clientSecret = subscription.latest_invoice.payment_intent.client_secret;
  const subscriptionId = subscription.id;

  res.send({
    clientSecret,
    subscriptionStatus,
    subscriptionId,
  });
};
const calculateOrderAmount = (amount) => {
  // Replace this constant with a calculation of the order's amount
  // Calculate the order total on the server to prevent
  // people from directly manipulating the amount on the client
  return amount;
};

export const getInstallmentPayment = async (req, res) => {
  try {
    const session = req.session || {};

    if (!session.customerId) {
      res.status(400).send({
        error: {
          message: "You must be logged in to make a payment",
        },
      });
    }

    res.send({
      publishableKey: process.env.STRIPE_PUBLISHABLE_KEY,
    });
  } catch (error) {
    console.log("error", error);
    res.status(400).send({
      error: {
        message: error.message,
      },
    });
  }
};
