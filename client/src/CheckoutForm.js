import { PaymentElement } from "@stripe/react-stripe-js";
import { useState } from "react";
import { useStripe, useElements } from "@stripe/react-stripe-js";
import { useLocation } from "react-router-dom";

export default function CheckoutForm({ randomUser }) {
  const stripe = useStripe();
  const elements = useElements();
  const [message, setMessage] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const location = useLocation();

  const isInstallment = location.pathname === "/installments";

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);
    const result = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/completion`,
        payment_method_data: {
          billing_details: {
            name: `${randomUser?.givenName} ${randomUser?.familyName}`,
            email: randomUser?.email,
          },
        },
      },
    });

    if (
      result.error.type === "card_error" ||
      result.error.type === "validation_error"
    ) {
      setMessage(result.error.message);
    } else {
      setMessage("An unexpected error occured.");
    }

    setIsProcessing(false);
  };

  const handleSubmitTest = async (event) => {
    // We don't want to let default form submission happen here,
    // which would refresh the page.
    event.preventDefault();

    if (!stripe) {
      // Stripe.js has not yet loaded.
      // Make sure to disable form submission until Stripe.js has loaded.
      return;
    }

    setIsProcessing(true);

    // Trigger form validation and wallet collection
    const { error: submitError } = await elements.submit();
    if (submitError) {
      setMessage(submitError);
      return;
    }

    // Create the Subscription
    const res = await fetch("/installments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: randomUser?.email,
      }),
    });

    const { clientSecret } = await res.json();

    // Confirm the Subscription using the details collected by the Payment Element
    const { error } = await stripe.confirmPayment({
      elements,
      clientSecret,
      confirmParams: {
        return_url: `${window.location.origin}/completion`,
      },
    });

    if (error) {
      // This point is only reached if there's an immediate error when
      // confirming the payment. Show the error to your customer (for example, payment details incomplete)
      console.log("error", error);
      setMessage(error);
    } else {
      // Your customer is redirected to your `return_url`. For some payment
      // methods like iDEAL, your customer is redirected to an intermediate
      // site first to authorize the payment, then redirected to the `return_url`.
    }
  };

  return (
    <form
      id="payment-form"
      onSubmit={isInstallment ? handleSubmitTest : handleSubmit}
    >
      <PaymentElement />
      <button
        disabled={isProcessing || !stripe || !elements}
        id="submit"
        style={{
          width: "100%",
          background: "#F3CD00",
          color: "#333",
        }}
      >
        <span id="button-text">
          {isProcessing ? "Processing ... " : "Pay now"}
        </span>
      </button>
      {message && <div id="payment-message">{message}</div>}
    </form>
  );
}
