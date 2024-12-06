import React, { useState } from "react";
import styles from "./Home.module.css";
import { useNavigate } from "react-router-dom";

function Home() {
  const [loginModal, setLoginModal] = useState(false);
  const [registerModal, setRegisterModal] = useState(false);

  const navigate = useNavigate();

  const toggleLoginModal = () => {
    setLoginModal(!loginModal);
    if (registerModal) setRegisterModal(false);
  };

  const toggleRegisterModal = () => {
    setRegisterModal(!registerModal);
    if (loginModal) setLoginModal(false); 
  };

  return (
    <>
      <div className={styles.container}>
        <div className={styles.header}>
          <h1>DHVSTUDY</h1>
          <div className={styles.buttonHolder}>
            <div className={styles.button} onClick={toggleLoginModal}>
              Log In
            </div>
            <div className={styles.button} onClick={toggleRegisterModal}>
              Create account
            </div>
          </div>
        </div>
        <div className={styles.footer}>
          <span
            className={styles.footerButton}
            onClick={() => navigate("/about")}
          >
            About us
          </span>
          <span>Copyright ©2024 . Designed by GR1</span>
        </div>

        {loginModal && (
          <div className={styles.modal}>
            <div className={styles.modalContent}>
              <div className={styles.top}>
                <span>DHVSTUDY</span>
                <i class="fa-solid fa-x" onClick={() => {setLoginModal(false)}}></i>
              </div>
              <div className={styles.middle}>
                <div className={styles.headerSection}>
                  <span style={{fontSize: "3rem"}}>Welcome Back!</span>
                  <span style={{fontSize: "1.2rem", fontFamily: "Poppins, sans-serif"}}>Enter your email and password to login</span>
                </div>
                <div className={styles.inputSection}>
                  <span style={{fontSize: ".8rem", fontFamily: "Poppins, sans-serif", fontWeight: "bold"}}>Email</span>
                  <input type="email" placeholder="Enter your email" />
                  <span style={{fontSize: ".8rem", marginTop: "1rem", fontFamily: "Poppins, sans-serif", fontWeight: "bold"}}>Password</span>
                  <input type="password" placeholder="Enter your password" />
                </div>
                <div className={styles.buttonSection}>
                  <div className={styles.continueButton} onClick={() => {navigate("/home")}}>Continue</div>
                </div>
              </div>
              <div className={styles.bottom}>
                <span style={{fontSize: "1.2rem"}}>Dont have an account?</span>
                <span style={{fontSize: "1.2rem", fontWeight: "bold", textDecoration: "underline", fontStyle: "italic", cursor: "pointer"}} onClick={() => {setLoginModal(false); setRegisterModal(true)}}>Sign up</span>
              </div>
            </div>
          </div>
        )}
        {registerModal && (
          <div className={styles.modal}>
            <div className={styles.modalContent}>
            <div className={styles.top}>
                <span>DHVSTUDY</span>
                <i class="fa-solid fa-x" onClick={() => {setRegisterModal(false)}}></i>
              </div>
              <div className={styles.middle}>
                <div className={styles.headerSection}>
                  <span style={{fontSize: "3rem"}}>Create Account!</span>
                  <span style={{fontSize: "1.2rem", fontFamily: "Poppins, sans-serif"}}>Enter your email and password to create your account</span>
                </div>
                <div className={styles.inputSection}>
                  <span style={{fontSize: ".8rem", fontFamily: "Poppins, sans-serif", fontWeight: "bold"}}>Email</span>
                  <input type="email" placeholder="Enter your email" />
                  <span style={{fontSize: ".8rem", marginTop: "1rem", fontFamily: "Poppins, sans-serif", fontWeight: "bold"}}>Password</span>
                  <input type="password" placeholder="Enter your password" />
                </div>
                <div className={styles.buttonSection}>
                  <div className={styles.continueButton}>Create account</div>
                </div>
              </div>
              <div className={styles.bottom}>
                <span style={{fontSize: "1.2rem"}}>Already have an account?</span>
                <span style={{fontSize: "1.2rem", fontWeight: "bold", textDecoration: "underline", fontStyle: "italic", cursor: "pointer"}} onClick={() => {setRegisterModal(false); setLoginModal(true)}}>Login</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default Home;
