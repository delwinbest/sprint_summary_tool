import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import React from "react";
import ReactDOM from "react-dom";

import App from "./App";
import reportWebVitals from "./reportWebVitals";

import { createStore, applyMiddleware, compose, combineReducers } from "redux";
import { persistStore, persistReducer } from "redux-persist";
import autoMergeLevel2 from "redux-persist/lib/stateReconciler/autoMergeLevel2";
import PouchDBStorage from "redux-persist-pouchdb";

import { Provider } from "react-redux";
import thunk from "redux-thunk";

import teamReducer from "./store/reducers/team";
import sprintsReducer from "./store/reducers/sprints";
import projectsReducer from "./store/reducers/projects";
import { PersistGate } from "redux-persist/integration/react";

const composeEnhancers =
  process.env.NODE_ENV === "development"
    ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
        trace: true,
        traceLimit: 50,
        latency: 0,
      })
    : null || compose;

const storage = new PouchDBStorage(
  "http://" + process.env.REACT_APP_COUCHDB_HOSTNAME + ":5984/smt_db",
  {
    auth: {
      username: process.env.REACT_APP_COUCHDB_USER,
      password: process.env.REACT_APP_COUCHDB_PASSWORD,
    },
  }
);

const rootReducer = combineReducers({
  team: teamReducer,
  sprints: sprintsReducer,
  projects: projectsReducer,
});

const persistConfig = {
  key: "root",
  storage,
  stateReconciler: autoMergeLevel2,
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = createStore(
  persistedReducer,
  composeEnhancers(applyMiddleware(thunk))
);

const persistor = persistStore(store);

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        <App />
      </PersistGate>
    </Provider>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
