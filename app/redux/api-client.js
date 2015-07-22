export default {
  loadTodos() {
    return new Promise((resolve) => {
      setTimeout(() => {
        return resolve([
          {id: 1, text: 'foo'},
          {id: 2, text: 'bar'}
        ]);
      }, 300);
    });
  },

  addTodo(text) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (!text) return reject({message: 'no content sent'});
        return resolve(text);
      }, 300);
    });
  },

  loadUsers() {
    return new Promise((resolve) => {
      setTimeout(() => {
        return resolve([
          {id: 1, name: 'userfoo'},
          {id: 2, name: 'userbar'}
        ]);
      }, 300);
    });
  }
};
