import React from "react";
import styled from "styled-components";

let End = styled.footer`
 border-top: 2px solid;
 display: flex;
 flex-wrap: wrap;
 font-size: 1.3rem;
 justify-content: center;
 border-image: linear-gradient(90deg, #fb0094, #0000ff, #00ff00, #ffff00, #ff0000) 5;

 img {
     width: 75px;
     height: 70px;
     display: block;
 }

 p {
     margin: 5px;
 }

 @media (max-width: 380px) {
    text-align: center;
    font-size: 1.1rem; 

 }
`;

export default function Footer({ username, damount, activeSub }) {
  return (
    <End>
      <p>
        Thank you {username} for donating ${damount}€ . As a reward we give one
        robot per 3€.
      </p>
      {activeSub && (
        <>
          <p>For being an active sub you get this special star</p>
          <img
            src="https://imgr.search.brave.com/C2t5Z63W2Okl79qQDJGqgZWI0Y_FFs88e4uqN_xeOPQ/fit/512/512/ce/1/aHR0cDovL3BuZ2lt/Zy5jb20vdXBsb2Fk/cy9zdGFyL3N0YXJf/UE5HMTU4MC5wbmc"
            alt=""
          />
        </>
      )}
    </End>
  );
}
