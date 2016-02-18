import App from './components/App';
import AppHomeRoute from './routes/AppHomeRoute';
import {createStore, combineReducers} from 'redux';
import {Provider} from './redux-compat';
import * as store from './store';
import * as React from 'react';
import * as Relay from 'react-relay';
import * as ReactDOM from 'react-dom';

const redux = createStore(combineReducers(store));


ReactDOM.render(
  <Provider store={redux}>
      <Relay.RootContainer Component={App} route={new AppHomeRoute()}/>
  </Provider>,
  document.getElementById('root')
);
