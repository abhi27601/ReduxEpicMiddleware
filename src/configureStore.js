import { createStore, combineReducers, applyMiddleware,compose } from 'redux';
import { appReducer } from './reducers/appReducer';

import {combineEpics, createEpicMiddleware } from 'redux-observable'
import {of} from "rxjs";
import {delay} from "rxjs/operators"
import { fetchBeersEpic,fetchBeersEpicRandom } from "./epics/fetchBeers";
import { persistEpic,hydrateEpic } from "./epics/persist";
import {beersReducer} from  "./reducers/beersReducer"
import {configReducer} from  "./reducers/configReducer"
//const epic1 = () => of({type:"SET_NAME" , payload:"Sally"}).pipe(delay(2000))
import {ajax} from 'rxjs/ajax';
export function configureStore(dependencies = {}) {
  const rootEpic = combineEpics(fetchBeersEpic,fetchBeersEpicRandom,persistEpic,hydrateEpic)

    const epicMiddleware = createEpicMiddleware({
      dependencies:{
        getJSON:ajax.getJSON,
        document:document,
        ...dependencies
      }
    });

  const rootReducer = combineReducers({
    app: appReducer,
    beers:beersReducer,
    config:configReducer
  });
  const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
  const store = createStore(rootReducer,composeEnhancers(applyMiddleware(epicMiddleware)));

  epicMiddleware.run(rootEpic);
  return store;
}
