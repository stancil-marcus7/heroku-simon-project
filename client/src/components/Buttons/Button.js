import React, {useEffect} from 'react';
import { useSelector } from 'react-redux';
import { togglePressed } from './actions/actions'
import { updateUserPattern } from './actions/actions'



const Button = ({id, sound, handleInput}) => {

    const lastColor = useSelector(state => state.lastColor);
    const activeStyle = useSelector(state => state.activeStyle);
    const readyForUserInput = useSelector(state => state.readyForUserInput);
    const pressed = useSelector(state => state.pressed)

    useEffect(()=> {
        console.log("rendered")
    })
    chooseColor = () => {
        console.log("here")
        if (readyForUserInput){
            
            sound.pause();
            sound.currentTime = 0;
            dispatch(updateUserPattern(id))
            dispatch(togglePressed(id))
            setTimeout(() => {
                dispatch(togglePressed())
            },100)
            sound.play();
            handleInput();
          
            
        }   
    }

    return (
        <div className={lastColor === id ? 
            activeStyle + id + " button pointer-events-disabled" : 
        !readyForUserInput ? id + " button pointer-events-disabled" : 
        pressed === id ?
        // When you click on the button it will light up and handleInput will be called in App.js and determine how the input should be interpretted
        id + " button pressed" : id + " button"} onClick={this.chooseColor}></div>
    )

}

export default Button;
