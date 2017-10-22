import React, { PropTypes, Component } from 'react';
import { Button, DropdownButton, MenuItem, Nav, NavItem } from 'react-bootstrap';
import _ from 'lodash';
 
const CreateModal = require('../issue/CreateModal');

const img = require('../../assets/images/loading.gif');

export default class Header extends Component {
  constructor(props) {
    super(props);
    this.state = { filter: 'all', createModalShow: false };
  }

  componentWillMount() {
    const { getOptions } = this.props;
    getOptions();
  }

  componentWillReceiveProps(nextProps) {
    const { index } = this.props;
    if (this.props.curKanban.id != nextProps.curKanban.id) {
      index(nextProps.curKanban.query);
    }
  }

  static propTypes = {
    i18n: PropTypes.object.isRequired,
    create: PropTypes.func.isRequired,
    project: PropTypes.object,
    curKanban: PropTypes.object,
    kanbans: PropTypes.array,
    loading: PropTypes.bool,
    switchRank: PropTypes.func,
    goto: PropTypes.func,
    index: PropTypes.func,
    options: PropTypes.object,
    getOptions: PropTypes.func
  }

  createModalClose() {
    this.setState({ createModalShow: false });
  }

  changeKanban(eventKey) {
    const { goto, switchRank } = this.props;
    goto(eventKey);
    this.setState({ filter: 'all' });
    switchRank(true);
  }

  handleSelect(selectedKey) {
    this.setState({ filter: selectedKey });

    const { index, curKanban, switchRank } = this.props;
    switchRank(selectedKey === 'all');
    index(_.extend(_.clone(curKanban.query), selectedKey !== 'all' ? curKanban.filters[selectedKey].query || {} : {}));
  }

  render() {
    const { i18n, curKanban, kanbans=[], loading, project, create, options } = this.props;

    return (
      <div style={ { margin: '18px 10px 10px 10px' } }>
        <div style={ { height: '47px' } }>
          <div style={ { display: 'inline-block', fontSize: '19px', marginTop: '5px' } }>
            { loading && <img src={ img } className='loading'/> } 
            { !loading && !_.isEmpty(curKanban) && curKanban.name || '' } 
            { !loading && _.isEmpty(curKanban) && kanbans.length > 0 && '该看板不存在。' } 
            { !loading && _.isEmpty(curKanban) && kanbans.length <= 0 && '该项目未定义看板。' } 
          </div>
          <div style={ { float: 'right', display: 'inline-block' } }>
            { options.permissions && options.permissions.indexOf('create_issue') !== -1 &&
            <Button style={ { marginRight: '10px' } } bsStyle='primary' onClick={ () => { this.setState({ createModalShow: true }); } }><i className='fa fa-plus'></i> 创建问题</Button> }
            { kanbans.length > 0 &&
            <DropdownButton pullRight title='列表' onSelect={ this.changeKanban.bind(this) }>
            { _.map(kanbans, (v, i) => ( <MenuItem key={ i } eventKey={ v.id }>{ v.name }</MenuItem> ) ) }
            </DropdownButton> }
          </div>
        </div>

        { !loading && !_.isEmpty(curKanban) &&
        <div style={ { height: '45px', borderBottom: '2px solid #f5f5f5' } }>
          <span style={ { float: 'left', marginTop: '7px', marginRight: '10px' } }>过滤器：</span>
          <Nav bsStyle='pills' style={ { float: 'left', lineHeight: '1.0' } } activeKey={ this.state.filter } onSelect={ this.handleSelect.bind(this) }>
            <NavItem eventKey='all' href='#'>全部</NavItem>
            { _.map(curKanban.filters || [], (v, i) => (<NavItem key={ i } eventKey={ i } href='#'>{ v.name }</NavItem>) ) }
          </Nav>
        </div> }
        { this.state.createModalShow &&
          <CreateModal
            show
            close={ this.createModalClose.bind(this) }
            options={ options }
            create={ create }
            loading={ loading }
            project={ project }
            i18n={ i18n }/> }
      </div>
    );
  }
}
