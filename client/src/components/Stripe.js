import React from "react";
import styled from "styled-components";
import axios from "axios";
import StripeCheckout from "react-stripe-checkout";

let StripeBtn = styled.div`
button {
  background-color:  #FFC439;
  color: #2C2E2F;
  text-align: center;
  font-size: 20px;
  font-style: italic;
  font-weight: 600;
  text-align: center;
  padding: 2.5px 10px;
  border: none;
  border-radius: 4px;
  margin 0px 5px;
}
`;

export default function Stripe({ amount }) {

  const tokenHandler = (token) => {
    axios
      .post("http://localhost:5000/api/users/donate-stripe", {amount, token}, {
        withCredentials: true,
      })
      .then((res) => alert("Payment successful"))
      .catch((err) => alert("Payment failed"));
  };

  let pay = (amount) => {
    
  }
  return (
    <StripeBtn>
      <StripeCheckout
        token={tokenHandler}
        amount={amount * 100}
        currency="EUR"
        stripeKey="pk_test_51K6p3wDEd1Zeea21LhAaQEXEwjvyJMHbJtpSNkNxohlQQEDKZe0p7rp4eFXKhtniZ37xhTYgNxHT6nUWbsd9p29p00y1phCNBc"
      >
        <button className="stripe" onClick={() => pay()}>Stripe</button>
      </StripeCheckout>
    </StripeBtn>
  );
}