import { createStore, applyMiddleware, compose } from 'redux';
import simonReducer from '../reducers/reducer'
import thunk from 'redux-thunk';

const composeEnhancer = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

export default () => {
        const store = createStore(
        simonReducer,
        composeEnhancer(applyMiddleware(thunk)),
        );

    return store;
}