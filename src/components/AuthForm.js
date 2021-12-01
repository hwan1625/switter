import {createUserWithEmailAndPassword, signInWithEmailAndPassword} from 'firebase/auth';
import {authService} from 'fbase';
import {useState} from 'react';

const AuthForm = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [newAccount, setNewAccount] = useState(true);
    const [error, setError] = useState("");

    const onChange = (event) => {
        const {target: {name,value}} = event;
        if(name === "email") {
            setEmail(value);
        } else if(name === "password") {
            setPassword(value);
        }
    };

    const onSubmit = async (event) => {
        //form 엘리먼트에서 submit하여 새로고침되는 현상을 막음.
        event.preventDefault();
        try {
            let data;
            if(newAccount) {
                //계정 만들기
                data = createUserWithEmailAndPassword(authService,email,password);
            } else {
                //로그인 하기
                data = await signInWithEmailAndPassword(authService,email,password);
            }
        } catch(error) {
            setError(error.message);
        }
    };

    const toggleAccount = () => setNewAccount((prev) => !prev);

    return (
        <>
            <form onSubmit={onSubmit}>
                <input name="email" type="email" placeholder="Email" required value={email} onChange={onChange} />
                <input name="password" type="password" placeholder="Password" required value={password} onChange={onChange}/>
                <input type="submit" value={newAccount ? "Create Account" : "Log In"} />{error}
            </form>
            <span onClick={toggleAccount}>
                {newAccount ? "Sign In" : "Create Account"}
            </span>
        </>
    );
};

export default AuthForm;