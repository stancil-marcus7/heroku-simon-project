export default (state, action) => {
    switch (action.type) {
        case "SET_LOGIN_STATUS": 
            return {
                ...state,
                loggedIn: action.loggedIn
            }
        case "SET_USERNAME": 
            return {
                ...state,
                username: action.username
            }
        case "SET_REG_SCORE": 
            return {
                ...state,
                regScore: action.regScore
            }   
        case "SET_STRICT_SCORE": 
            return {
                ...state,
                strictScore: action.strictScore
            } 
        default:
            return {
                ...state
            };     
    }
}