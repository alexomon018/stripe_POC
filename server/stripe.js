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

export const CreateACustomer = async (email, testClock) => {
  const customer = await stripe.customers.create({
    email: email,
    test_clock: testClock.id,
  });

  return customer;
};

export const CreateASubscription = async (
  customerId,
  initalPriceId,
  priceId,
  installments
) => {
  const subscription = await stripe.subscriptions.create({
    customer: customerId,
    items: [
      {
        price: initalPriceId,
        quantity: 1,
      },
    ],
    payment_behavior: "default_incomplete",
    payment_settings: { save_default_payment_method: "on_subscription" },
    expand: ["latest_invoice.payment_intent"],
    currency: "usd",
    metadata: {
      priceId: priceId,
      installments: installments,
    },
  });

  return subscription;
};

export const CreateATestClock = async () => {
  const testClock = await stripe.testHelpers.testClocks.create({
    frozen_time: parseInt(new Date().getTime() / 1000),
  });

  return testClock;
};

export const CreateASubscriptionSchedule = async (subscriptionSession) => {
  const { metadata } = subscriptionSession;

  let schedule = await stripe.subscriptionSchedules.create({
    from_subscription: subscriptionSession.id,
  });

  const phases = schedule.phases.map((phase) => ({
    start_date: phase.start_date,
    end_date: phase.end_date,
    items: phase.items,
  }));

  console.log("phases", phases);

  schedule = await stripe.subscriptionSchedules.update(schedule.id, {
    end_behavior: "cancel",
    phases: [
      ...phases,
      {
        items: [
          {
            price: metadata.priceId,
            quantity: 1,
          },
        ],
        iterations: metadata.installments + 1,
        proration_behavior: "none",
      },
    ],
  });

  console.log("schedule", schedule);
};

export const GetCustomer = async (customerId) => {
  const customer = await stripe.customers.retrieve(customerId);

  return customer;
};

export const CreateAProduct = async (name, description) => {
  const product = await stripe.products.create({
    name: name,
    description: description,
  });

  return product;
};

export const CreateInitalPrice = async (productId) => {
  const price = await stripe.prices.create({
    unit_amount: 10000,
    currency: "usd",
    recurring: {
      interval: "month",
    },
    product: productId,
  });

  return price;
};

export const CreateAPrice = async (productId, amount, installments) => {
  let newAmount;
  let deductedAmount = amount - 100;

  if (installments) {
    newAmount = deductedAmount / parseInt(installments);
    newAmount = Math.round(newAmount * 100) / 100;
  }

  const price = await stripe.prices.create({
    unit_amount: newAmount,
    currency: "usd",
    recurring: {
      interval: "month",
    },
    product: productId,
  });

  return price;
};
