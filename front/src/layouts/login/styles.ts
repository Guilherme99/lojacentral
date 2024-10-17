import styled from "styled-components";

export const Styles = styled.div`
  background-image: url("../../assets/images/pescador.jpg");
  background-repeat: no-repeat;
  background-size: cover;
`;

export const GlobalLogin = styled.div<{ heightLogin: number }>`
  width: 100%;
  height: ${({ heightLogin }) => `${heightLogin}px`};

  padding-top: 40px;
  padding-bottom: 40px;
  display: flex;
  justify-content: center;
  flex-direction: column;
`;
