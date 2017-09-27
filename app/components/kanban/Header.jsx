import React, { PropTypes, Component } from 'react';
import { Button, DropdownButton, MenuItem } from 'react-bootstrap';
import _ from 'lodash';

const img = require('../../assets/images/loading.gif');

export default class Header extends Component {
  constructor(props) {
    super(props);
  }

  async componentWillMount() {
    const { getOptions } = this.props;
    getOptions();
  }

  static propTypes = {
    current_kanban: PropTypes.object,
    kanbans: PropTypes.array,
    loading: PropTypes.bool,
    goto: PropTypes.func,
    getOptions: PropTypes.func
  }

  changeKanban(eventKey) {
    const { goto } = this.props;
    goto(eventKey);
  }

  render() {
    const { current_kanban, kanbans=[], loading } = this.props;

    return (
      <div>
        <div style={ { display: 'inline-block', marginTop: '15px', fontSize: '19px' } }>
          { loading && <img src={ img } className='loading'/> } 
          { !loading && !_.isEmpty(current_kanban) && current_kanban.name || '' } 
          { !loading && _.isEmpty(current_kanban) && kanbans.length > 0 && '该看板不存在。' } 
          { !loading && _.isEmpty(current_kanban) && kanbans.length <= 0 && '该项目未定义看板。' } 
        </div>
        { kanbans.length > 0 &&
        <div style={ { float: 'right', display: 'inline-block', marginTop: '15px' } }>
          <DropdownButton pullRight title='看板列表' onSelect={ this.changeKanban.bind(this) }>
          { _.map(kanbans, (v) => ( <MenuItem eventKey={ v.id }>{ v.name }</MenuItem> ) ) }
          </DropdownButton>
        </div> }
      </div>
    );
  }
}
