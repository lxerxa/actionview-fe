class ReduxResolver {

  firstRender = true
  pendingActions = []

  resolve = ::this.resolve
  resolve(action) {
    if (process.env.BROWSER && !this.firstRender) return action();

    this.pendingActions = [
      ...this.pendingActions,
      action
    ];
  }

  mapActions() {
    return this.pendingActions
      .map(action => action());
  }

  async dispatchPendingActions() {
    const promises = this.mapActions();
    await Promise.all(promises);
  }

}

export default ReduxResolver;
