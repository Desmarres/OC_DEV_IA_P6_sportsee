import Head from "next/head";
import styles from "@/styles/Home.module.css";
import { useRouter } from "next/router";
import useAuth, { AuthStatus } from "@/context/AuthContext";
import Image from "next/image";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { useEffect } from "react";
import BlueButton from "@/components/BlueButton/BlueButton";

/**
 * Affiche la page d'accueil et le formulaire de connexion de l'application Sportsee.
 *
 * La fonction récupère le statut d'authentification de l'utilisateur ainsi que
 * la fonction permettant de se connecter. Lorsque l'utilisateur est authentifié,
 * il est automatiquement redirigé vers la page Dashboard et aucun contenu
 * n'est affiché sur la page de connexion.
 *
 * Le formulaire utilise React Hook Form pour gérer les champs de connexion
 * et appelle la fonction `login` avec l'adresse email et le mot de passe
 * renseignés par l'utilisateur.
 *
 * @returns {JSX.Element|null} La page d'accueil avec le formulaire de connexion,
 * ou `null` si l'utilisateur est déjà authentifié.
 */
export default function Home() {

  const router = useRouter();
  const { status, login } = useAuth();
  const { register, handleSubmit } = useForm();

  const onSubmit = (data) => {
    login(data.username, data.password);
  };

  useEffect(() => {
    if (status === AuthStatus.Authenticated) {
      router.push("/Dashboard");
    }
  }, [status, router]);

  if (status === AuthStatus.Authenticated) {
    return null;
  };

  return (
    <>
      <Head>
        <title>Sportsee</title>
        <meta name="description" content="Page d'accueil Sportsee. 
        Analysez vos performances en un clin d’œil,
        suivez vos progrès et atteignez vos objectifs." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className={styles.homeLogin}>
        <section className={styles.leftColumn}>
          <div className={styles.loginContainer}>
            <h1 className={`${styles.titleH1} heading-3`}>
              Transformez<br />
              vos stats en résultats
            </h1>
            <form className={styles.formContainer} onSubmit={handleSubmit(onSubmit)}>
              <h2 className="heading-4">Se connecter</h2>
              <div className={styles.formInput}>
                <label className="body-default" htmlFor="username">Adresse email</label>
                <input className="body-default" type="text" id="username" name="username" {...register("username")} />
              </div>
              <div className={styles.formInput}>
                <label className="body-default" htmlFor="password">Mot de passe</label>
                <input className="body-default" type="password" id="password" name="password" {...register("password")} />
              </div>
              <BlueButton texte={"Se connecter"} />
            </form>
            <Link className="body-default" href="/">Mot de passe oublié ?</Link>
          </div>
        </section>
        <div className={styles.backgroundPictureWrapper}>
          <Image
            src="/background_picture.png"
            fill
            style={{ objectFit: 'cover' }}
            alt="Image représentant une foule qui court lors d'une manifestation sportive"
            sizes="(min-width: 1024px) 56vw, 100vw"
            priority
          />
          <p className={`${styles.description} body-small`}>Analysez vos performances en un clin d’œil, suivez vos progrès et atteignez vos objectifs.</p>
        </div>
      </div>
    </>
  );
};
