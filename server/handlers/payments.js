import {
  makeFullPayment,
  CreateACustomer,
  CreateASubscription,
  CreateATestClock,
  CreateAProduct,
  CreateAPrice,
  CreateInitalPrice,
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
  const { email, installments, amount } = req.body;

  const testClock = await CreateATestClock();

  const customer = await CreateACustomer(email, testClock);

  const product = await CreateAProduct(
    "Test Installments",
    "Pay in installments for a product"
  );

  const initalPrice = await CreateInitalPrice(product.id);

  const price = await CreateAPrice(product.id, amount, installments);

  const subscription = await CreateASubscription(
    customer.id,
    initalPrice.id,
    price.id,
    installments
  );

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

export const changeCard = async (req, res) => {
  try {
    const { customerId, paymentMethodId } = req.body;

    const customer = await stripe.customers.retrieve(customerId);
    const paymentMethod = await stripe.paymentMethods.retrieve(paymentMethodId);

    const invoiceSettings = {
      default_payment_method: paymentMethod.id,
    };

    await stripe.customers.update(customerId, {
      invoice_settings: invoiceSettings,
    });

    res.send({
      message: "Card updated successfully",
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
