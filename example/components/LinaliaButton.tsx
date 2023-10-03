import React, { useState } from "react";
import { styled } from "@linaria/react";

const StyledButton = styled.button`
  &[data-valid] {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 240px;
    height: 48px;
    border-radius: 50px;
    background-color: rgb(245, 205, 0);
    color: rgb(0, 0, 0);
    font-weight: 700;
    padding: 0.25em 1em;
    cursor: pointer;
    transition: all 0.2s;
  }

  &[data-valid="before"]::before,
  &[data-valid="active"]::before {
    content: "🐻";
    display: inline-block;
    padding-right: 0.5em;
  }

  &[data-valid="active"] {
    transition-duration: 0.2s;
    box-shadow: 0 0 0.2em #0003;
    transform: scale(0.95);
    filter: brightness(0.9) contrast(1.2);
  }

  @media screen and (max-width: 360px) {
    &[data-valid="before"]::before {
      content: "🐱";
    }
  }
`;

const LinaliaButton: React.FC = () => {
  const [status, setStatus] = useState("before");

  const handleClick = () => {
    setStatus("active");
    setTimeout(() => setStatus("before"), 200);
  };

  return (
    <StyledButton data-valid={status} onClick={handleClick}>
      Click me
    </StyledButton>
  );
};

export default LinaliaButton;
