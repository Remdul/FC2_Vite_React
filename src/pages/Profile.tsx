import { useEffect, useState } from "react";
import { Auth } from 'aws-amplify';

const Profile = () => {
  const [userData, setUserData] = useState<any>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const user = await Auth.currentAuthenticatedUser();
        setUserData(user);
      } catch (error) {
        console.error("Error fetching user data", error);
      }
    };

    fetchUserData();
  }, []);

  if (!userData) return <div>Loading...</div>;

  return (
    <div className="profile-container">
      <h1>Profile Page</h1>
      <div>
        <strong>Username:</strong> {userData.username}
      </div>
      <div>
        <strong>Email:</strong> {userData.attributes.email}
      </div>
      {/* Add more user information here as needed */}
    </div>
  );
};

export default Profile;
