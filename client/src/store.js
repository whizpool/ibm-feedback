import { createStore, applyMiddleware } from "redux"
import rootReducer from './rootReducer'
import thunk from 'redux-thunk'
import {loadState, saveState} from './storage'


const store = createStore(rootReducer,loadState(),applyMiddleware(thunk));
store.subscribe(() => {
  saveState(store.getState())
})


export default store