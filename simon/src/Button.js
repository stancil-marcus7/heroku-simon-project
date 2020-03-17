import React, {useContext} from 'react';
import { updateUserPattern } from './actions/actions'
import AppContext from './context/app-context';

 
const Button = React.memo((props) => {
const {state, dispatch} = useContext(AppContext);

    return (
        <div className={state.lastColor === props.id ? 
            state.activeStyle + props.id + " button pointer-events-disabled" : 
        !state.readyForUserInput ? props.id + " button pointer-events-disabled" : 
        state.pressed === props.id ?
        // When you click on the button it will light up and handleInput will be called in App.js and determine how the input should be interpretted
        props.id + " button pressed" : props.id + " button"} onClick={() => dispatch(updateUserPattern(props.id))}></div>
    )
 
})
 
export default Button;