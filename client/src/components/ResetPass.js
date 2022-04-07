import { React, useState } from "react";
import axios from "axios";
import styled from "styled-components";

const ResetPassword = styled.div`
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

export default function ResetPass() {
  let [password, setPassword] = useState();
  let code = window.location.href.split("/")[4];
  let checkPassword = (password) => {
    let regex = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,16}$/;
    let btn = document.querySelector("#submit");
    let valid = regex.test(password);
    if (!valid) {
      btn.disabled = true;
      document.querySelector("#pass-err").innerHTML =
        "Password must be between 8 and 16 characters, includes both lower and uppercase letters and special character ";
    } else {
      document.querySelector("#pass-err").innerHTML = "";
      btn.disabled = false;
    }
  };

  let submit = () => {

    let data = {
      password: password,
      code: `${code}`,
    };
    axios
      .put("http://localhost:5000/api/users/resetpassword", data, {
        withCredentials: true,
      })
      .then((res) => {
        document.querySelector("#head-title").innerHTML = res.data.message;
        setTimeout(() => window.location.href = "/", 2000);
      })
      .catch((err) => {
        document.querySelector("#head-title").innerHTML = err.data.message;
        setTimeout(() => window.location.reload(), 1500);
      });
  };

  return (
    <ResetPassword>
      <p id='head-title'>Reset password</p>
      <label >Enter your new password</label>
      <input
        type="password"
        onChange={(e) => {
          setPassword(e.target.value);
          checkPassword(password);
        }}
      />
      <p id="pass-err" className="err"></p>
      <button id="submit" onClick={() => submit()}>
        Submit
      </button>
    </ResetPassword>
  );
}
