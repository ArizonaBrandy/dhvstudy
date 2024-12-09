import styles from './Forums.module.css';
import dhvsuimage from '../../assets/dhvstudypic.png';
import { useNavigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import { db } from '../../firebase/firebase';
import { onSnapshot, collection, addDoc, doc, getDoc } from 'firebase/firestore';

function Forums({ user }) {
    const [isModalCreate, setIsModalCreate] = useState(false);
    const [posts, setPosts] = useState([]);
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [error, setError] = useState(null);
    const [currentUser, setCurrentUser] = useState(null);

    const navigate = useNavigate();

    // Fetch the current user's data
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

    // Fetch forum posts
    useEffect(() => {
        const forumpostsRef = collection(db, "forumposts");

        const unsubscribe = onSnapshot(forumpostsRef, (snapshot) => {
            const fetchedPosts = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
            setPosts(fetchedPosts);
        });

        return () => unsubscribe();
    }, []);

    // Handle post creation
    const handleCreatePost = async (e) => {
        e.preventDefault();

        if (!title || !content) {
            setError("Both title and content are required!");
            return;
        }

        try {
            await addDoc(collection(db, "forumposts"), {
                uploader: currentUser?.username || user?.email || "Anonymous",
                subject: title,
                body: content,
                createdAt: new Date(),
                comments: [],
            });

            setTitle("");
            setContent("");
            setIsModalCreate(false);
            setError(null);
        } catch (err) {
            console.error("Error creating post:", err);
            setError("Failed to create post. Please try again.");
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
                    <span style={{ fontSize: '1rem', color: '#9b3e01', fontWeight: 'bold', cursor: 'pointer' }}>
                        FORUMS
                    </span>
                </div>
                <div className={styles.middle}>
                    <div className={styles.buttonHolder}>
                        <div className={styles.createpostButton} onClick={() => setIsModalCreate(true)}>
                            CREATE POST
                        </div>
                    </div>
                    <div className={styles.postHolder}>
                        {posts.map((post) => (
                            <div key={post.id} className={styles.post}>
                                <span>{post.uploader || 'Anonymous'}</span>
                                <span>{post.subject || 'No subject provided'}</span>
                            </div>
                        ))}
                    </div>
                </div>
                {isModalCreate && (
                    <div className={styles.modal}>
                        <div className={styles.modalContainer}>
                            <form onSubmit={handleCreatePost}>
                                <i
                                    className="fa-regular fa-circle-xmark"
                                    onClick={() => setIsModalCreate(false)}
                                ></i>
                                <span style={{ color: '#9b3e01' }}>Create a Post</span>
                                <input
                                    type="text"
                                    className={styles.input}
                                    placeholder="Title"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    required
                                />
                                <textarea
                                    className={styles.inputTextarea}
                                    placeholder="Share your thoughts"
                                    value={content}
                                    onChange={(e) => setContent(e.target.value)}
                                    required
                                ></textarea>
                                <div className={styles.buttonHolder}>
                                    <button className={styles.postButton} type="submit">
                                        Post
                                    </button>
                                </div>
                                {error && <p style={{ color: 'red' }}>{error}</p>}
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}

export default Forums;
