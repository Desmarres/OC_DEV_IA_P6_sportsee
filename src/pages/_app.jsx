import "@/styles/globals.css";
import "@/styles/colors.css";
import "@/styles/typography.css";
import { Inter } from "next/font/google";
import Layout from "../components/Layout/layout";
import { AuthProvider } from "@/context/AuthContext";
import { UserInfoProvider } from "@/context/UserInfoContext";
import { ChatProvider } from "@/context/ChatContext";
import Head from "next/head";
import { TrainingProvider } from "@/context/TrainingContext";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "900"],
});

/**
 * Définit la structure globale de l'application Next.js.
 *
 * Le composant initialise la police utilisée par l'application et regroupe
 * les différents contextes nécessaires à la gestion de l'authentification,
 * des informations utilisateur, du chat et de la création des plannings.
 * Il applique également le layout commun à l'ensemble des pages.
 *
 * @param {Object} props - Les propriétés du composant.
 * @param {React.ComponentType} props.Component - Composant correspondant
 * à la page actuellement affichée.
 * @param {Object} props.pageProps - Propriétés transmises à la page.
 *
 * @returns {JSX.Element} La structure globale de l'application avec
 * les différents providers et le layout principal.
 */
export default function App({ Component, pageProps }) {
  return (
    <>
      <Head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
      </Head>
      <AuthProvider>
        <UserInfoProvider>
          <ChatProvider>
            <TrainingProvider>
              <Layout>
                <Component {...pageProps} />
              </Layout>
            </TrainingProvider>
          </ChatProvider>
        </UserInfoProvider>
      </AuthProvider>
    </>
  );
};