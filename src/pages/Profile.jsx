import React, { useEffect, useState } from 'react';
import { getAuth } from 'firebase/auth';

const Profile = () => {
  const [user, setUser] = useState(null);
  const auth = getAuth();
  useEffect(() => {
    setUser(auth.currentUser);
  }, []);

  return user ? <h1>{user.displayName}</h1> : <h1>Loading...</h1>;
};

export default Profile;
