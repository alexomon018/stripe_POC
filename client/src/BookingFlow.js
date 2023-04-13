import React from "react";
import { useBooking } from "./bookingContext";
import { useNavigate } from "react-router-dom";

const BookingFlow = () => {
  const {
    randomUser,
    setRandomUser,
    givenName,
    setGivenName,
    familyName,
    setFamilyName,
    dob,
    setDob,
    email,
    setEmail,
    amount,
    setAmount,
  } = useBooking();

  const navigate = useNavigate();

  const getRandomUser = async () => {
    const rc = await fetch("https://randomuser.me/api/");
    const json = await rc.json();
    setRandomUser({
      givenName: json.results[0].name.first,
      familyName: json.results[0].name.last,
      dob: json.results[0].dob.date,
      email: json.results[0].email,
    });
  };

  const payInFull = async () => {
    // send the randomUser to the server
    fetch("/saveCustomer", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        givenName: randomUser ? randomUser.givenName : givenName,
        familyName: randomUser ? randomUser.familyName : familyName,
        dob: randomUser ? randomUser.dob : dob,
        email: randomUser ? randomUser.email : email,
        amount: amount,
      }),
    }).then((r) => {
      if (r.status === 200) {
        navigate("/singlepayment");
      }
    });
  };

  const payInInstallments = async () => {
    // send the randomUser to the server
    fetch("/saveCustomer", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        givenName: randomUser ? randomUser.givenName : givenName,
        familyName: randomUser ? randomUser.familyName : familyName,
        dob: randomUser ? randomUser.dob : dob,
        email: randomUser ? randomUser.email : email,
        amount: amount,
      }),
    }).then((r) => {
      if (r.status === 200) {
        navigate("/installments");
      }
    });
  };

  return (
    <div>
      <header class="header">
        Complete your booking (
        <a id="random" onClick={() => getRandomUser()}>
          random
        </a>
        )
      </header>

      <h2>Your details</h2>
      <div>
        Given Name
        <input
          type="text"
          name="givenName"
          id="givenName"
          value={randomUser ? randomUser.givenName : givenName}
          onChange={(e) => {
            setGivenName(e.target.value);
          }}
        />
      </div>

      <div>
        Family Name
        <input
          type="text"
          name="familyName"
          id="familyName"
          value={randomUser ? randomUser.familyName : familyName}
          onChange={(e) => {
            setFamilyName(e.target.value);
          }}
        />
      </div>

      <div>
        DoB Name
        <input
          type="date"
          name="dob"
          id="dob"
          value={randomUser ? new Date(randomUser.dob).toISOString() : dob}
          onChange={(e) => {
            setDob(e.target.value);
          }}
        />
      </div>

      <div>
        Email
        <input
          type="email"
          name="email"
          id="email"
          value={randomUser ? randomUser.email : email}
          onChange={(e) => {
            setEmail(e.target.value);
          }}
        />
      </div>
      <div>
        Pay
        <input
          type="number"
          name="amount"
          id="amount"
          step=".001"
          value={amount}
          onChange={(e) => {
            setAmount(e.target.value);
          }}
        />
      </div>
      <div
        style={{
          display: "flex",
          gap: "5px",
        }}
      >
        <button onClick={() => payInFull()}>
          <span id="button-text">{`Pay in full ${amount}`}</span>
        </button>
        <button>
          <span id="button-text">Direct Debit Instalments</span>
        </button>
        <button onClick={() => payInInstallments()}>
          <span id="button-text">Debit/Credit Instsalments</span>
        </button>
      </div>
    </div>
  );
};

export default BookingFlow;
