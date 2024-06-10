import React, { useEffect, useState } from 'react';
import { Auth } from 'aws-amplify';
import { useAuthenticator } from '@aws-amplify/ui-react';

const Profile: React.FC = () => {
  const { user } = useAuthenticator(context => [context.user]);
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const userInfo = await Auth.currentAuthenticatedUser();
        setProfile(userInfo.attributes);
      } catch (error) {
        console.error('Error fetching user info:', error);
      }
    };
    fetchProfile();
  }, []);

  if (!profile) return <div>Loading...</div>;

  return (
    <div className="profile-container">
      <h2>Profile</h2>
      <p><strong>Username:</strong> {user.username}</p>
      <p><strong>Email:</strong> {profile.email}</p>
      <p><strong>Merits:</strong> {/* Display user's merits */}</p>
      <p><strong>Task History:</strong> {/* Display user's task history */}</p>
      {/* Add other profile details */}
    </div>
  );
};

export default Profile;
