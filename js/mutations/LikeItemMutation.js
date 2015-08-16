export default class LikeItemMutation extends Relay.Mutation {

  static fragments = {
    item: () => Relay.QL`
      fragment on Item {
        id,
        likes
      }
    `
  }

  getMutation() {
    return Relay.QL`
      mutation {
        likeItem
      }
    `;
  }

  getCollisionKey() {
    return `check_${this.props.item.id}`;
  }

  getFatQuery() {
    return Relay.QL`
      fragment on LikeItemPayload {
        item {
          likes
        }
      }
    `;
  }

  getConfigs() {
    return [{
      type: 'FIELDS_CHANGE',
      fieldIDs: {
        item: this.props.item.id
      }
    }];
  }

  getVariables() {
    return {
      id: this.props.item.id
    };
  }

  getOptimisticResponse() {
    return {
      item: {
        id: this.props.item.id,
        likes: this.props.item.likes + 1
      }
    };
  }

}
