import LikeItemMutation from '../mutations/LikeItemMutation';
import { connect } from '../redux-compat';


@connect(state => ({
  count: state.count
}))
class App extends React.Component {

  likeItem(item) {
    Relay.Store.commitUpdate(new LikeItemMutation({item}));
  }

  reduxInc() {
    this.props.dispatch({type: 'inc'});
  }

  render() {
    return (
      <div>
        <h1>redux</h1>
        <div style={{cursor: 'pointer'}} onClick={() => this.reduxInc()}>
          count = {this.props.count}
        </div>
        <h1>relay</h1>
        {this.props.page.items.edges.map(e => e.node).map(item =>
          <div style={{cursor: 'pointer'}} onClick={() => this.likeItem(item)}>
            Item (name = {item.name}, likes = {item.likes})
          </div>
        )}
      </div>
    );
  }
}


export default Relay.createContainer(App, {
  fragments: {
    page: () => Relay.QL`
      fragment on Page {
        items {
          edges {
            node {
              id,
              name,
              likes
              ${LikeItemMutation.getFragment('item')}
            }
          }
        }
      }
    `
  },
});
