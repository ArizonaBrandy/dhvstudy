import styles from './ForumPost.module.css';
import dhvsuimage from '../../assets/dhvstudypic.png';
import { useNavigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import { db } from '../../firebase/firebase';
import { doc, getDoc, updateDoc, arrayUnion, onSnapshot } from 'firebase/firestore';

function ForumPost({ user }) {
    const [currentUser, setCurrentUser] = useState(null);
    const [currentPostId, setCurrentPostId] = useState("");
    const [showButtons, setShowButtons] = useState(false);
    const [post, setPost] = useState(null);
    const [newReply, setNewReply] = useState(""); // For the reply text

    const navigate = useNavigate();

    // Extract the post ID from the URL
    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const postId = urlParams.get('id');
        if (postId) {
            setCurrentPostId(postId);
        }
    }, []);

    // Fetch user data
    useEffect(() => {
        if (user?.uid) {
            const fetchUserData = async () => {
                try {
                    const userDocRef = doc(db, "users", user.uid);
                    const userDocSnap = await getDoc(userDocRef);
                    if (userDocSnap.exists()) {
                        setCurrentUser({
                            id: user.uid,
                            ...userDocSnap.data(),
                        });
                    } else {
                        console.log("User document does not exist.");
                    }
                } catch (error) {
                    console.error("Error fetching user data:", error);
                }
            };

            fetchUserData();
        }
    }, [user?.uid]);

    // Fetch post data with real-time updates
    useEffect(() => {
        if (currentPostId) {
            const postDocRef = doc(db, "forumposts", currentPostId);

            // Set up real-time listener for post document
            const unsubscribe = onSnapshot(postDocRef, (docSnap) => {
                if (docSnap.exists()) {
                    setPost(docSnap.data());
                } else {
                    console.log("Post document does not exist.");
                }
            });

            // Clean up the listener when the component unmounts
            return () => unsubscribe();
        }
    }, [currentPostId]);

    const handleAddReply = async () => {
        if (!newReply.trim()) return; // Ensure the reply isn't empty
    
        if (!currentPostId) {
            console.error("Error: Post ID is not available.");
            return;
        }
    
        const userName = currentUser?.username || "Anonymous"; // Use currentUser.username or fallback
    
        try {
            const postDocRef = doc(db, "forumposts", currentPostId);
    
            await updateDoc(postDocRef, {
                comments: arrayUnion({
                    name: userName, // Use username here
                    reply: newReply.trim(),
                }),
            });
    
            setNewReply(""); // Clear the reply box
            setShowButtons(false);
            console.log("Reply added successfully!");
        } catch (error) {
            console.error("Error adding reply:", error);
        }
    };

    return (
        <>
            <div className={styles.container}>
                <div className={styles.header}>
                    <span
                        style={{ fontSize: '2rem', color: '#9b3e01', cursor: 'pointer' }}
                        onClick={() => navigate('/settings')}
                    >
                        DHVSTUDY
                    </span>
                    <img
                        src={dhvsuimage}
                        alt="Dhvstudy"
                        className={styles.dhvsu}
                        onClick={() => navigate('/home')}
                    />
                    <span
                        style={{ fontSize: '1rem', color: '#9b3e01', fontWeight: 'bold', cursor: 'pointer' }}
                        onClick={() => navigate('/forums')}
                    >
                        FORUMS
                    </span>
                </div>
                <div className={styles.middle}>
                    <div className={styles.middleContainer}>
                        {post ? (
                            <>
                                <span style={{ fontSize: "1.5rem" }}>{post.uploader}</span>
                                <span style={{ fontSize: "1.5rem" }}>{post.subject}</span>
                                <span>{post.body}</span>
                            </>
                        ) : (
                            <span>Loading post...</span>
                        )}
                        <div className={styles.commentHolder}>
                            {post ? (
                                post.comments && post.comments.length > 0 ? (
                                    post.comments.map((comment, index) => (
                                        <div key={index} className={styles.comment}>
                                            <div className={styles.name}>{comment.name}</div>
                                            <div className={styles.reply}>{comment.reply}</div>
                                        </div>
                                    ))
                                ) : (
                                    <div>No comments yet</div>
                                )
                            ) : (
                                <div>Loading post...</div>
                            )}
                        </div>
                        <div className={styles.textareaHolder}>
                            <textarea
                                name=""
                                id=""
                                className={styles.replyBox}
                                placeholder="Comment to this post"
                                value={newReply}
                                onChange={(e) => {
                                    setNewReply(e.target.value);
                                    setShowButtons(e.target.value.length > 0);
                                }}
                            ></textarea>
                            {showButtons && (
                                <div className={styles.buttonHolder}>
                                    <button className={styles.submitButton} onClick={handleAddReply}>
                                        Submit
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default ForumPost;
