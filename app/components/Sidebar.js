import React, { PropTypes, Component } from 'react';
import TreeView from 'treeview-react-bootstrap';
import ProjectModal from './ProjectModal';
import IssueModal from './IssueModal';

export default class Sidebar extends Component {
  constructor(props) {
    super(props);
    this.state = { projctModalShow: false, issueModalShow: false };
    this.projectModalClose = this.projectModalClose.bind(this);
    this.issueModalClose = this.issueModalClose.bind(this);
  }

  static propTypes = {
    indexImg: PropTypes.any.isRequired,
    project: PropTypes.object.isRequired,
    createIssue: PropTypes.func,
    createProject: PropTypes.func
  }

  projectModalClose() {
    this.setState({ projectModalShow: false });
  }

  issueModalClose() {
    this.setState({ issueModalShow: false });
  }

  render() {
    const { indexImg, project, createProject, createIssue } = this.props;
    const styles = { backgroundImage: 'url(' + indexImg + ')' };
    const styles2 = { position: 'absolute', top: '0px', paddingLeft: '30px', color: 'white' };
    const styles3 = { position: 'relative', top: '60px', width: '200px', fontSize: '18px', marginLeft: '20px' };

    const data = [
      {
        text: '项目概述',
        nodes: [
          {
            text: '问题',
            href: '#a'
          },
          {
            text: '模块',
            href: '#b'
          }
        ]
      },
      {
        text: '项目配置',
        nodes: [
          {
            text: '字段',
            href: '#a'
          },
          {
            text: '项目类型',
            href: '#a'
          }
        ]
      }
    ];

    return (
      <div className='col-sm-3 sidebar-box'>
        <div className='cover-img' style={ styles }></div>
        <div style={ styles2 }>
          <h3>社交化项目管理系统</h3>
        </div>
        <div style={ styles3 }>
          <TreeView data={ data } enableLinks={ 'true' } highlightSelected={ false } nodeIcon={ '' } backColor = { 'rgba(0, 0, 0, 0)' } color={ 'white' } showBorder= { false }/>
        </div>
        <div className='bottom-block'>
          <h3>有朋自远方来</h3>
          <h3>不亦乐乎</h3>
          { project.item.id ?
            <button className='btn btn-primary btn-lg btn-block' onClick={ () => this.setState({ issueModalShow: true }) }>创建问题</button>
            :
            <button className='btn btn-primary btn-lg btn-block' onClick={ () => this.setState({ projectModalShow: true }) }>创建项目</button>
          }
        </div>
        { project.item.id ?
          <IssueModal show={ this.state.issueModalShow } hide={ this.issueModalClose } create={ createIssue }/>
          :
          <ProjectModal show={ this.state.projectModalShow } hide={ this.projectModalClose } create={ createProject }/>
        }
      </div>
    );
  }
}
