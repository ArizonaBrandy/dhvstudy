import React from "react";
import styles from "./About.module.css"
import { useNavigate } from "react-router-dom";

function About(){
    const navigate = useNavigate();
    return(
        <>
            <div className={styles.container}>
                <div className={styles.header}>
                    <h1>About us</h1>
                    <span className={styles.aboutContext}>
                        DHVSTUDY is a virtual platform designed to bring people together for productive study and collaboration. 
                        Whether you’re tackling challenging coursework, preparing for exams, or working on group projects, our website 
                        offers an interactive space where you can connect with others who share your goals. You can create or join study
                        rooms, communicate in real time using chat, voice, or video, and collaborate seamlessly with tools that keep 
                        everyone engaged and focused. Our mission is to make studying together easier and more effective by fostering 
                        a sense of community and accountability. Dive into a supportive environment where learning becomes a shared journey!
                        <br />
                        <br />

                        Our mission is to empower learners by providing a dynamic platform that inspires collaboration, 
                        fosters productivity, and builds a sense of belonging. We envision a world where studying 
                        is not an isolating task but a shared experience that motivates and connects people across the globe. 
                        By creating a space where individuals can come together to learn and grow, we aim to make education more accessible, 
                        engaging, and impactful for everyone.
                    </span>
                </div>
                <div className={styles.footer}>
                    <span className={styles.footerButton} onClick={() => navigate("/")}>Home</span>
                    <span>Copyright ©2024 . Designed by GR1</span>
                </div>
            </div>
        </>
    )
}

export default About;