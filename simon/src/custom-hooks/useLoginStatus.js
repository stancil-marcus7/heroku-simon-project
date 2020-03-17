import {useState, useEffect} from 'react';
import axios from '../axios'

export default function useLoginStatus() {
    const [status, setStatus] = useState(false)
    useEffect(() => {
        axios.get("/loggedIn")
        .then(response => {
            if (response.data === true) {
                setStatus(true)
            }
        })
    })

    return status;
}