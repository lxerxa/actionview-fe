import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import _ from 'lodash';
import { notify } from 'react-notify-toast';

import * as DocumentActions from 'redux/actions/DocumentActions';

const qs = require('qs');
const Header = require('./Header');
const List = require('./List');
const Grids = require('./Grids');
const DirectoryTree = require('./DirectoryTree');

const testdata = {
  name: 'root',
  toggled: true,
  children: [
    {
      name: '根目录',
      active: true,
      children: [
        { name: 'child1' },
        { name: 'child2' }
      ]
    },
    {
      name: '测试目录一',
      loading: true,
      children: []
    },
    {
      name: '会议纪要',
      children: [
        {
          name: '各种配置',
          children: [
            { name: 'nested child 1' },
            { name: 'nested child 2' }
          ]
        }
      ]
    }
  ]
};

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(DocumentActions, dispatch)
  };
}

@connect(({ i18n, session, project, document }) => ({ i18n, session, project, document }), mapDispatchToProps)
export default class Container extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      createFolderShow: false 
    };

    this.state.mode = window.localStorage && window.localStorage.getItem('document-display-mode') || 'list';

    this.pid = '';
    this.directory = '0';
  }

  static contextTypes = {
    router: PropTypes.object.isRequired
  }

  static propTypes = {
    actions: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
    params: PropTypes.object.isRequired,
    i18n: PropTypes.object.isRequired,
    session: PropTypes.object.isRequired,
    project: PropTypes.object.isRequired,
    document: PropTypes.object.isRequired
  }

  refresh(query) {
    const pathname = '/project/' + this.pid + '/document' + (this.directory != '0' ? ('/' + this.directory) : '');
    this.context.router.push({ pathname, query });
  }

  async index(query) {
    this.setState({ createFolderShow: false });
    await this.props.actions.index(this.pid, this.directory || '0', qs.stringify(query || {}));
    return this.props.document.ecode;
  }

  changeMode() {
    const newMode = this.state.mode == 'list' ? 'grids' : 'list';

    if (window.localStorage) {
      window.localStorage.setItem('document-display-mode', newMode);
    }

    this.setState({ mode: newMode });
  }

  async createFolder(values) {
    await this.props.actions.createFolder(this.pid, { ...values, parent: this.directory });
    return this.props.document.ecode;
  }

  showCreateFolder() {
    this.setState({ createFolderShow: true });
  }

  cancelCreateFolder() {
    this.setState({ createFolderShow: false });
  }

  async update(id, values) {
    await this.props.actions.update(this.pid, id, values);
    return this.props.document.ecode;
  }

  async copy(values) {
    await this.props.actions.copy(this.pid, values);
    return this.props.document.ecode;
  }

  async move(values) {
    await this.props.actions.move(this.pid, values);
    return this.props.document.ecode;
  }

  async del(id) {
    const { actions } = this.props;
    await actions.del(this.pid, id);
    return this.props.document.ecode;
  }

  componentWillMount() {
    const { params: { key, id } } = this.props;
    this.props.actions.getOptions(key);
    this.pid = key;
    this.directory = id || '0';
  }

  componentWillReceiveProps(nextProps) {
    const { params: { id } } = nextProps;
    if (!_.isEqual(this.directory, id)) {
      this.directory = id || '0';
    }
  }

  render() {
    if (this.props.project.options) {
      _.assign(this.props.document.options, this.props.project.options);
    }

    const { i18n, location: { query={} } } = this.props;

    return (
      <div>
        <div style={ { position: 'absolute', width: '250px', borderRight: '1px solid #dedede', height: 'calc(100% - 50px)', overflow: 'scroll', marginLeft: '-5px' } }>
          <DirectoryTree data={ testdata }/>
        </div>
        <div style={ { marginLeft: '260px' } }>
          <Header
            user={ this.props.session.user }
            project_key={ this.pid }
            directory={ this.directory }
            index={ this.index.bind(this) }
            refresh={ this.refresh.bind(this) }
            mode={ this.state.mode }
            changeMode={ this.changeMode.bind(this) }
            showCreateFolder={ this.showCreateFolder.bind(this) }
            sort={ this.props.actions.sort }
            query={ query }
            { ...this.props.document }/>
          { this.state.mode == 'grids' ?
          <Grids
            user={ this.props.session.user }
            project_key={ this.pid }
            directory={ this.directory }
            index={ this.index.bind(this) } 
            refresh={ this.refresh.bind(this) } 
            createFolderShow={ this.state.createFolderShow } 
            cancelCreateFolder={ this.cancelCreateFolder.bind(this) }
            createFolder={ this.createFolder.bind(this) } 
            select={ this.props.actions.select } 
            addFile={ this.props.actions.addFile } 
            update={ this.update.bind(this) } 
            copy={ this.copy.bind(this) } 
            move={ this.move.bind(this) } 
            del={ this.del.bind(this) } 
            query={ query }
            i18n={ i18n }
            { ...this.props.document }/>
            :
          <List
            user={ this.props.session.user }
            project_key={ this.pid }
            directory={ this.directory }
            index={ this.index.bind(this) }
            refresh={ this.refresh.bind(this) }
            createFolderShow={ this.state.createFolderShow }
            cancelCreateFolder={ this.cancelCreateFolder.bind(this) }
            createFolder={ this.createFolder.bind(this) }
            select={ this.props.actions.select }
            addFile={ this.props.actions.addFile }
            update={ this.update.bind(this) }
            copy={ this.copy.bind(this) }
            move={ this.move.bind(this) }
            del={ this.del.bind(this) }
            query={ query }
            i18n={ i18n }
            { ...this.props.document }/> }
        </div>
      </div>
    );
  }
}
