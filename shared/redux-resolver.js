class ReduxResolver {

  firstRender = false
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

  async dispatchPendingActions() {
    for (const { action, args } of this.pendingActions) {
      await action(...args);
    }
  }
}

export default ReduxResolver;
