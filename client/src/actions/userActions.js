export const setLoginStatus = (loggedIn=false) => ({
    type: "SET_LOGIN_STATUS",
    loggedIn
})

export const setUsername = (username=false) => ({
    type: "SET_USERNAME",
    username
})

export const setRegScore = (regScore=0) => ({
    type: "SET_REG_SCORE",
    regScore
})

export const setStrictScore = (strictScore=0) => ({
    type: "SET_STRICT_SCORE",
    strictScore
})

