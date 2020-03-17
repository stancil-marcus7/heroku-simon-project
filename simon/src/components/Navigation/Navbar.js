import React, {useState, useEffect} from 'react';
import axios from '../../axios';
import { FaAlignRight } from 'react-icons/fa'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const Navbar = React.memo(({showScoreModal, showLoginModal}) => {
    
    const [loggedIn, setLoggedIn] = useState('false')
    const [username, setUsername] = useState('')
    const [regScore, setRegScore] = useState(0);
    const [strictScore, setStrictScore] = useState(0);

    useEffect(() => {
        axios.get("/loggedIn")
            .then(response => {
                if (response.data === true) {
                    setLoggedIn(true)
                    return axios.get("user")
                            .then(response => {
                                const player = response.data;
                                setUsername(player.username || player.facebookDisplayName || player.googleDisplayName || player.nickName)
                                setRegScore(player.regularModeScore)
                                setStrictScore(player.strictModeScore)
                            }, error => {
                                console.log(`couldn't get users info`, error);
                            })
                } else {
                    setLoggedIn(false)
                    console.log(response.data)
                }
            }, error => {
                console.log(error, "could not retrieve logged in status")
            })
    })

    const [toggleHamburger, setToggleHamburger] = useState(false);

    const handleHamburgerToggle = () => {
        setToggleHamburger(toggleHamburger => !toggleHamburger)
    }

    const handleLogOut = () => {
        axios.get("/logout")
            .then(response => {
                console.log(response, 'successfully logged out')
                setLoggedIn(false);
            }, error => {
                console.log(error, 'could not log out')
            })
    }

    return (
        <div className="navbar">  
            <button className="toggleMenuButton" onClick={handleHamburgerToggle}>
                <FaAlignRight/>
            </button>
            
            <ul className={toggleHamburger && !loggedIn ? "links show-nav--login" : toggleHamburger ? "links show-nav" : "links"}>
                {loggedIn ?
                <>
                <li>{"Welcome " + username}</li>
                <li>{regScore===undefined ?  "Reg Score: 0" : `Reg Score ${regScore}`}</li>
                <li>{strictScore===undefined ? "Strict Score: 0" : `Strict Score ${strictScore}`}</li>
                </> : null}
                <li onClick={showScoreModal} style={{cursor: "pointer"}}><FontAwesomeIcon icon="table"/> Scoreboard</li>
                {loggedIn ? <li onClick={handleLogOut} style={{cursor: "pointer"}}><FontAwesomeIcon icon="user"/> Log Out</li> : <li onClick={showLoginModal} style={{cursor: "pointer"}}><FontAwesomeIcon icon="user"/> Login</li>}
            </ul>
        </div>    
    )
})

export default Navbar;