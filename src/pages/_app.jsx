import "@/styles/globals.css";
import "@/styles/colors.css";
import "@/styles/typography.css";
import { Inter } from "next/font/google";
import Layout from "../components/Layout/layout";
import { AuthProvider } from "@/context/AuthContext";
import { UserInfoProvider } from "@/context/UserInfoContext";
import { ChatProvider } from "@/context/ChatContext";
import Head from "next/head";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "900"],
});

export default function App({ Component, pageProps }) {
  return (
    <>
      <Head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
      </Head>
      <AuthProvider>
        <UserInfoProvider>
          <ChatProvider>
            <Layout>
              <Component {...pageProps} />
            </Layout>
          </ChatProvider>
        </UserInfoProvider>
      </AuthProvider>
    </>
  );
};