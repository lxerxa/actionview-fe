import React, { PropTypes, Component } from 'react';
import { Link } from 'react-router';
import { Button, Label, Table, Panel } from 'react-bootstrap';
import { notify } from 'react-notify-toast';
import _ from 'lodash';

const img = require('../../assets/images/loading.gif');

export default class List extends Component {
  constructor(props) {
    super(props);
  }

  static propTypes = {
    data: PropTypes.object.isRequired,
    options: PropTypes.object.isRequired,
    loading: PropTypes.bool.isRequired,
    index: PropTypes.func.isRequired
  }

  componentWillMount() {
    const { index } = this.props;
    index();
  }

  render() {
    const { data, options, loading } = this.props;

    return (
      <div style={ { marginTop: '15px', marginBottom: '30px' } }>
        <Panel header='一周动态'>
          <Table responsive hover>
            <thead>
              <tr>
                <th>问题类型</th>
                <th>全部</th>
                { _.map(options.types || [], (v) => { return (<th key={ v.id }>{ v.name }</th>) }) }
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>新建问题</td>
                <td><Link to='#'><font color='red'>2</font></Link></td>
                { _.map(options.types || [], (v) => { return (<td key={ v.id }><Link to='#'>{ data.new_issues && data.new_issues[v.id] || 0 }</Link></td>) }) }
              </tr>
              <tr>
                <td>关闭问题</td>
                <td>2</td>
                { _.map(options.types || [], (v) => { return (<td key={ v.id }>{ data.closed_issues && data.closed_issues[v.id] || 0 }</td>) }) }
              </tr>
            </tbody>
          </Table>
        </Panel>
        <Panel header='未解决问题：按经办人'>
          <Table responsive hover>
            <thead>
              <tr>
                <th>问题类型</th>
                <th>全部</th>
                { _.map(options.types || [], (v) => { return (<th key={ v.id }>{ v.name }</th>) }) }
              </tr>
            </thead>
            <tbody>
              { _.map(data.unresolved_issues, (val, key) => {
                return (
                <tr>
                  <td>{ options.users && options.users[key] || '' }</td>
                  <td><Link to='#'><font color='red'>2</font></Link></td>
                  { _.map(options.types || [], (v) => { return (<td key={ v.id }><Link to='#'>{ val[v.id] || 0 }</Link></td>) }) }
                </tr>) }) }
            </tbody>
          </Table>
        </Panel>
        <Panel header='未解决问题：按优先级'>
          <Table responsive>
            <thead>
              <tr>
                <th>问题类型</th>
                <th>全部</th>
                { _.map(options.types || [], (v) => { return (<th key={ v.id }>{ v.name }</th>) }) }
              </tr>
            </thead>
          </Table>
        </Panel>
      </div>
    );
  }
}
