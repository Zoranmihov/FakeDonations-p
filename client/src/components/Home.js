import { React, useState, useEffect } from "react";
import PayPal from "./PayPal";
import Stripe from "./Stripe";
import styled from "styled-components";
import axios from "axios";

// Components
import RoboHashBody from "./RoboHashBody";
import Footer from './Footer'

let HomeScreen = styled.div`
  nav {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    border-bottom: 2px solid;
    border-image: linear-gradient(90deg, #fb0094, #0000ff, #00ff00, #ffff00, #ff0000) 5;
  }

  .logo {
    font-family: "Smooch", cursive;
    font-size: 1.8rem;
  }

  .donation {
    display: flex;
  }

  input {
    margin 0 5px;
    border: none;
    padding: 2px 10px;
    height: 30px;
    border-radius: 4px;
  }

  ul {
    display: flex;
    list-style: none;
  }

  ul li {
    padding: 10px 3px;
    font-size: 1.4rem;
  }
   p {
    padding: 10px 3px;
    font-size: 1.4rem;
    cursor: pointer;
    margin:  0 4px;
   }
  @media (max-width: 800px) {
    nav {
    display: flex;
    flex-direction: column;
    align-items: center;
    }

    .donation {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-bottom: 5px;
    }

    input {
      margin-bottom: 3px;
    }
  }
`;

let VerifyScreen = styled.div`
  text-align: center;
  border: 1px solid;
  border-image: linear-gradient(90deg, #fb0094, #0000ff, #00ff00, #ffff00, #ff0000) 5;
  margin: 35vh auto;
  padding: 15px;
  width: 80vw;
  display: flex;
   flex-direction: column;


  p {
    font-size 1.6rem;
    margin-bottom: 5px;
  }

  input {
    font-size: 1.3rem;
    margin: 8px 8px; 
   }

   button {
  font-size: 1.3rem;
  width: 30%;
  margin: auto;
  margin-bottom: 5px;
  background-color: white;
  border 1px solid rgb(142, 142, 142);
 }

 button:hover {
  cursor: pointer;
  background-color: rgb(216, 216, 216);
 }

`;

let LoginScreen = styled.div`
  text-align: center;
  border: 1px solid;
  border-image: linear-gradient(90deg, #fb0094, #0000ff, #00ff00, #ffff00, #ff0000) 5;
  margin: 20vh auto;
  padding: 15px;
  width: 80vw;
  font-weight: 500;

 form {
   display: flex;
   flex-direction: column;

 }

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

 span {
  cursor: pointer;
  text-decoration: underline;
  margin-left: 2px;
 }

 .err {
   font-size: 16px;
   text-align: start;
   color: red;
 }
`;

let RegisterScreen = styled.div`
  text-align: center;
  border: 1px solid;
  border-image: linear-gradient(90deg, #fb0094, #0000ff, #00ff00, #ffff00, #ff0000) 5;
  margin: 20vh auto;
  padding: 15px;
  width: 80vw;
  font-weight: 500;

  form {
    display: flex;
    flex-direction: column;

  }

  p {
    font-size 1.6rem;
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

  span {
    cursor: pointer;
    text-decoration: underline;
    
  }

  .err {
    font-size: 16px;
    text-align: start;
    color: red;
  }
  
`;

