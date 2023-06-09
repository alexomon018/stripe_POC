import "./App.css";
import Payment from "./Payment";
import Completion from "./Completion";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import BookingFlow from "./BookingFlow";
import { BookingProvider } from "./bookingContext";
import Instalments from "./Installments";

function App() {
  return (
    <main>
      <BookingProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<BookingFlow />} />
            <Route path="/singlepayment" element={<Payment />} />
            <Route path="/installments" element={<Instalments />} />
            <Route path="/completion" element={<Completion />} />
          </Routes>
        </BrowserRouter>
      </BookingProvider>
    </main>
  );
}

export default App;
