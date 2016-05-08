import React, { PropTypes, Component } from 'react';
// import { Link } from 'react-router';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';

import * as TypeActions from 'redux/actions/TypeActions';

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(TypeActions, dispatch)
  };
}

@connect(({ type }) => ({ type }), mapDispatchToProps)
export default class TypeList extends Component {
  static propTypes = {
    actions: PropTypes.object.isRequired,
    params: PropTypes.object.isRequired,
    type: PropTypes.object.isRequired
  }

  componentWillMount() {
    const { actions } = this.props;
    const { params: { key } } = this.props;
    actions.index(key);
  }

  render() {
    const { collection } = this.props.type;

    const types = [];
    const typeNum = collection.length;
    for (let i = 0; i < typeNum; i++) {
      types.push({
        name: collection[i].name,
        screen: collection[i].screen.name,
        workflow: collection[i].workflow.name,
        operation: ( <div><span>edit</span></div> )
      });
    }

    return (
      <div>
        <div className='list-unstyled clearfix'>
          <h2>#项目类型#</h2>
        </div>
        <BootstrapTable data={ types } bordered={ false }>
          <TableHeaderColumn dataField='name' isKey>名称</TableHeaderColumn>
          <TableHeaderColumn dataField='screen'>界面</TableHeaderColumn>
          <TableHeaderColumn dataField='workflow'>工作流</TableHeaderColumn>
          <TableHeaderColumn dataField='operation'>操作</TableHeaderColumn>
        </BootstrapTable>
      </div>
    );
  }
}
