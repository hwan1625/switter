import {authService} from 'fbase';
import {updateProfile} from 'firebase/auth';
import { useHistory } from 'react-router-dom';
import {useState} from 'react';

const Profile = ({refreshUser, userObj}) => {
    const history = useHistory();
    const [newDisplayName, setNewDisplayName] = useState(userObj.displayName);
    
    const onLogOutClick = () => {
        authService.signOut();
        history.push("/");
    };

    const onChange = (event) => {
        const {target: {value}} = event;
        setNewDisplayName(value);
    };

    const onSubmit = async (event) => {
        event.preventDefault();
        if(userObj.displayName !== newDisplayName) {
            await updateProfile(userObj, {displayName: newDisplayName});
            refreshUser();
        }
    };
    

    return (
        <div className="container">
            <form onSubmit={onSubmit} className="profileForm">
                <input onChange={onChange} type="text" placeholder="Display name" value={newDisplayName} autoFocus className="formInput" />
                <input type="submit" value="Update profile" className="formBtn" style={{marginTop: 10}} />
            </form>
            <span onClick={onLogOutClick} className="formBtn cancelBtn logOut">
                Log Out
            </span>
        </div>
    );
};

export default Profile;