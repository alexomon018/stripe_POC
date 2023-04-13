import { PaymentElement } from "@stripe/react-stripe-js";
import { useState } from "react";
import { useStripe, useElements } from "@stripe/react-stripe-js";

export default function CheckoutForm({ randomUser }) {
  const stripe = useStripe();
  const elements = useElements();
  const [message, setMessage] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

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

  const handleInstalmentSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);
    const { error: submitError } = await elements.submit();
    if (submitError) {
      setMessage(submitError.message);
      return;
    }

    const result = await stripe.createPaymentMethod({
      elements,
      params: {
        billing_details: {
          name: `${randomUser?.givenName} ${randomUser?.familyName}`,
          email: randomUser?.email,
        },
      },
    });

    if (result.error) {
      setMessage(result.error.message);
      return;
    } else {
      const res = await fetch("/installments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: randomUser?.email,
          payment_method: result.paymentMethod.id,
        }),
      });

      const { clientSecret, subscriptionStatus } = await res.json();
      console.log("subscriptionStatus", subscriptionStatus);
      if (subscriptionStatus === "requires_confirmation") {
        stripe.confirmCardPayment(clientSecret, {
          return_url: `${window.location.origin}/completion`,
        });
      } else {
        setMessage("Payment successful!");
      }
    }
  };

  return (
    <form id="payment-form" onSubmit={handleInstalmentSubmit}>
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
