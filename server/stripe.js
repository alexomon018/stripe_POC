import Stripe from "stripe";
import * as env from "dotenv";

env.config();

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const MakeUrlForAdvancedRent = async (customerId, amount) => {
  const paymentIntent = await stripe.paymentIntents.create({
    amount: amount,
    currency: "gbp",
    payment_method_types: ["card"],
  });

  return paymentIntent;
};
export const MakeUrlForDirectDebit = async (customerId, amount) => {};

export const MakeUrlForCardPayment = async (customerId, amount) => {
  const paymentIntent = await stripe.paymentIntents.create({
    amount: amount,
    currency: "gbp",
    payment_method_types: ["card"],
  });

  return paymentIntent;
};

export const CreateACustomer = async (paymentMethod, email) => {
  const customer = await stripe.customers.create({
    email: email,
    payment_method: paymentMethod,
    invoice_settings: {
      default_payment_method: paymentMethod,
    },
  });

  return customer;
};

export const CreateASubscription = async (customerId) => {
  const subscription = await stripe.subscriptions.create({
    customer: customerId,
    items: [
      {
        price: "price_1Mw3tkGc6iCAjOrPmVHa47K7",
      },
    ],
    expand: ["latest_invoice.payment_intent"],
  });

  return subscription;
};
