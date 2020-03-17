import React, {useState, useReducer, useEffect, useCallback} from 'react';
import simonReducer from './reducers/reducer';
import userReducer from './reducers/userReducer'
import AppContext from './context/app-context'
import './App.css';
import red from './sounds/red.mp3'
import blue from './sounds/blue.mp3'
import green from './sounds/green.mp3'
import yellow from './sounds/yellow.mp3'
import wrong from './sounds/wrong.mp3'
import Buttons from './components/Buttons/Buttons'
import Navbar from './components/Navigation/Navbar'
import ScoreboardModal from './components/Modals/ScoreboardModal';
import LoginModal from './components/Modals/LoginModal';
import { toggleGameOver, updateLevel, turnOnReadyForUserInput, turnOffReadyForUserInput, toggleSrtictMode, resetSimonGame, updateGamePattern, toggleGameStarted, setActiveStyle, emptyUserPattern, updateLastColor, turnOnUserIsWrong, turnOffUserIsWrong, togglePressed } from './actions/actions';
import axios from './axios';

const App = React.memo(() => {

  const colorsSet = useState(["red","blue","green","yellow"]);
  const soundsSet = useState({
    red: new Audio(red),
    blue: new Audio(blue),
    green: new Audio(green),
    yellow: new Audio(yellow),
    wrong: new Audio(wrong)
  });

  const [showScoreModal, setShowScoreModal] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const colors = colorsSet[0];
  const sounds = soundsSet[0]

  const defaultState = {
    gamePattern: [],
    //the pattern that the user inputs
    userPattern: [],
    //used to indicate the current color in the sequence; used for fade in and fade out animation
    lastColor: "",
    //keeps track of the current level
    level: 0,
    //indicates whether game is over or not
    gameOver: false,
    //indicates if game has started
    gameStarted: false,
    //indicates when the user has input the wrong pattern
    userIsWrong: false,
    //indicates when the game will allow the user to pick colors for their pattern
    readyForUserInput: false,
    //used to track whether strict mode (if the user picks a wrong color the game resets) is on or not
    strictMode: false,
    //used to add light-up border animation
    pressed: '',
    //used to apply fade in, fade out animation
    activeStyle: '',
}

const userDefaultState = {
  loggedIn: false,
  username: '',
  regScore: 0,
  strictScore: 0
}

const [state, dispatch] = useReducer(simonReducer, defaultState);
const [repeatSequence, setRepeatSequence] = useState(false)

const [userState, userDispatch] = useReducer(userReducer, userDefaultState);


const handleShowScoreModal = () => {
  setShowScoreModal(true);
}

const handleCloseScoreModal = () => {
  setShowScoreModal(false)
}

const handleShowLoginModal = () => {
  setShowLoginModal(true);
}

const handleCloseLoginModal = () => {
  setShowLoginModal(false)
}

const handleNewSequence = useCallback(() => {
  let randomColor = colors[Math.floor(Math.random() * 4)];

  dispatch(updateGamePattern(randomColor))
  dispatch(updateLastColor(randomColor));
  sounds[randomColor].play()

  // this.fadeInFadeOut(randomColor);
  fadeInFadeOut();
  //used for prevent user from picking colors while the sequence is being shown to them
  setTimeout(() => {
    dispatch(turnOnReadyForUserInput())
  }, 500)
},[colors, sounds])

useEffect(() => {
  if (state.gameStarted && state.level === 0){
    dispatch(updateLevel())
    handleNewSequence()
  }
},[state.gameStarted, state.level, handleNewSequence])

useEffect(() => { 
  if (state.userPattern.length > 0){
    let lastColor = state.userPattern[state.userPattern.length - 1]
  sounds[lastColor].pause();
  sounds[lastColor].currentTime = 0;
  dispatch(togglePressed(lastColor))
  setTimeout(() => {
      dispatch(togglePressed())
  },200)
  sounds[lastColor].play();
}
},[state.userPattern, sounds])

const fadeInFadeOut = () => {
  dispatch(setActiveStyle('fadeOut '));
  //after half a second the fade in animation will occur
  setTimeout(() => {
    dispatch(setActiveStyle('fadeIn '));
    dispatch(updateLastColor());
  }, 500)
} 

useEffect(() => {
  if(state.userPattern){
    const initialCheck = setTimeout(() => {
      let index = state.userPattern.length - 1;
      console.log(state.gamePattern);
      console.log(state.userPattern)
      if ((state.userPattern[index] !== state.gamePattern[index])) {
        dispatch(turnOffReadyForUserInput());
      }
  
      if ((state.userPattern.length === state.gamePattern.length)) {
        //disables buttons when user finishes their turn
        dispatch(turnOffReadyForUserInput());
  
      }
    },100)

    const strictCheck = setTimeout(() => {
      if (state.strictMode){
        let index = state.userPattern.length - 1;
        if (state.userPattern[index] !== state.gamePattern[index])
        {
          // Prevents the initial check from occuring because at this point we know the user has already input the incorrect pattern
          clearTimeout(initialCheck);
          dispatch(turnOffReadyForUserInput());
        }
      }
    },50)

    return () => {
      clearTimeout(initialCheck)
      clearTimeout(strictCheck)
    }
  }
},[state.userPattern, state.strictMode, state.gamePattern])

const wrongAnswer = useCallback(() => {
  dispatch(toggleGameOver());
    sounds['wrong'].play();
    if (state.strictMode){
      setTimeout(() => {
      resetGame()
    }, 500)} else {
      setRepeatSequence(repeatSequence => !repeatSequence)
    }
},[sounds, state.strictMode])

const verifyUserMoves = useCallback(() => {
  if(state.userPattern.join() === state.gamePattern.join()){
    console.log('update level')
    dispatch(updateLevel());
    setRepeatSequence(true);
  } else {
    wrongAnswer();
  }
},[state.gamePattern, state.userPattern, wrongAnswer])

useEffect(() => {
  if (!state.readyForUserInput && state.userPattern.length > 0){
    verifyUserMoves();
  }
},[state.readyForUserInput, verifyUserMoves, state.userPattern.length])

useEffect(() => {
  if (state.gameOver){
    document.body.style.background = "red";
    dispatch(turnOnUserIsWrong());
    const wrongTimeout = setTimeout(() => {
      dispatch(toggleGameOver());
    }, 500)

    let mode = 'regular'
    let score = state.level - 1;
    if (state.strictMode){
      mode = 'strict'
    }

    const user={
        mode,
        score
    }

    axios.post('/submit', user)
      .then(response => {
        console.log('successfully updated player', response);
      }, error => {
        console.log('did not successfully update player', error)
      })

    return () => {
      clearTimeout(wrongTimeout);
    }
  } else {
    document.body.style.background = "linear-gradient(to right, #FC466B , #3F5EFB)"
  }
},[state.gameOver, state.strictMode, state.level])


useEffect(() => {
  if (repeatSequence){
    console.log(`repeatSequence ` + repeatSequence)
    dispatch(emptyUserPattern());
  }
},[repeatSequence])

useEffect(() => {
  if (state.userPattern.length === 0 && repeatSequence){
    let index = -1;
    const intervalRepeatSequence = setInterval(() => {
      index++;
      dispatch(updateLastColor());
      if (index <= state.gamePattern.length - 1){
        let currentColor = state.gamePattern[index];
        
        setTimeout(() => {
          dispatch(updateLastColor(currentColor));
          sounds[currentColor].play();
          fadeInFadeOut();
        },100)
      } else {
          clearInterval(intervalRepeatSequence);
          if (!state.userIsWrong){
            setTimeout(() => {
              handleNewSequence();
            },100)
          }
          if (state.userIsWrong) {
            dispatch(turnOnReadyForUserInput());
            dispatch(turnOffUserIsWrong());
          }
      }
    },1000)
    setRepeatSequence(repeatSequence => !repeatSequence)
  }
},[state.userPattern, repeatSequence, state.gamePattern, state.lastColor, handleNewSequence, state.userIsWrong, sounds])

const resetGame = () => {
  dispatch(resetSimonGame());
}

const handleStrictToggle = () =>{
  resetGame();
  dispatch(toggleSrtictMode())
}

console.log(colors)
    return(
      <AppContext.Provider value={{state, dispatch, sounds, colors, userState, userDispatch}}>
        <ScoreboardModal close={handleCloseScoreModal} showModal={showScoreModal}/>
        <LoginModal close={handleCloseLoginModal} showModal={showLoginModal}/>
        <Navbar showScoreModal={handleShowScoreModal} showLoginModal={handleShowLoginModal}/>
        <div
          className={!state.readyForUserInput && state.level > 0 ? "pointer-events-disabled" : null}>
            <h1 
              className={state.level === 0 ? "header" : "header pointer-events-disabled"}
              onClick={state.level === 0 ? () => {dispatch(toggleGameStarted())} : null}>{
                !state.gameStarted && state.level === 0 ? 
                "Click me to begin game" : 
                state.gameStarted && state.gameOver ? 
                "Wrong. Please try again" : 
                state.level > 0 
                ? "Level: " + state.level : 
                "Click me to begin game"}</h1>
            <div className="subheaders--section">
              <p 
                onClick={handleStrictToggle}
                className={!state.strictMode ? "subheader" : "subheaderClicked"} 
                >Strict Mode</p>
              <p 
              className={"subheader"}
              onClick={resetGame}>Reset</p>
            </div>
            <Buttons/>
        </div>
      </AppContext.Provider>
    )
  })

export default App;