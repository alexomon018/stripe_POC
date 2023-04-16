import React, { useEffect, useState } from "react";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { useBooking } from "./bookingContext";
import CheckoutForm from "./CheckoutForm";

function Instalments() {
  const { randomUser } = useBooking();
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
    amount: 350, //is a must for some reason it doesn't charge this amount first
    currency: "usd",
    paymentMethodTypes: ["card"],
    paymentMethodCreation: "manual",
  };

  return (
    <>
      {stripePromise && (
        <Elements stripe={stripePromise} options={options}>
          <CheckoutForm randomUser={randomUser} />
        </Elements>
      )}
    </>
  );
}

export default Instalments;
