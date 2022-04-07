import { React, useState } from "react";
import axios from "axios";
import styled from "styled-components";

let PassRecovery = styled.div`
  text-align: center;
  border: 1px solid;
  border-image: linear-gradient(90deg, #fb0094, #0000ff, #00ff00, #ffff00, #ff0000) 5;
  margin: 20vh auto;
  padding: 15px;
  width: 80vw;
  font-weight: 500;
  display: flex;
  flex-direction: column;

  p {
    font-size 1.6rem;
    margin-bottom: 5px;
  }
 
  label {
   font-size: 1.3rem;
    text-align: start;
  }
  input {
   font-size: 1.3rem;
   margin-bottom: 8px; 
  }
 
  button {
   font-size: 1.3rem;
   width: 35%;
   margin: auto;
   margin-bottom: 5px;
   border-radius: 7px;
   background-color: white;
   border 1px solid rgb(142, 142, 142);
  }
 
  button:hover {
   cursor: pointer;
   background-color: rgb(216, 216, 216);
  }
`;

export default function ForgotPass() {
  let [email, setEmail] = useState();

  let submit = () => {
    axios
      .post(
        "http://localhost:5000/api/users/forgotpassword",
        { email },
        {
          withCredentials: true,
        }
      )
      .then((res) => {
        document.querySelector("#head-title").innerHTML = res.data.message;
      })
      .catch((err) => {
        document.querySelector("#head-title").innerHTML = err.data.message;
        setTimeout(() => (window.location.href = "/"), 2000);
      });
  };

  return (
    <PassRecovery>
      <h2 id="#head-title">Forgot password?</h2>
      <label>Enter your email</label>
      <input type="text" onChange={(e) => setEmail(e.target.value)} />
      <button onClick={() => submit()}>Submit</button>
    </PassRecovery>
  );
}
