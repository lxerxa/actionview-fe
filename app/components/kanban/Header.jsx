import React, { PropTypes, Component } from 'react';
import { Button, DropdownButton, MenuItem, Nav, NavItem } from 'react-bootstrap';
import _ from 'lodash';

const img = require('../../assets/images/loading.gif');

export default class Header extends Component {
  constructor(props) {
    super(props);
    this.state = { filter: 'all' };
  }

  componentWillMount() {
    const { getOptions } = this.props;
    getOptions();
  }

  componentWillReceiveProps(nextProps) {
    const { index } = this.props;
    if (this.props.current_kanban.id != nextProps.current_kanban.id) {
      index(nextProps.current_kanban.query);
    }
  }

  static propTypes = {
    current_kanban: PropTypes.object,
    kanbans: PropTypes.array,
    loading: PropTypes.bool,
    goto: PropTypes.func,
    index: PropTypes.func,
    getOptions: PropTypes.func
  }

  changeKanban(eventKey) {
    const { goto } = this.props;
    goto(eventKey);
    this.setState({ filter: 'all' });
  }

  handleSelect(selectedKey) {
    this.setState({ filter: selectedKey });

    const { index, current_kanban } = this.props;
    index(_.extend(_.clone(current_kanban.query), selectedKey !== 'all' ? current_kanban.filters[selectedKey].query || {} : {}));
  }

  render() {
    const { current_kanban, kanbans=[], loading } = this.props;

    return (
      <div style={ { margin: '18px 10px 10px 10px' } }>
        <div style={ { height: '48px' } }>
          <div style={ { display: 'inline-block', fontSize: '19px', marginTop: '5px' } }>
            { loading && <img src={ img } className='loading'/> } 
            { !loading && !_.isEmpty(current_kanban) && current_kanban.name || '' } 
            { !loading && _.isEmpty(current_kanban) && kanbans.length > 0 && '该看板不存在。' } 
            { !loading && _.isEmpty(current_kanban) && kanbans.length <= 0 && '该项目未定义看板。' } 
          </div>
          { kanbans.length > 0 &&
          <div style={ { float: 'right', display: 'inline-block' } }>
            <DropdownButton bsStyle='link' pullRight title='切换' onSelect={ this.changeKanban.bind(this) }>
            { _.map(kanbans, (v) => ( <MenuItem eventKey={ v.id }>{ v.name }</MenuItem> ) ) }
            </DropdownButton>
          </div> }
        </div>

        { !loading && !_.isEmpty(current_kanban) &&
        <div style={ { height: '45px', borderBottom: '2px solid #f5f5f5' } }>
          <span style={ { float: 'left', marginTop: '7px', marginRight: '10px' } }>过滤器：</span>
          <Nav bsStyle='pills' style={ { float: 'left', lineHeight: '1.0' } } activeKey={ this.state.filter } onSelect={ this.handleSelect.bind(this) }>
            <NavItem eventKey='all' href='#'>全部</NavItem>
            { _.map(current_kanban.filters || [], (v, i) => (<NavItem eventKey={ i } href='#'>{ v.name }</NavItem>) ) }
          </Nav>
        </div> }
      </div>
    );
  }
}
