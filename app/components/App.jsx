import React, { Component } from 'react';
import { DevTools, DebugPanel, LogMonitor } from 'redux-devtools/lib/react';
import { Provider } from 'react-redux';

import TodoApp from './TodoApp';
import createStore from '../redux/create';

const client = {
  loadTodo() {
    return new Promise((resolve) => {
      setTimeout(() => {
        return resolve([
          {id: 1, text: 'foo'},
          {id: 2, text: 'bar'}
        ]);
      }, 1000);
    });
  },

  addTodo(text) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (!text) return reject({message: 'no content sent'});
        return resolve(text);
      }, 1000);
    });
  }
};

const store = createStore(client, {});

class App extends Component {

  render() {
    return (
      <div>
        <Provider store={store}>
          {() => <TodoApp />}
        </Provider>
        <DebugPanel top right bottom>
          <DevTools
            store={store}
            monitor={LogMonitor} />
        </DebugPanel>
      </div>
    );
  }

}

export default App;
