import { Router } from "express";
import {
  makeSinglePayment,
  makeInstalmentPayment,
} from "./handlers/payments.js";
import { saveCustomer } from "./handlers/user.js";

const router = Router();

router.get("/", (req, res) => {});

router.post("/saveCustomer", saveCustomer);

router.get("/singlepayment", makeSinglePayment);

router.get("/installments");

router.post("/installments", makeInstalmentPayment);

router.get("/completion", async (req, res) => {});

export default router;
