import React from 'react'
import { PayPalButton } from "react-paypal-button-v2";
import axios from "axios";

export default function PayPal({amount}) {
    return (
        <PayPalButton
                    amount={amount}
                    shippingPreference="NO_SHIPPING"
                    onSuccess={(details, data) => {
                      alert(
                        "Transaction completed by " +
                          details.payer.name.given_name
                      );
                      axios
                        .post("http://localhost:5000/api/users/donate-paypal", {amount: amount}, {
                          withCredentials: true
                        })
                        .then((res) => alert(res.data.message))
                        .catch((err) => {alert(err.data.message)});
                    }}
                    options={{
                      clientId:
                        "AVY1H7b4BcKjrxeIiKwPRo1_fJU2wEBvY7qfEOx7BNIVggnui8C1mHQDdFJGiP7ZYfIiWXnhho_NTJCX",
                      currency: "EUR",
                      disableFunding: "sepa,giropay,sofort,card",
                    }}
                    style={{
                      height: 30,
                    }}
                  />
    )
}
