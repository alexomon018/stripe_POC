import express from "express";
import { stripe } from "../stripe.js";
import { SaveDatabase, database } from "./support.js";
import { CreateASubscriptionSchedule } from "../stripe.js";

export const setStripeWebhook = (app) => {
  app.post(
    "/webhook",
    express.json({ type: "application/json" }),
    async (req, res) => {
      const event = req.body;

      console.log(`Got event type ${event.type}`);
      switch (event.type) {
        case "payment_intent.succeeded":
          const paymentIntent = event.data.object;
          console.log("PaymentIntent was successful!");
          const transaction = await paymentIntentToTransaction(paymentIntent);
          database.transactions.push(transaction);
          SaveDatabase(database);
          res.status(200).end();
          break;
        case "payment_method.attached":
          const paymentMethod = event.data.object;
          console.log("PaymentMethod was attached to a Customer!");
          break;
        case "payout.created":
          const payout = event.data.object;
          console.log("Payout was created!");
          break;
        case "customer.created":
          let stripeCustomer = event.data.object;
          const customer = {
            CustomerId: stripeCustomer.metadata["customerId"],
            Email: stripeCustomer.email,
            Id: stripeCustomer.id,
            Name: stripeCustomer.name,
          };

          console.log("Customer was created!");
          break;
        case "customer.subscription.created":
          const subscriptionSession = event.data.object;
          CreateASubscriptionSchedule(subscriptionSession);
          res.sendStatus(200);
        default:
          return res.status(400).end();
      }
    }
  );
};

const paymentIntentToTransaction = async (paymentIntent) => {
  const transaction = {
    Amount: paymentIntent.amount,
    BuildingName: paymentIntent.metadata["buildingName"],
    BookingId: paymentIntent.metadata["bookingId"],
    Building: paymentIntent.metadata["building"],
    Fund: paymentIntent.metadata["fund"],
    Facility: paymentIntent.metadata["facility"],
    CustomerId: paymentIntent.metadata["customerId"],
    StripeCustomerId: paymentIntent.customer,
    Created: new Date(paymentIntent.created * 1000),
    Id: paymentIntent.id,
    Status: paymentIntent.status,
  };

  if (paymentIntent.latest_charge) {
    let charge = await stripe.charges.retrieve(paymentIntent.latest_charge);
    if (charge) {
      transaction.ChargeId = charge.id;
      transaction.method = charge.payment_method_details.type;
    }
  }

  return transaction;
};
