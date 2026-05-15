import GlobalStyle from "../styles";
import { SessionProvider } from "next-auth/react";
import Navbar from "@/components/Navbar";

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}) {
  return (
    <SessionProvider session={session}>
      <GlobalStyle />
      <Navbar />
      <Component {...pageProps} />
    </SessionProvider>
  );
}
