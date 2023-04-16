import { useEffect, useState } from "react";
import { Elements } from "@stripe/react-stripe-js";
import CheckoutForm from "./CheckoutForm";
import { loadStripe } from "@stripe/stripe-js";
import { useBooking } from "./bookingContext";

function Payment() {
  const { randomUser } = useBooking();
  const [stripePromise, setStripePromise] = useState(null);
  const [clientSecret, setClientSecret] = useState("");

  useEffect(() => {
    fetch("/singlepayment").then(async (r) => {
      const { publishableKey, clientSecret } = await r.json();
      setStripePromise(loadStripe(publishableKey));
      setClientSecret(clientSecret);
    });
  }, []);

  const appearance = {
    theme: "default",
    variables: {
      colorPrimary: "#0570de",
      colorBackground: "#ffffff",
      colorText: "#333",
      colorDanger: "#df1b41",
      fontFamily: "Open Sans, sans-serif",
      spacingUnit: "4px",
      borderRadius: "6px",
    },
  };
  const options = {
    clientSecret,
    appearance,
  };

  return (
    <>
      {clientSecret && stripePromise && (
        <Elements stripe={stripePromise} options={options}>
          <CheckoutForm randomUser={randomUser} />
        </Elements>
      )}
    </>
  );
}

export default Payment;
