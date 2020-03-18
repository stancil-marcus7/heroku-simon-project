export default (state, action) => {
    switch (action.type) {
        case 'SET_ACTIVE_STYLE':
            return {
                ...state,
                activeStyle: action.style
            }
        case 'UPDATE_LAST_COLOR':
            return {
                ...state,
                lastColor: action.color
            }
        case 'UPDATE_USER_PATTERN':
            return {
                ...state,
                userPattern: [...state.userPattern, action.id]
            }
        case 'UPDATE_GAME_PATTERN':
            return {
                ...state,
                gamePattern: [...state.gamePattern, action.color]
            }
        case 'TOGGLE_PRESSED':
            console.log(action.color)
            return {
                ...state,
                pressed: action.color
            }
        case 'TURN_ON_READY_FOR_USER_INPUT':
            console.log(`here`)
            return {
                ...state,
                readyForUserInput: true
            }
        case 'TURN_OFF_READY_FOR_USER_INPUT':
            return {
                ...state,
                readyForUserInput: false
            }
        case 'RESET_GAME':
            return {
                ...state,
                gamePattern: [],
                userPattern: [],
                lastColor: "",
                level: 0,
                gameStarted: false,
                userIsWrong: false,
                readyForUserInput: false,
                activeStyle: '',
                strictRestart: false
            }
        case 'UPDATE_LEVEL':
            return {
                ...state,
                level: state.level + action.level
            }
        case 'TURN_OFF_USER_IS_WRONG':
            return{
                ...state,
                userIsWrong: false
            }
        case 'TURN_ON_USER_IS_WRONG':
                return{
                    ...state,
                    userIsWrong: true
                }
        case 'TOGGLE_STRICT_MODE':
            return {
                ...state,
                strictMode: !state.strictMode
            }
        case 'TOGGLE_GAME_STARTED':
            return {
                ...state,
                gameStarted: !state.gameStarted
            }
        case 'TOGGLE_GAME_OVER':
            return {
                ...state,
                gameOver: !state.gameOver
            }
        case 'EMPTY_USER_PATTERN':
            return {
                ...state,
                userPattern: []
            }
        case 'SET_PLAYER_LEVEL':
            return{
                ...state,
                level: action.level
            }
        default:
            return {
                ...state
            };     
    }
}