import styles from './Homepage.module.css';
import dhvsuimage from '../../assets/dhvstudypic.png';
import { useNavigate } from "react-router-dom";

function Homepage({user}){

    const navigate = useNavigate();

    return(
        <>
            <div className={styles.container}>
                <div className={styles.header}>
                    <span style={{fontSize: '2rem', color: '#9b3e01', cursor: "pointer"}} onClick={() => navigate("/settings")}>DHVSTUDY</span>
                    <span style={{fontSize: '1rem', color: '#9b3e01', fontWeight: 'bold', cursor: 'pointer'}} onClick={() => navigate("/forums")}>FORUMS</span>
                </div>
                <div className={styles.middle}>
                    <div className={styles.leftBox}>
                        <div className={styles.headerCard}>
                            <span style={{fontSize: '2.2rem', color: '#9b3e01'}}>PLACE TO STUDY AND MEETING FOR EVERYONE</span>
                            <span>connect, collaborate, and learn with DHVSTUDY</span>
                        </div>
                        <div className={styles.buttonHolder}>
                            <div className={styles.createButton}>create room</div>
                            <div className={styles.roomsButton} onClick={() => navigate("/rooms")}>rooms</div>
                        </div>
                    </div>
                    <img src={dhvsuimage} alt="Image" className={styles.rightBox} />
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
            </div>
        </>
    );

}

export default Homepage;