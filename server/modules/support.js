import fs from "fs";

export function SaveDatabase(database) {
  fs.writeFileSync(
    "./database.json",
    JSON.stringify({
      transactions: database.transactions,
      payouts: database.payouts,
      directDebits: database.directDebits,
      customers: database.customers,
    })
  );
  console.log("saving database");
}

export const database = {
  directDebits: [],
  payouts: [],
  transactions: [],
  customers: [],
};

async function load() {
  if (fs.existsSync("./database.json")) {
    const data = fs.readFileSync("./database.json");
    console.log("loading database");
    const d = JSON.parse(data);
    database.transactions = d.transactions;
    database.payouts = d.payouts;
    database.directDebits = d.directDebits;
    database.customers = d.customers;
    // database.directDebits = [];
  }
}
load();
