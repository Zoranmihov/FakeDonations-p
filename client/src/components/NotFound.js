import { React, useEffect } from "react";
import styled from "styled-components";

const MissingDiv = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

export default function NotFound() {
  useEffect(() => {
    setTimeout(() => (window.location.href = "/"), 2000);
  }, []);
  return (
    <MissingDiv>
      <h1>Page not found. Redirecting to home</h1>
    </MissingDiv>
  );
}
