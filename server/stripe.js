import Stripe from "stripe";
import * as env from "dotenv";

env.config();

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const makeFullPayment = async (customerId, amount) => {
  const paymentIntent = await stripe.paymentIntents.create({
    amount: amount,
    currency: "gbp",
    payment_method_types: ["card"],
  });

  return paymentIntent;
};
export const MakeUrlForDirectDebit = async (customerId, amount) => {};

export const CreateACustomer = async (email, payment_method) => {
  const customer = await stripe.customers.create({
    email: email,
    payment_method: payment_method,
    invoice_settings: {
      default_payment_method: payment_method,
    },
  });

  return customer;
};

export const CreateASubscription = async (customerId) => {
  const subscription = await stripe.subscriptions.create({
    customer: customerId,
    items: [
      {
        price: "price_1MwMNlGc6iCAjOrPeWZkKzXc",
      },
    ],
    payment_behavior: "default_incomplete",
    payment_settings: { save_default_payment_method: "on_subscription" },
    expand: ["latest_invoice.payment_intent"],
  });

  return subscription;
};
