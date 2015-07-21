export default {
  loadTodos() {
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
