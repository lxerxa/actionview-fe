import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { withRouter } from 'react-router';
import { Button, Panel } from 'react-bootstrap';
import _ from 'lodash';
import { notify } from 'react-notify-toast';

import * as WikiActions from 'redux/actions/WikiActions';

const qs = require('qs');
const Create = require('./Create');
const Edit = require('./Edit');
const List = require('./List');
const Preview = require('./Preview');
const DirectoryTree = require('./DirectoryTree');

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(WikiActions, dispatch)
  };
}

@withRouter
@connect(({ i18n, session, project, wiki }) => ({ i18n, session, project, wiki }), mapDispatchToProps)
export default class Container extends Component {
  constructor(props) {
    super(props);
    this.pid = '';
    this.directory = 'root';
    this.wid = '';
    this.mode = '';
    this.routerNotifyFlg = false;
    this.routerWillLeave = this.routerWillLeave.bind(this);

    this.state = {};
    this.state.directoryShow = window.localStorage && window.localStorage.getItem('wiki-directory-show') === 'N' ? false : true;
  }

  static contextTypes = {
    router: PropTypes.object.isRequired
  }

  static propTypes = {
    actions: PropTypes.object.isRequired,
    route: PropTypes.object.isRequired,
    router: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
    params: PropTypes.object.isRequired,
    i18n: PropTypes.object.isRequired,
    session: PropTypes.object.isRequired,
    project: PropTypes.object.isRequired,
    wiki: PropTypes.object.isRequired
  }

  goto2(directory, wid) {

    let uri = '/project/' + this.pid + '/wiki';
    uri += (directory != '0' ? ('/' + directory) : (wid ? '/root' : ''));

    if (wid) {
      uri += ('/' + wid);
    }

    this.context.router.push({ pathname: uri });
  }

  goto(mode, wid, query={}) {
    let uri = '/project/' + this.pid + '/wiki';
    if (mode === 'list') {
      uri += (this.directory != 'root' ? ('/' + this.directory) : '');
    } else {
      uri +=  '/' + this.directory;
    }

    if (mode === 'new') {
      uri += '/new'; 
    } else if (mode === 'edit') {
      uri += '/' + wid + '/edit'; 
    } else if (mode === 'preview') {
      uri += '/' + wid; 
    }
    
    this.context.router.push({ pathname: uri, query });
  }

  reload(query) {
    const pathname = '/project/' + this.pid + '/wiki' + (this.directory != 'root' ? ('/' + this.directory) : '');
    this.context.router.push({ pathname, query });
  }

  async show(id, version) {
    await this.props.actions.show(this.pid, id, version);
    return this.props.wiki.ecode;
  }

  async index(query) {
    await this.props.actions.index(this.pid, this.directory == 'root' ? '0' : this.directory, qs.stringify(query || {}));
    return this.props.wiki.ecode;
  }

  async create(values) {
    await this.props.actions.create(this.pid, { ...values, parent: this.directory == 'root' ? '0' : this.directory });
    return this.props.wiki.ecode;
  }

  async update(id, values) {
    await this.props.actions.update(this.pid, id, values);
    return this.props.wiki.ecode;
  }

  async show(wid, v) {
    await this.props.actions.show(this.pid, wid, v);
    return this.props.wiki.ecode;
  }

  async checkin(wid) {
    await this.props.actions.checkin(this.pid, wid);
    return this.props.wiki.ecode;
  }

  async checkout(wid) {
    await this.props.actions.checkout(this.pid, wid);
    return this.props.wiki.ecode;
  }

  async copy(values, toCurPath) {
    await this.props.actions.copy(this.pid, values, toCurPath);
    return this.props.wiki.ecode;
  }

  async move(values) {
    await this.props.actions.move(this.pid, values);
    return this.props.wiki.ecode;
  }

  async del(id) {
    const { actions } = this.props;
    await actions.del(this.pid, id);
    return this.props.wiki.ecode;
  }

  async delFile(wid, fid) {
    const { actions } = this.props;
    await actions.delFile(this.pid, wid, fid);
    return this.props.wiki.ecode;
  }

  async getDirTree() {
    const { actions } = this.props;
    await actions.getDirTree(this.pid, this.wid || this.directory || '0');
    return this.props.wiki.ecode;
  }

  async getDirChildren(dir) {
    const { actions } = this.props;
    await actions.getDirChildren(this.pid, dir);
    return this.props.wiki.ecode;
  }

  toggleDirectory() {
    if (window.localStorage) {
      window.localStorage.setItem('wiki-directory-show', this.state.directoryShow ? 'N' : 'Y');
    }

    this.setState({ directoryShow: !this.state.directoryShow });
  }

  async favorite(id, flag) {
    await this.props.actions.favorite(this.pid, id, flag);
    return this.props.wiki.ecode;
  }

