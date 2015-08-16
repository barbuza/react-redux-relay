export default class extends Relay.Route {
  static path = '/';
  static queries = {
    page: (Component) => Relay.QL`
      query {
        home {
          ${Component.getFragment('page')}
        }
      }
    `
  };
  static routeName = 'AppHomeRoute';
}
