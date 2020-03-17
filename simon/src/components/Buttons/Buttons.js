import React, {useContext} from 'react';
import Button from '../../Button';
import AppContext from '../../context/app-context'

// Just a presentational component which contains the buttons
const Buttons = React.memo(() => {
    const {colors, sounds, handleInput} = useContext(AppContext);
    return (
        <div>
            <div>
                {colors.slice(0,2).map(color => {
                    return(
                        <Button id={color} key={color} sound={sounds[color]} handleInput={handleInput}/>
                    )
                })}
            </div>
            <div>
                {colors.slice(2,4).map(color => {
                    return(
                        <Button id={color} key={color} sound={sounds[color]} handleInput={handleInput}/>
                    )
                })}
            </div>
        </div>
    )
})

export default Buttons;