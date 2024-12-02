import React, { useEffect, useState } from 'react';
import { makeGetRequest, makePatchRequest, redirectToLogin } from '../services/authService';

interface ProfileInterface {
    uuid: string;
    username: string;
    first_name: string;
    last_name: string;
}

const Profile: React.FC = () => {
    const [editProfile, setEditProfile] = useState<ProfileInterface | null>(null);

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
                alert("Saved")
                setEditProfile(response.data); // Update state with the server response
            }
        } catch (error) {
            console.error('Error updating profile:', error);
            alert('Failed to update profile. Please try again.');
        }
    };

    return (
        <div>
            <h1>Edit Profile</h1>
            {editProfile ? (
                <form onSubmit={handleFormSubmit}>
                    <label>
                        Username:
                        <input
                            type="text"
                            name="username"
                            value={editProfile.username || ''}
                            onChange={handleInputChange}
                        />
                    </label>
                    <br />
                    <label>
                        First Name:
                        <input
                            type="text"
                            name="first_name"
                            value={editProfile.first_name || ''}
                            onChange={handleInputChange}
                        />
                    </label>
                    <br />
                    <label>
                        Last Name:
                        <input
                            type="text"
                            name="last_name"
                            value={editProfile.last_name || ''}
                            onChange={handleInputChange}
                        />
                    </label>
                    <br />
                    <button type="submit">Save</button>
                </form>
            ) : (
                <p>Loading profile...</p>
            )}
        </div>
    );
};

export default Profile;