  componentWillMount() {
    const { params: { key, dir, wid, mode } } = this.props;
    this.pid = key;
    this.directory = dir || 'root';
    this.wid = wid || '';
    if (mode) {
      this.mode = mode;
    } else {
      if (wid) {
        this.mode = wid == 'new' ? 'new' : 'preview';
      } else {
        this.mode = 'list';
      }
    }
  }

  componentWillReceiveProps(nextProps) {
    const { params: { dir, wid, mode } } = nextProps;
    this.directory = dir || 'root';
    this.wid = wid || '';
    if (mode) {
      this.mode = mode;
    } else {
      if (wid) {
        this.mode = wid == 'new' ? 'new' : 'preview';
      } else {
        this.mode = 'list';
      }
    }
  }

  componentDidMount() {
    this.props.router.setRouteLeaveHook(this.props.route, this.routerWillLeave)
  }

  routerWillLeave(nextLocation) {
    if (this.mode !== 'new' && this.mode !== 'edit') {
      return true;
    }

    if (this.routerNotifyFlg) {
      if (confirm('您修改的内容还未保存，确认离开此页面？')) {
        return true;
      } else {
        return false;
      }
    }
  }

  render() {
    if (this.props.project.options) {
      _.assign(this.props.wiki.options, this.props.project.options);
    }

    const { i18n, location: { query={} } } = this.props;

    let contents = null;
    if (this.mode == 'preview') {
      contents = (<Preview
        i18n={ i18n }
        project={ this.props.project.item }
        goto={ this.goto.bind(this) }
        wid={ this.wid }
        favorite={ this.favorite.bind(this) }
        update={ this.update.bind(this) }
        show={ this.show.bind(this) }
        checkin={ this.checkin.bind(this) }
        checkout={ this.checkout.bind(this) }
        del={ this.del.bind(this) }
        delFile={ this.delFile.bind(this) }
        addAttachment={ this.props.actions.addAttachment }
        reload={ this.reload.bind(this) }
        directoryShow={ this.state.directoryShow }
        toggleDirectory={ this.toggleDirectory.bind(this) }
        user={ this.props.session.user }
        { ...this.props.wiki }/>);
    } else if (this.mode == 'list') {
      contents = (<List
        project={ this.props.project.item }
        directory={ this.directory == 'root' ? '0' : this.directory }
        index={ this.index.bind(this) }
        reload={ this.reload.bind(this) }
        goto={ this.goto.bind(this) }
        favorite={ this.favorite.bind(this) }
        create={ this.create.bind(this) }
        show={ this.show.bind(this) }
        select={ this.props.actions.select }
        sort={ this.props.actions.sort }
        checkin={ this.checkin.bind(this) }
        checkout={ this.checkout.bind(this) }
        copy={ this.copy.bind(this) }
        move={ this.move.bind(this) }
        update={ this.update.bind(this) }
        del={ this.del.bind(this) }
        query={ query }
        directoryShow={ this.state.directoryShow }
        toggleDirectory={ this.toggleDirectory.bind(this) }
        user={ this.props.session.user }
        i18n={ i18n }
        { ...this.props.wiki }/>); 
    } else if (this.mode == 'new') {
      contents = (<Create
        i18n={ i18n }
        project={ this.props.project.item }
        setRouterNotifyFlg={ (v) => { this.routerNotifyFlg = v; } }
        goto={ this.goto.bind(this) }
        isHome={ query.home }
        path={ this.props.wiki.options.path || [] }
        loading={ this.props.wiki.loading }
        create={ this.create.bind(this) }/>);
    } else if (this.mode == 'edit') {
      contents = (<Edit
        i18n={ i18n }
        project={ this.props.project.item }
        setRouterNotifyFlg={ (v) => { this.routerNotifyFlg = v; } }
        goto={ this.goto.bind(this) }
        get={ this.show.bind(this) }
        checkin={ this.checkin.bind(this) }
        path={ this.props.wiki.options.path || [] }
        itemLoading={ this.props.wiki.itemLoading }
        itemDetailLoading={ this.props.wiki.itemDetailLoading }
        loading={ this.props.wiki.loading }
        wid={ this.wid }
        user={ this.props.session.user }
        data={ this.props.wiki.item }
        update={ this.update.bind(this) }/>);
    }

    return (
      <div>
        <div className='directory-bar' style={ { display: !this.state.directoryShow ? 'none': '' } }>
          <DirectoryTree
            directory={ this.directory == 'root' ? '0' : this.directory }
            wid={ this.wid }
            goto={ this.goto2.bind(this) }
            childrenLoading={ this.props.wiki.childrenLoading }
            treeLoading={ this.props.wiki.treeLoading }
            data={ this.props.wiki.tree }
            getDirTree={ this.getDirTree.bind(this) }
            getDirChildren={ this.getDirChildren.bind(this) }/>
        </div>
        <div style={ { marginLeft: this.state.directoryShow ? '260px' : '0px', marginTop: '15px' } }>
          { contents }
        </div>
      </div> );
  }
}
