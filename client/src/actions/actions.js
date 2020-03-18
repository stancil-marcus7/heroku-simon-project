export const setActiveStyle = (style = '') => ({
    type: 'SET_ACTIVE_STYLE',
    style
})

export const updateLastColor = (color = '') => ({
    type:'UPDATE_LAST_COLOR',
    color
})

export const updateUserPattern = (id  = '') => ({
    type: 'UPDATE_USER_PATTERN',
    id
})

export const updateGamePattern = (color = '') => ({
    type: 'UPDATE_GAME_PATTERN',
    color
})

export const togglePressed = (color = '') => ({
    type: 'TOGGLE_PRESSED',
    color
})

export const turnOnReadyForUserInput = () => ({
    type: 'TURN_ON_READY_FOR_USER_INPUT'
})

export const turnOffReadyForUserInput = () => ({
    type: 'TURN_OFF_READY_FOR_USER_INPUT'
})

export const resetSimonGame = () => ({
    type: 'RESET_GAME'
})

export const updateLevel = ({level = 1} = {}) => ({
    type: 'UPDATE_LEVEL',
    level
})

export const setPlayerLevel = (level = 0) => ({
    type: 'SET_PLAYER_LEVEL',
    level
})

export const toggleStrictRestart = () => ({
    type: "TOGGLE_STRICT_RESTART"
})

export const toggleSrtictMode = () => ({
    type: 'TOGGLE_STRICT_MODE'
})

export const toggleGameStarted = () => ({
    type: 'TOGGLE_GAME_STARTED'
})

export const toggleGameOver = () => ({
    type: 'TOGGLE_GAME_OVER'
})

export const emptyUserPattern = () => ({
    type: 'EMPTY_USER_PATTERN'
})

export const turnOffUserIsWrong = () => ({
    type: 'TURN_OFF_USER_IS_WRONG'
})

export const turnOnUserIsWrong = () => ({
    type: 'TURN_ON_USER_IS_WRONG'
})