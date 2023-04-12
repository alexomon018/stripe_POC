import React, { useContext, createContext, useState } from "react";

export const BookingContext = createContext();

export const BookingProvider = ({ children }) => {
  const [randomUser, setRandomUser] = useState(null);
  const [givenName, setGivenName] = useState("");
  const [familyName, setFamilyName] = useState("");
  const [dob, setDob] = useState("");
  const [email, setEmail] = useState("");
  const [amount, setAmount] = useState("");

  const stateObj = {
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
  };

  return (
    <BookingContext.Provider value={stateObj}>
      {children}
    </BookingContext.Provider>
  );
};

export const useBooking = () => useContext(BookingContext);
