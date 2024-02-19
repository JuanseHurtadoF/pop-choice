import styles from "./page.module.scss";
import Button from "@/components/ button/button";
import Logo from "@/components/logo/logo";
import Questions from "@/components/form/form";

export default function Home() {
  return (
    <main className={styles.main}>
      <Logo />
      <Questions />
    </main>
  );
}
