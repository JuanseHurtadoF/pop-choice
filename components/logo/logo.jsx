import Image from "next/image";
import styles from "./logo.module.scss";

function Logo() {
  return (
    <div className={styles.logoContainer}>
      <Image src="/logo.png" alt="Pop-Choice logo" height={174} width={235} />
    </div>
  );
}

export default Logo;
