import React from 'react';
import { render } from 'react-dom';
import App from './App';
import * as serviceWorker from './serviceWorker';

import thunk from 'redux-thunk';
import { Provider } from 'react-redux';
import { createStore, combineReducers, compose, applyMiddleware } from 'redux';

import appReducer from './store/reducer';

export const composeEnhancers: any = process.env.NODE_ENV === 'development' 
    ? (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose : compose;

export const rootReducer = combineReducers({
    app: appReducer
});
export type AppState = ReturnType<typeof rootReducer>;
export const store = createStore(rootReducer, composeEnhancers(applyMiddleware(thunk)));

export const application: JSX.Element = (
    <Provider store={store}>
        <App />
    </Provider>
);

render(application, document.getElementById("root"));
serviceWorker.unregister();