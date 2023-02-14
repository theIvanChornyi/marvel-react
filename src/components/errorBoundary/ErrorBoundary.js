import { Component } from 'react';
import PropTypes from 'prop-types';

import Error from '../error/Error';

class ErrorBoundary extends Component {
  state = { error: false };
  componentDidCatch(error, errorInfo) {
    console.log(error);
    console.log(errorInfo);
    this.setState({ error: true });
  }
  render() {
    if (this.state.error) return <Error />;
    return this.props.children;
  }
}
ErrorBoundary.propTypes = {
  children: PropTypes.node,
};
export default ErrorBoundary;
