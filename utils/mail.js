const nodeoutlook = require("nodejs-nodemailer-outlook");


exports.generateVerificationString = () => {
  let verification = "";
  for (let i = 0; i <= 3; i++) {
    const ranVal = Math.round(Math.random() * 9);
    verification = verification + ranVal;
  }
  return verification;
};

// NEEEDS NEW EMAIL ADRESS MIGHT USE MY OWN

exports.sendVerificationCode = (newUser, verificationString) => {
  nodeoutlook.sendEmail({
    auth: {
      user: "email goes here",
      pass: "password goes here"
    },
    from: "email goes here",
    to: `${newUser.email}`,
    subject: `Verify your email`,
    html: `<h2>Verification code: ${verificationString}</h2>`,
    onError: (e) => console.log(e),
  });
}

exports.sendEmailResetLink = (email, link) => {
  nodeoutlook.sendEmail({
    auth: {
      user: "",
      pass: "",
    },
    from: "",
    to: `${email}`,
    subject: `Password reset link`,
    html: `<p>Follow this link to reset password <a>${link}</a> </p>`,
    onError: (e) => console.log(e),
  });
}