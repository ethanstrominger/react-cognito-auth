import React, { useEffect, useState } from 'react';
import { makeGetRequest, makePatchRequest, redirectToLogin } from '../services/authService';
import { useUser } from '../contexts/UserContext'; // Import UserContext
import styles from '../styles/Profile.module.css'; // Import CSS module

interface ProfileInterface {
    uuid: string;
    username: string;
    first_name: string;
    last_name: string;
}

const Profile: React.FC = () => {
    const { setFirstName, setLastName } = useUser(); // Get setters from UserContext
    const [editProfile, setEditProfile] = useState<ProfileInterface | null>(null);
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await makeGetRequest('api/v1/me/');
                setEditProfile(response.data);
            } catch (error) {
                redirectToLogin();
            }
        };

        fetchProfile();
    }, []);

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (editProfile) {
            const { name, value } = event.target;
            setEditProfile((prevProfile) =>
                prevProfile ? { ...prevProfile, [name]: value } : null
            );
        }
    };

    const handleFormSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        try {
            if (editProfile) {
                const response = await makePatchRequest('api/v1/me/', editProfile);
                setEditProfile(response.data); // Update state with the server response

                // Set first and last name in context
                setFirstName(response.data.first_name);
                setLastName(response.data.last_name);

                showMessage('success', 'Profile updated successfully!');
            }
        } catch (error) {
            console.error('Error updating profile:', error);
            showMessage('error', 'Failed to update profile. Please try again.');
        }
    };

    const showMessage = (type: 'success' | 'error', text: string) => {
        setMessage({ type, text });
        setTimeout(() => setMessage(null), 5000); // Clear the message after 5 seconds
    };

    return (
        <div className={styles.container}>
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
