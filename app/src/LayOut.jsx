import React from "react";
import NavBar from "./components/ui/navbar"
import Footer from "./components/ui/footer";
import styles from "./layOut.module.css";



function LayOut({ children }) {
  return (
    <div className={styles["layout"]}>
      <div className={styles["content"]}>
      <NavBar />
      <main className="content">{children}</main>
      <Footer/>
      </div>
    </div>
  );
}

export default LayOut;