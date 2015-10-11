import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { fetchTablesIfNeeded } from '../actions/db';
import { setStatus } from '../actions/status';

import Shortcuts from './shortcuts';
import TableList from '../widgets/table-list';
import QueryArea from '../widgets/query-area';
import QueryResults from '../widgets/query-results';


class Database extends Component {

  static propTypes = {
    dispatch: PropTypes.func.isRequired,

    isFetching: PropTypes.bool.isRequired,
    items: PropTypes.array.isRequired,
    error: PropTypes.any,
  };

  componentWillMount () {
    this.props.dispatch(fetchTablesIfNeeded());
    this.handleEvents(this.props);
  }

  componentDidMount () {
    this.refs.queryArea.focus();
  }

  componentWillReceiveProps (nextProps) {
    this.handleEvents(nextProps);
  }

  handleEvents ({ isFetching, error }) {
    const { dispatch } = this.props;

    if (error) return dispatch(setStatus(error));
    if (isFetching) return dispatch(setStatus('Loading list of tables...'));
    dispatch(setStatus('List of tables loaded'));
  }

  handleExecuteQuery (query) {
    console.error('execute query', query);
  }

  render () {
    const { items } = this.props;

    const tableListShortcuts = [ { key: 'Enter', label: 'Select' } ];
    const queryAreaShortcuts = [
      { key: 'C-c', label: 'Clear' },
      { key: 'C-x', label: 'Execute' },
    ];
    const queryResultsShortcuts = [ { key: 'F', label: 'Fullscreen' } ];

    return (
      <box top={1} left={1} bottom={2} right={3} shadow="true">
        <box left={0} top={0} bottom={0} width={30}>
          <Shortcuts items={tableListShortcuts}>
            <TableList ref="tableList" items={items} />
          </Shortcuts>
        </box>
        <box left={30} top={0} right={0} height={5}>
          <Shortcuts items={queryAreaShortcuts}>
            <QueryArea ref="queryArea" onExecute={::this.handleExecuteQuery} />
          </Shortcuts>
        </box>
        <box left={30} top={5} bottom={0} right={0}>
          <Shortcuts items={queryResultsShortcuts}>
            <QueryResults ref="queryResults" />
          </Shortcuts>
        </box>
      </box>
    );
  }

}


function mapStateToProps (state) {
  return state.tables;
}

export default connect(mapStateToProps)(Database);
