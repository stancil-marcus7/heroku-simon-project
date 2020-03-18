import React, {useState} from 'react';

const RegistrationForm = () => {
    
    return (
        <div>
            <div>
                <h1>Sign Up!</h1>
                <form onSubmit={registrationSubmit}>
                    <div className="login-form">
                        <label>E-mail</label><br/>
                        <input placeholder="Please enter e-mail"/><br/><br/>
                        <label>Username</label>
                        <input placeholder="Please enter username"/>
                        <label>Password</label>
                        <input placeholder="Please enter password"/>
                    </div><br/>
                    <input className="click" type="submit" value="Sign Up"/>
                </form>
            </div>
            <div>
                <h1>...Or use your social media</h1>
                <a href="http://127.0.0.1:3001/auth/google" className="btn btn-block btn-social btn-google">
                     <span><FontAwesomeIcon icon={['fab', 'google']}/></span> Sign in with Google
                </a>
                <a href="http://127.0.0.1:3001/auth/facebook/" className="btn btn-block btn-social btn-facebook">
                    <span><FontAwesomeIcon icon={['fab', 'facebook-f']}/></span> Sign in with Facebook
                </a>
            </div><br/><br/>
            <input className="click" type="button" value="Don't have an account? Sign Up!"/>
        </div>
    )
}

export default RegistrationForm;