export default function Home() {
  let [loaded, setLoaded] = useState(false);
  let [loggedin, setLogin] = useState(true);
  let [amount, setAmount] = useState(1);
  let [user, setUser] = useState(false);
  let [name, setName] = useState(false);
  let [email, setEmail] = useState(false);
  let [password, setPassword] = useState(false);

  useEffect(() => {
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (loaded) {
      if (user) {
        return;
      } else {
        axios
          .get("http://localhost:5000/api/users/profile", {
            withCredentials: true,
          })
          .then((res) => {
            setUser(res.data);
          })
          .catch((err) => {
            return;
          });
      }
    }
  }, [loaded]);

  // Functions

  let checkPassword = (password) => {
    let regex = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,16}$/;
    let btn = document.querySelector("#sign-up");
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

  const validateEmail = (email) => {
    const button = document.querySelector("#sign-up");
    const error = document.querySelector("#email-err");
    const regex =
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    const valid = regex.test(email);

    if (valid) {
      button.disabled = false;
      error.innerHTML = "";
    } else {
      button.disabled = true;
      error.innerHTML = "Invalid email";
    }
  };

  let register = (e) => {
    e.preventDefault();
    let newUser = {
      name,
      email,
      password,
    };
    axios
      .post("http://localhost:5000/api/users/register", newUser, {
        withCredentials: true,
      })
      .then((res) => {
        document.querySelector("#head-title").innerHTML = res.data.message;
        setTimeout(() => window.location.reload(), 2000);
      })
      .catch((err) => {
        document.querySelector("#head-title").innerHTML = err.data.message;
      });
  };

  let login = (e) => {
    e.preventDefault();
    let loginInfo = {
      email,
      password,
    };

    axios
      .post("http://localhost:5000/api/users/login", loginInfo, {
        withCredentials: true,
      })
      .then((res) => {
        document.querySelector("#head-title").innerHTML = res.data.message;
        setTimeout(() => window.location.reload(), 2000);
      })
      .catch((err) => {
        document.querySelector("#head-title").innerHTML = err.data.message;
      });
  };

  let verify = () => {
    let code = { code: document.getElementById("verification").value };
    axios
      .post("http://localhost:5000/api/users/verify", code, {
        withCredentials: true,
      })
      .then((res) => {
        document.querySelector("#head-title").innerHTML = res.data.message;
        setTimeout(() => window.location.reload(), 2000);
      })
      .catch((err) => {
        document.querySelector("#head-title").innerHTML = err.data.message;
        setTimeout(() => window.location.reload(), 2000);
      });
  };

  let clear = () => {
    setName(false);
    setEmail(false);
    setPassword(false);
  };

  let logout = () => {
    axios
      .get("http://localhost:5000/api/users/logout", {
        withCredentials: true,
      })
      .then((res) => {
        setUser(false);
        setTimeout(() => window.location.reload(), 50);
      })
      .catch((err) => {
        document.querySelector(".logo").innerHTML = "Something went wrong please try again"
        setTimeout(() => window.location.reload(), 1500);
      });
  };

  return (
    <>
      {loaded && (
        <>
          {user ? (
            <>
              {user.verified ? (
                <HomeScreen>
                  <nav>
                    <div className="logo">FakeSubscriptions</div>
                    <div className="donation">
                      <input
                        type="text"
                        placeholder="donations are in €"
                        onChange={(e) => setAmount(e.target.value)}
                      />
                      <PayPal amount={amount} />
                      <Stripe amount={amount} />
                    </div>
                    <p onClick={() => logout()}>Logout</p>
                  </nav>
                 {user.donationAmount > 3 ? ( <RoboHashBody damount={user.donationAmount} />) : (<></>)}
                  <Footer username={user.name} damount={user.donationAmount} activeSub={user.isActiveSubscriber} />
                </HomeScreen>
              ) : (
                <div className="container">
                  <VerifyScreen>
                    <p id='head-title'>Please check your email for a verification code</p>
                    <input
                      type="text"
                      id="verification"
                      placeholder="Enter code"
                    />
                    <button onClick={() => verify()}>Verify</button>
                    <button onClick={() => logout()}>Logout</button>
                  </VerifyScreen>
                </div>
              )}
            </>
          ) : (
            <>
              {loggedin ? (
                <LoginScreen>
                  <form onSubmit={(e) => login(e)}>
                    <p id="head-title">Login:</p>
                    <label>Email :</label>
                    <input
                      type="text"
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                    <label>Password :</label>
                    <input
                      type="password"
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />

                    <button type="submit">Login</button>
                    <p className="err"></p>
                    <p>
                      Forgot password?
                      <span onClick={() => (window.location.href = "/recover")}>
                        {" "}
                        Click here to reset
                      </span>
                    </p>
                    <p>
                      Don't have an account?
                      <span
                        onClick={() => {
                          setLogin(false);
                          clear();
                        }}
                      >
                        Click here
                      </span>
                    </p>
                  </form>
                </LoginScreen>
              ) : (
                <RegisterScreen>
                  <form onSubmit={(e) => register(e)}>
                    <p id="head-title">Register:</p>
                    <label>Name :</label>
                    <input
                      type="text"
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                    <label>Email :</label>
                    <input
                      type="text"
                      onChange={(e) => {
                        setEmail(e.target.value);
                        validateEmail(e.target.value);
                      }}
                      required
                    />
                    <p id="email-err" className="err"></p>
                    <label>Password :</label>
                    <input
                      type="password"
                      onChange={(e) => {
                        setPassword(e.target.value);
                        checkPassword(e.target.value);
                      }}
                    />
                    <p id="pass-err" className="err"></p>
                    <button id="sign-up" type="submit">
                      Sign up
                    </button>
                    <p>
                      Have an account?
                      <span
                        onClick={() => {
                          setLogin(true);
                          clear();
                        }}
                      >
                        Click here to login
                      </span>
                    </p>
                  </form>
                </RegisterScreen>
              )}
            </>
          )}
        </>
      )}
    </>
  );
}
