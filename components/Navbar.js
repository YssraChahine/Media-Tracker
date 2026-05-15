import Link from "next/link";
import styled from "styled-components";
import { signOut, useSession } from "next-auth/react";

export default function Navbar() {
  const { data: session } = useSession();

  return (
    <Wrapper>
      <Logo href="/">MediaTracker</Logo>

      <NavLinks>
        <StyledLink href="/">Home</StyledLink>

        {session && <StyledLink href="/media">My Collection</StyledLink>}

        {!session ? (
          <>
            <StyledLink href="/login">Login</StyledLink>

            <RegisterButton href="/register">Register</RegisterButton>
          </>
        ) : (
          <LogoutButton
            onClick={() =>
              signOut({
                callbackUrl: "/login",
              })
            }
          >
            Logout
          </LogoutButton>
        )}
      </NavLinks>
    </Wrapper>
  );
}

const Wrapper = styled.nav`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 1000;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 32px;
  backdrop-filter: blur(18px);
  background: rgba(5, 5, 5, 0.55);
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  @media (max-width: 768px) {
    padding: 18px 20px;
  }
`;

const Logo = styled(Link)`
  font-size: 1.4rem;
  font-weight: 900;
  letter-spacing: -1px;
  background: linear-gradient(to right, #ffffff, #9f9f9f);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;

const NavLinks = styled.div`
  display: flex;
  align-items: center;
  gap: 18px;
`;

const StyledLink = styled(Link)`
  color: #d0d0d0;
  font-size: 0.95rem;
  font-weight: 600;
  transition: 0.2s ease;
  &:hover {
    color: white;
  }
`;

const RegisterButton = styled(Link)`
  padding: 10px 18px;
  border-radius: 14px;
  background: linear-gradient(135deg, #e50914, #ff3040);
  color: white;
  font-weight: 700;
  transition: 0.2s ease;
  &:hover {
    transform: translateY(-2px);
  }
`;

const LogoutButton = styled.button`
  border: none;
  padding: 10px 18px;
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.08);
  color: white;
  font-weight: 700;
  cursor: pointer;
  transition: 0.2s ease;
  &:hover {
    background: rgba(255, 255, 255, 0.14);
  }
`;
