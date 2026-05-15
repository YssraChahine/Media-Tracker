import { useState } from "react";
import styled from "styled-components";
import { signIn } from "next-auth/react";
import { useRouter } from "next/router";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();

    setLoading(true);
    setError("");

    const result = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });
    setLoading(false);

    if (result?.error) {
      setError("Invalid email or password");
      return;
    }
    router.push("/");
  }

  return (
    <Main>
      <Card>
        <Title>Welcome Back</Title>

        <Form onSubmit={handleSubmit}>
          <Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />

          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />

          {error && <ErrorMessage>{error}</ErrorMessage>}

          <Button type="submit" disabled={loading}>
            {loading ? "Signing in..." : "Login"}
          </Button>
        </Form>

        <RegisterText>
          No account yet? <StyledLink href="/register">Register</StyledLink>
        </RegisterText>
      </Card>
    </Main>
  );
}

const Main = styled.main`
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #0a0a0a;
  padding: 20px;
`;

const Card = styled.div`
  width: 100%;
  max-width: 420px;
  padding: 40px;
  border-radius: 30px;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(20px);
`;

const Title = styled.h1`
  font-size: 2rem;
  margin-bottom: 30px;
  text-align: center;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 18px;
`;

const Input = styled.input`
  padding: 16px;
  border-radius: 14px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  background: rgba(255, 255, 255, 0.05);
  color: white;
  font-size: 1rem;
  &:focus {
    outline: none;
    border-color: rgba(229, 9, 20, 0.5);
  }
`;

const Button = styled.button`
  padding: 16px;
  border: none;
  border-radius: 14px;
  background: linear-gradient(135deg, #e50914, #ff3040);
  color: white;
  font-weight: 700;
  cursor: pointer;
`;

const ErrorMessage = styled.p`
  color: #ff6b6b;
  font-size: 0.9rem;
  text-align: center;
`;

const RegisterText = styled.p`
  margin-top: 20px;
  text-align: center;
  color: #aaa;
`;

const StyledLink = styled(Link)`
  color: white;
  font-weight: 700;
`;
