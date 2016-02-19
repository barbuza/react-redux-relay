import shallowCompare from 'react/lib/shallowCompare';
import * as React from 'react';

function getConnectName(cls) {
  const displayName = (cls.displayName || cls.name || 'Component');
  return `Connect(${displayName})`;
}

export function connect(getState) {
  return function (cls) {

    class Connect extends React.Component {

      static displayName = getConnectName(cls)

      static contextTypes = {
        store: React.PropTypes.object
      }

      constructor(props, context) {
        super(props, context);
        this.state = getState(context.store.getState());
      }

      componentDidMount() {
        this.unsubscribe = this.context.store.subscribe(::this.refresh);
      }

      componentWillUnmount() {
        if (this.unsubscribe) {
          this.unsubscribe();
        }
      }

      shouldComponentUpdate(nextProps, nextState) {
        return shallowCompare(this, nextProps, nextState);
      }

      refresh() {
        this.setState(getState(this.context.store.getState()));
      }

      render() {
        return React.createElement(cls, {
          dispatch: this.context.store.dispatch,
          ...this.props,
          ...this.state
        });
      }
    }

    return Connect;
  };
}


export class Provider extends React.Component {

  static childContextTypes = {
    store: React.PropTypes.object
  }

  getChildContext() {
    return {
      store: this.props.store
    };
  }

  render() {
    return this.props.children;
  }

}
