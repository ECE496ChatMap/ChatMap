import React, { Component } from 'react';
import { connect } from 'react-redux';
import { addNavigationHelpers } from 'react-navigation';
import Navigation from './navigation';

class appNavigation extends Component {
  render() {
    const { navState, dispatch } = this.props;

    return (
      <Navigation
        navigation={addNavigationHelpers({ dispatch, state: navState })}
      />
    );
  }
}

const mapStateToProps = state => {
  return {
    navState: state.navigationReducer
  };
};

export default connect(mapStateToProps)(appNavigation);
