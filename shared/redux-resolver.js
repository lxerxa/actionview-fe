class ReduxResolver {

  firstRender = true
  pendingActions = []

  resolve = ::this.resolve
  resolve(action) {
    const [, ...args] = arguments;
    if (process.env.BROWSER && !this.firstRender) return action(...args);

    this.pendingActions = [
      ...this.pendingActions,
      { action, args }
    ];
  }

  mapActions() {
    return this.pendingActions
      .map(({ action, args }) => action(...args));
  }

  async dispatchPendingActions() {
    const promises = this.mapActions();
    await Promise.all(promises);
  }

}

export default ReduxResolver;
