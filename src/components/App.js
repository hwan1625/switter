import {useEffect, useState} from 'react';
import AppRouter from 'components/Router';
import {authService} from 'fbase';
import {updateProfile} from 'firebase/auth'

function App() {
  const [init, setInit] = useState(false);
  const [userObj, setUserObj] = useState(null);

  useEffect(() => {
    console.log(userObj);
    authService.onAuthStateChanged((user) => {
      if(user) {
        setUserObj(user);
      } else {
        setUserObj(false);
      }
      setInit(true);
    });

  }, []);

  const refreshUser = () => {
    const user = authService.currentUser;
    setUserObj({
      uid: user.uid,
      displayName: user.displayName,
      updateProfile: (args) => updateProfile(user, args),
    });
  };

  return (
    <>
      {init ? (
        <AppRouter refreshUser={refreshUser} isLoggedIn={Boolean(userObj)} userObj={userObj} />
        ) : (
        "initializing..."
        )
      }
    </>
  );
}

export default App;
