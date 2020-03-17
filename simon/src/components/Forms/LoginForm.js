import React, {useState} from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const LoginForm = React.memo(({loginSubmit, setUsername, setPassword, registrationSubmit, setEmail, email, pssword, username}) => {
    const [newUser, setNewUser] = useState(false);

    const toggleNewUser = () => {
        setNewUser(!newUser);
        setUsername('');
        setPassword('');
        setEmail('')
    }

    return (
        <div>
            <div>
                {!newUser ? 
                <div>
                    <h1>Welcome! Please log in!</h1>
                    <form onSubmit={loginSubmit}>
                        <div className="login-form">
                            <label>Username</label><br/>
                            <input name="username" placeholder="Enter username" onChange={e => setUsername(e.target.value)}/><br/><br/>
                            <label>Password</label><br/>
                            <input name="password" placeholder="Enter password" onChange={e => setPassword(e.target.value)}/> 
                        </div><br/>
                        <input className="click" type="submit" value="Login"/>
                    </form>
                </div> :
                <div>
                    <h1>Sign Up!</h1>
                    <form onSubmit={registrationSubmit}>
                        <div className="login-form">
                            <label>E-mail</label><br/>
                            <input name="email" onChange={e => setEmail(e.target.value)} placeholder="Please enter e-mail"/><br/><br/>
                            <label>Username</label>
                            <input onChange={e => setUsername(e.target.value)} placeholder="Please enter username"/><br/><br/>
                            <label>Password</label>
                            <input onChange={e => setPassword(e.target.value)} placeholder="Please enter password"/>
                        </div><br/>
                        <input className="click" type="submit" value="Sign Up"/>
                    </form>
                </div>}
            </div>
            <div>
                <h1>...Or use your social media</h1>
                <a href="http://127.0.0.1:3001/auth/google" className="btn btn-block btn-social btn-google">
                     <span><FontAwesomeIcon icon={['fab', 'google']}/></span> Sign in with Google
                </a>
                <a href="http://127.0.0.1:3001/auth/facebook" className="btn btn-block btn-social btn-facebook">
                    <span><FontAwesomeIcon icon={['fab', 'facebook-f']}/></span> Sign in with Facebook
                </a>
            </div><br/><br/>
            <input onClick={toggleNewUser} className="click" type="button" value={!newUser ? "Don't have an account? Sign Up!" : "Already have an account? Login"}/>
        </div>
    )
})

export default LoginForm;
