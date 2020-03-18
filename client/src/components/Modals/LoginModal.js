import React, {useState} from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import LoginForm from '../Forms/LoginForm';
import axios from '../../axios';
import ErrorMessage from '../ErrorMessages/ErrorMessage';


const LoginModal = React.memo(({close, showModal}) => {
    
    const modalClass = showModal ? "modal display-block" : "modal display-none"
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    
    const loginSubmit = e => {
        e.preventDefault();
        const user = {
            username,
            password
        }
        console.log(user)
        if (username === '' || password === ''){
            setError('No field can be empty')
        } else {
            axios.post('/login', user)
            .then(response => {
                const authenticated = response.data.authenticated
                if(authenticated === true){
                    close();
                    setError(null)
                } else {
                    setError(authenticated);
                }
            }, error => {
                console.log(error, 'failed to login')
            })
        }
    }

    const registrationSubmit = e => {
        e.preventDefault();
        const user = {
            email,
            username,
            password
        }

        if (username === '' || password === '' || email === ''){
            setError('No field can be empty')
        } else {
            axios.post('/register', user)
            .then(response => {
                console.log(response)
                setError(null)
                close();
            }, error => {
                console.log(error)
                setError('Username or email already associated with account')
            })
        }
    }

    return (
        <div className={modalClass}>
            <section className="modal-main">
                <br/><br/>
                <button className="close-button" onClick={close}><FontAwesomeIcon icon="times" size="2x"/></button>
                <br/><br/>
                <LoginForm 
                    loginSubmit={loginSubmit}
                    setUsername={setUsername} 
                    setPassword={setPassword} 
                    setEmail={setEmail} 
                    registrationSubmit={registrationSubmit}
                    email={email}
                    password={password}
                    username={username}
                    /><br/><br/>
                     {error ? <ErrorMessage message={error}/> : null}
            </section>
           
        </div>
    )
})

export default LoginModal;