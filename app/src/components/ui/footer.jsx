import React from "react";
import styles from "./footer.module.css";

function Footer() {
  return (
    <div className={styles.footerContainer}>
      <footer className={styles.footer}>
        <p>Follow Us</p>

        <ul className={styles.footerLinks}>
          <li>
            <a href="#">Facebook</a>
          </li>
          <li>
            <a href="#">Twitter</a>
          </li>
          <li>
            <a href="#">LinkedIn</a>
          </li>
          <li>
            <a href="#">Instagram</a>
          </li>
        </ul>
        <p>
          &copy; {new Date().getFullYear()} Meal Sharing. All rights reserved.
        </p>
      </footer>
    </div>
  );
}

export default Footer;
