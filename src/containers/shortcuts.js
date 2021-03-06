import { Component, PropTypes, cloneElement } from 'react';
import { connect } from 'react-redux';

import { addShortcuts, removeShortcuts } from '../actions/shortcuts';


class Shortcuts extends Component {

  static propTypes = {
    dispatch: PropTypes.func.isRequired,

    children: PropTypes.element.isRequired,
    items: PropTypes.array.isRequired,

    onShortcut: PropTypes.func,
  };

  componentWillUnmount () {
    if (this.focused) this.props.dispatch(removeShortcuts(this.props.items));
    this.focused = false;
  }

  handleFocus () {
    this.focused = true;
    this.props.dispatch(addShortcuts(this.props.items));
  }

  handleBlur () {
    this.focused = false;
    this.props.dispatch(removeShortcuts(this.props.items));
  }

  handleKeypress (ch, info) {
    const shortcut = this.props.items.find(item => item.key === info.full);
    if (!shortcut) return false;

    if (shortcut.handler) return shortcut.handler(shortcut);
    if (this.props.onShortcut) return this.props.onShortcut(shortcut);
  }

  render () {
    return cloneElement(this.props.children, {
      onFocus: ::this.handleFocus,
      onBlur: ::this.handleBlur,
      onKeypress: ::this.handleKeypress,
    });
  }

}


export default connect()(Shortcuts);
