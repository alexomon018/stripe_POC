export const saveCustomer = async (req, res) => {
  try {
    const vals = req.body;

    const session = req.session || {};

    session.givenName = vals.givenName;
    session.familyName = vals.familyName;
    session.dob = vals.dob;
    session.email = vals.email;
    session.amount = vals.amount || 2500;

    session.customerId = `${pad(Math.random() * 1000, 4)}${pad(
      vals.dob.substring(0, 4),
      4
    )}${pad(vals?.dob.substring(7, 2), 2)}`;
    res.redirect(`singlepayment?${session.customerId}`);
    res.status(200);
  } catch (e) {
    res.status(400).send({
      error: {
        message: e.message,
      },
    });
  }
};

function pad(num, size) {
  var s = "000000000" + num;
  return s.substring(s.length - size);
}
