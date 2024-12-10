import React, { useEffect, useState} from "react";
import { useParams, useNavigate } from "react-router-dom";
import { auth, db } from "../../firebase/firebase"
import { doc, getDoc } from "firebase/firestore"
import styles from "./Room.module.css"

function Room({user}){

    const [roomId, setRoomId] = useState("");
    const [isRoomSecure, setIsRoomSecure] = useState(false);
    const [roomName, setRoomName] = useState("");

    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const id = queryParams.get("id");
        setRoomId(id);

        const fetchRoomData = async () => {
            if (id) {
                try {
                    const roomDocRef = doc(db, "rooms", id);
                    const roomDocSnap = await getDoc(roomDocRef);

                    if (roomDocSnap.exists()) {
                        const roomData = roomDocSnap.data();
                        setRoomName(roomData.roomName); 
                        setIsRoomSecure(!!roomData.roomPasscode); 
                    } else {
                        console.log("No such room exists!");
                    }
                } catch (error) {
                    console.error("Error fetching room data:", error);
                }
            }
        };

        fetchRoomData();
    }, [location.search]);
    
    console.log(roomId);

    return(
        <>
            <div className={styles.container}>
                <div className={styles.header}>
                    <span>{roomName || "..."}</span>
                </div>
                <div className={styles.middle}>
                    <div className={styles.member}>
                        
                    </div>
                </div>
            </div>
        </>
    );

}

export default Room;