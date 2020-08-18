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

    this.state.directoryShow = window.localStorage && window.localStorage.getItem('document-directory-show') === 'N' ? false : true;
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

  goto(directory) {
    const pathname = '/project/' + this.pid + '/document' + (directory != '0' ? ('/' + directory) : '');
    this.context.router.push({ pathname });
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

  toggleDirectory() {
    if (window.localStorage) {
      window.localStorage.setItem('document-directory-show', this.state.directoryShow ? 'N' : 'Y');
    }

    this.setState({ directoryShow: !this.state.directoryShow });
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

  async getDirTree() {
    const { actions } = this.props;
    await actions.getDirTree(this.pid, this.directory);
    return this.props.document.ecode;
  }

  async getDirChildren(dir) {
    const { actions } = this.props;
    await actions.getDirChildren(this.pid, dir);
    return this.props.document.ecode;
  }

  async favorite(id, flag) {
    await this.props.actions.favorite(this.pid, id, flag);
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
        <div className='directory-bar' style={ { display: !this.state.directoryShow ? 'none': '' } }>
          <DirectoryTree 
            directory={ this.directory }
            goto={ this.goto.bind(this) }
            childrenLoading={ this.props.document.childLoading }
            treeLoading={ this.props.document.treeLoading }
            data={ this.props.document.tree }
            getDirTree={ this.getDirTree.bind(this) }
            getDirChildren={ this.getDirChildren.bind(this) }/>
        </div>
        <div style={ { marginLeft: this.state.directoryShow ? '260px' : '0px' } }>
          <Header
            user={ this.props.session.user }
            project_key={ this.pid }
            directory={ this.directory }
            index={ this.index.bind(this) }
            refresh={ this.refresh.bind(this) }
            mode={ this.state.mode }
            changeMode={ this.changeMode.bind(this) }
            showCreateFolder={ this.showCreateFolder.bind(this) }
            directoryShow={ this.state.directoryShow }
            toggleDirectory={ this.toggleDirectory.bind(this) }
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
            favorite={ this.favorite.bind(this) }
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
            favorite={ this.favorite.bind(this) }
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
