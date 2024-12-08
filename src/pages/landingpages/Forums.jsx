import styles from './Forums.module.css';
import dhvsuimage from '../../assets/dhvstudypic.png';
import { useNavigate } from 'react-router-dom';

function Forums({user}){

    const navigate = useNavigate();

    return(
        <>
            <div className={styles.container}>
                <div className={styles.header}>
                    <span style={{fontSize: '2rem', color: '#9b3e01', cursor: "pointer"}} onClick={() => navigate("/settings")}>DHVSTUDY</span>
                    <img src={dhvsuimage} alt="Dhvstudy" className={styles.dhvsu} onClick={() => navigate("/home")}/>
                    <span style={{fontSize: '1rem', color: '#9b3e01', fontWeight: 'bold', cursor: 'pointer'}}>FORUMS</span>
                </div>
                <div className={styles.middle}>
                    <div className={styles.buttonHolder}>
                        <div className={styles.createpostButton}>CREATE POST</div>
                    </div>
                    <div className={styles.postHolder}>
                        <div className={styles.post}>
                            <span>Anonymous</span>
                            <span>Tips nga po for coding</span>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );

}

export default Forums;