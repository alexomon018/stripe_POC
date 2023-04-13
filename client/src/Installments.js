import React, { useEffect, useState } from "react";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { useBooking } from "./bookingContext";
import CheckoutForm from "./CheckoutForm";

function Instalments() {
  const { randomUser, amount } = useBooking();
  const [stripePromise, setStripePromise] = useState(null);

  useEffect(() => {
    fetch("/installments").then(async (r) => {
      const { publishableKey } = await r.json();
      setStripePromise(loadStripe(publishableKey));
    });
  }, []);

  const options = {
    mode: "subscription",
    // Fully customizable with appearance API.
    appearance: {
      /*...*/
    },
    amount: parseFloat(amount),
    currency: "gbp",
    paymentMethodTypes: ["card"],
    paymentMethodCreation: "manual",
  };

  return (
    <Elements stripe={stripePromise} options={options}>
      <CheckoutForm randomUser={randomUser} />
    </Elements>
  );
}

export default Instalments;
