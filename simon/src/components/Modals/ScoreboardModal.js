import React, {useState, useEffect} from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from '../../axios'

const ScoreboardModal = React.memo(({close, showModal}) => {

    const modalClass = showModal ? "modal display-block" : "modal display-none"

    const [lim, setLim] = useState(10);
    const [players, setPlayers] = useState([]);
    const [rank, setRank] = useState()

    useEffect(() => {
        axios.get(`/players/?lim=${lim}`)
            .then(response => {
                setPlayers(response.data)
            }, error => {
                console.log(error, "Cannot retrieve players");
            })
    }, [lim])

    useEffect(() => {
        axios.get('/rank')
            .then(response => {
                setRank(response.data.rank)
            }, error => {
                console.log(error);
            })
    })

    
    const getMoreScores  = () => {
        setLim(lim + 10);
    }


    return(
        <div className={modalClass}>
            <section className="modal-main">
                <br/><br/>
                <button className="close-button" onClick={close}><FontAwesomeIcon icon="times" size="2x"/></button>
                    <br/><br/>
                    <h1>Check the Scoreboard!</h1>
                    <br/>
                    {rank ? <h3>{`Your rank is #${rank} in the world`}</h3> : null}
                    {players ? <table>
                        <thead>
                            <tr>
                                <th>Username</th>
                                <th>Regular Score</th>
                                <th>Strict Score</th>
                            </tr>
                        </thead>
                        <tbody>
                            {players.map((player, key) => (
                                <tr key={key}>
                                    <td>{player.username || player.facebookDisplayName || player.googleDisplayName || player.nickName}</td>
                                    <td>{player.regularModeScore}</td>
                                    <td>{player.strictModeScore}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table> : null}
                    <br/><br/>
                    <input type="button" className="click" onClick={getMoreScores} value="See more scores" />
                    <br/><br/>
                </section>
        </div>
    )
})

export default ScoreboardModal;
