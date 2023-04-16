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

export const CreateASubscription = async (customerId) => {
  const subscription = await stripe.subscriptions.create({
    customer: customerId,
    items: [
      {
        price: "price_1MxDMLGc6iCAjOrPzygEiZpF",
      },
    ],
    payment_behavior: "default_incomplete",
    payment_settings: { save_default_payment_method: "on_subscription" },
    expand: ["latest_invoice.payment_intent"],
    currency: "usd",
    // payment_method_types: ["card"],
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
  let schedule = await stripe.subscriptionSchedules.create({
    from_subscription: subscriptionSession.id,
  });

  const phases = schedule.phases.map((phase) => ({
    start_date: phase.start_date,
    end_date: phase.end_date,
    items: phase.items,
  }));

  schedule = await stripe.subscriptionSchedules.update(schedule.id, {
    end_behavior: "cancel",
    phases: [
      ...phases,
      {
        items: [
          {
            price: "price_1MxDMLGc6iCAjOrPd8rePsIB",
            quantity: 1,
          },
        ],
        iterations: 3,
      },
    ],
  });
};
