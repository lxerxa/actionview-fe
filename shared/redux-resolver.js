class ReduxResolver {

  firstRender = true
  pendingActions = []

  resolve(action) {
    const [, ...args] = arguments;
    if (process.env.BROWSER && !this.firstRender) {
      return action(...args);
    } else {
      this.pendingActions = [
        ...this.pendingActions,
        { action, args }
      ];
    }
  }

  mapActions = () => this.pendingActions.map(({ action, args }) => action(...args));
  dispatchPendingActions = async () => await Promise.all(this.mapActions())
}

export default ReduxResolver;
