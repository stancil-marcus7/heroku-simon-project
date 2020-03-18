import axios from "axios";

export default axios.create({
    baseURL: "https://simonpassportgame.herokuapp.com",
    withCredentials: true
})