const mongoose = require("mongoose");
const express = require("express");
const bcrypt = require("bcrypt");
const router = express.Router();
const nodeoutlook = require("nodejs-nodemailer-outlook");
const stripe = require("stripe")(
  "sk_test_51K6p3wDEd1Zeea21XtcLH90LhPPpwqXU60S6cKxQXU4sn4UtvCGfTJndVG855JAU3SSxZIU4PRlVMQ1fDpCJXTGG00CQ5Mcwbk"
);

//Models
const User = require("../models/userModel");
const VerificationToken = require("../models/verificationToken");

//Utilities
const { createToken, validateToken } = require("../utils/JWT");
const {
  generateVerificationString,
  sendVerificationCode,
  sendEmailResetLink,
} = require("../utils/mail");

router.post("/register", async (req, res) => {
  User.findOne({ email: req.body.email })
    .then(async (user) => {
      if (user) {
        res.status(400).json({ message: "Email is in use" });
      } else {
        const hashedPassword = await bcrypt.hash(req.body.password, 6);
        const newUser = new User({
          name: req.body.name,
          email: req.body.email,
          password: hashedPassword,
        });

        const verificationString = generateVerificationString();
        const verification = new VerificationToken({
          owner: req.body.email,
          token: verificationString,
        });

        try {
          sendVerificationCode(newUser, verificationString);
          await verification.save();
          newUser
            .save()
            .then((result) => {
              res.status(200).json({ message: "Thanks for joining" });
            })
            .catch((err) => {
              res
                .status(400)
                .json({ message: "Something went wrong please try again" });
            });
        } catch (error) {
          User.findOneAndDelete({ email: req.body.email });
          VerificationToken.findOneAndDelete({ owner: req.body.email });
          res
            .status(400)
            .json({ message: "Something wen't wrong please try again" });
        }
      }
    })
    .catch((err) => {
      res.status(400).json({
        message: "Something went wrong with the server please try again",
      });
    });
});

router.post("/login", (req, res) => {
  User.findOne({ email: req.body.email })
    .then(async (user) => {
      let isTrue = await bcrypt.compare(req.body.password, user.password);
      if (isTrue) {
        const jwToken = createToken(user);
        res
          .cookie("access-token", jwToken, {
            httpOnly: true,
            maxAge: 2592000000,
          })
          .json({message :"Welcome"});
      } else {
        res.status(400).json({ message: "Invalid login credentials" });
      }
    })
    .catch((err) => {
      res.status(400).json({ message: "User does not exist" });
    });
});

router.post("/verify", validateToken, async (req, res) => {
  try {
    const validCode = req.body.code;
    let user = await User.findOne({ _id: req.userId });
    let token = await VerificationToken.findOne({ owner: user.email });
    isMatch = await bcrypt.compare(validCode, token.token);
    if (isMatch) {
      await User.findOneAndUpdate({ _id: req.userId }, { verified: true });
      await VerificationToken.findOneAndDelete({ owner: user.email });
      res.status(200).json({ message: "Verification is successful" });
    } else {
      res.status(400).json({ message: "Something went wrong" });
    }
  } catch (error) {
    res.status(400).json({ message: "Something went wrong" });
  }
});

router.get("/profile", validateToken, async (req, res) => {
  User.findOne({ _id: req.userId }, async (err, doc) => {
    if (!err) {
      // Check and update if active subscriber
      if (doc.subscribedDate) {
        let days = Math.round(
          (doc.subscribedEndDate - doc.subscribedDate) / 1000 / 60 / 60 / 24
        );
        if (days <= 0) {
          doc.isActiveSubscriber = false;
          await User.findOneAndUpdate(
            { _id: req.userId },
            { isActiveSubscriber: false }
          );
        } else {
          doc.isActiveSubscriber = true;
          await User.findOneAndUpdate(
            { _id: req.userId },
            { isActiveSubscriber: true }
          );
        }
      }
      let user = {
        name: doc.name,
        donationAmount: doc.donationAmount,
        isActiveSubscriber: doc.isActiveSubscriber,
        verified: doc.verified,
      };
      res.status(200).json(user);
    } else {
      res
        .status(400)
        .json({ message: "Something went wrong please try again" });
    }
  });
});

router.get("/logout", validateToken, (req, res) => {
  res.cookie("access-token", "", {
    httpOnly: true,
    maxAge: 10,
  }).json({message: "Logging out"});
});

router.post("/forgotpassword", async (req, res) => {
  let { email } = req.body;
  User.findOne({ email: req.body.email })
    .then(async (user) => {
      const verString = generateVerificationString();
      const verification = new VerificationToken({
        owner: email,
        token: verString,
        for: verString,
      });
      link = `http://localhost:3000/reset/${verString}`;
      try {
        await verification.save();
        sendEmailResetLink(email, link);
        res
          .status(200)
          .json({ message: "Please check your email for a reset link" });
      } catch (error) {
        res
          .status(400)
          .json({ message: "Something went wrong please try again" });
      }
    })
    .catch((err) => {
      res.status(400).json({ message: "User dosen't exist" });
    });
});

router.put("/resetpassword", async (req, res) => {
  let { password, code } = req.body;
  VerificationToken.findOne({ for: code })
    .then(async (match) => {
      password = await bcrypt.hash(password, 6);
      User.findOneAndUpdate(
        { email: match.owner },
        { password: password },
        async (err) => {
          if (!err) {
            await VerificationToken.findOneAndDelete({ for: code });
            res.status(200).json({ message: "Password changed" });
          } else {
            res
              .status(400)
              .json({ message: "Something went wrong please try again" });
          }
        }
      );
    })
    .catch((err) => {
      res.status(400).json({ message: "Invlid or expired token" });
    });
});

// Donate with PayPal
router.post("/donate-paypal", validateToken, async (req, res) => {
  const amount = Number(req.body.amount);
  let user = await User.findOne({ _id: req.userId });
  //Calculating dates
  let subscribedat = new Date();
  let endsubscription = new Date();
  endsubscription.setDate(subscribedat.getDate() + 30);

  User.findOneAndUpdate(
    { _id: req.userId },
    {
      donationAmount: user.donationAmount + amount,
      subscribedDate: subscribedat,
      subscribedEndDate: endsubscription,
    },
    (err, doc) => {
      if (!err) {
        res.status(200).json({ message: "Thank you for donating" });
      } else {
        res
          .status(400)
          .json({ message: "Something went wrong please try again" });
      }
    }
  );
});

// Donate with Stripe
router.post("/donate-stripe", validateToken, async (req, res) => {
  let { token, amount } = req.body;
  amount = Number(amount);

  // Calculating dates
  let subscribedat = new Date();
  let endsubscription = new Date();
  endsubscription.setDate(subscribedat.getDate() + 30);

  let user = await User.findOne({ _id: req.userId });
  const customer = await stripe.customers.create({
    email: token.email,
    source: token.id,
  });

  const payment = await stripe.charges.create({
    amount: amount * 100,
    currency: "EUR",
    customer: customer.id,
    receipt_email: token.email,
  });

  if (payment) {
    User.findOneAndUpdate(
      { _id: req.userId },
      {
        donationAmount: user.donationAmount + amount,
        subscribedDate: subscribedat,
        subscribedEndDate: endsubscription,
      },
      (err) => {
        if (!err) {
          res.status(200).json({ message: "Thank you for your donation" });
        } else {
          res.status(400).json({ message: "Something went wrong please try again later" });
        }
      }
    );
  }
});

module.exports = router;
