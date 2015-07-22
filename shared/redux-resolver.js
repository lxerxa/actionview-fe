class ReduxResolver {

  pendingActions = []

  resolve = ::this.resolve
  resolve(action) {
    if (process.env.BROWSER) return action();

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
