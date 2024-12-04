import React, { useEffect, useState } from 'react';
import { makePatchRequest } from '../services/authService';
import { useUser, UserContextType } from '../contexts/UserContext'; // Import UserContext
import styles from '../styles/Profile.module.css'; // Import CSS module

const Profile: React.FC = () => {
    const user = useUser(); // Get the entire user object from context
    console.log("User", user)

    // Initialize editProfile with the values from `useUser`
    const [editProfile, setEditProfile] = useState<UserContextType>({
        username: user.username,
        first_name: user.first_name,
        last_name: user.last_name,
        setUsername: user.setUsername,
        setfirst_name: user.setfirst_name,
        setlast_name: user.setlast_name,
    });

    useEffect(() => {
        if (user) {
            setEditProfile({
                username: user.username,
                first_name: user.first_name,
                last_name: user.last_name,
                setUsername: user.setUsername,
                setfirst_name: user.setfirst_name,
                setlast_name: user.setlast_name,
            });
        }
    }, [user]);

    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setEditProfile((prevProfile) =>
            prevProfile ? { ...prevProfile, [name]: value } : prevProfile
        );
    };

    const handleFormSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        try {
            const response = await makePatchRequest('api/v1/me/', editProfile);
            console.log("Updating value", response.data)
            setEditProfile(response.data); // Update the state with the server response

            // Update the context with the new values
            console.log("Changes", user.username, user.first_name, user.last_name)
            user.setUsername(response.data.username);
            user.setfirst_name(response.data.first_name);
            user.setlast_name(response.data.last_name);

            showMessage('success', 'Profile updated successfully!');
        } catch (error) {
            console.error('Error updating profile:', error);
            showMessage('error', 'Failed to update profile. Please try again.');
        }
    };

    const showMessage = (type: 'success' | 'error', text: string) => {
        setMessage({ type, text });
        setTimeout(() => setMessage(null), 5000); // Clear the message after 5 seconds
    };

    function getCurrentTime() {
        const now = new Date();
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');

        return `${hours}:${minutes}:${seconds}`;
    }

    return (
        <div className={styles.container}>
            <p>Username { "** e **" + editProfile?.first_name + "** u ** " + useUser().first_name + " ** "+ getCurrentTime() } </p>
            <h1 className={styles.title}>Edit Profile</h1>
            {editProfile ? (
                <form className={styles.form} onSubmit={handleFormSubmit}>
                    <div className={styles.formGroup}>
                        <label htmlFor="username" className={styles.label}>
                            Username:
                        </label>
                        <input
                            type="text"
                            name="username"
                            id="username"
                            value={editProfile.username || ''}
                            className={styles.input}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className={styles.formGroup}>
                        <label htmlFor="first_name" className={styles.label}>
                            First Name:
                        </label>
                        <input
                            type="text"
                            name="first_name"
                            id="first_name"
                            value={editProfile.first_name || ''}
                            className={styles.input}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className={styles.formGroup}>
                        <label htmlFor="last_name" className={styles.label}>
                            Last Name:
                        </label>
                        <input
                            type="text"
                            name="last_name"
                            id="last_name"
                            value={editProfile.last_name || ''}
                            className={styles.input}
                            onChange={handleInputChange}
                        />
                    </div>
                    <button type="submit" className={styles.button}>
                        Save
                    </button>
                </form>
            ) : (
                <p className={styles.loading}>Loading profile...</p>
            )}
            {message && (
                <div className={`${styles.message} ${styles[message.type]}`}>
                    {message.text}
                </div>
            )}
        </div>
    );
};

export default Profile;
