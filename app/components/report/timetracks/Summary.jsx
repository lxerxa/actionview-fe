import React, { PropTypes, Component } from 'react';
import { Button, Table } from 'react-bootstrap';
import { ttFormat } from '../../share/Funcs'
import _ from 'lodash';

export default class Summary extends Component {
  constructor(props) {
    super(props);
  }

  static propTypes = {
    options: PropTypes.object.isRequired,
    values: PropTypes.object.isRequired
  }

  render() {
    const { options, values } = this.props;

    const w2m = (options.w2d || 5) * (options.d2h || 8) * 60;
    const d2m = (options.d2h || 8) * 60;

    let progress = _.round(values.spend_m / (values.spend_m + values.left_m), 2);
    progress = _.max([ progress, 0 ]);
    if (values.spend_m > 0) {
      progress = _.max([ progress, 0.01 ]);
    }
    progress = _.min([ progress, 1 ]);

    let accuracy = values.diff_m < 0 ? _.round(values.origin_m / (values.spend_m + values.left_m), 2) : _.round((values.spend_m + values.left_m) / values.origin_m, 2);
    accuracy = _.max([ accuracy, 0 ]);
    accuracy = _.min([ accuracy, 1 ]);

    return (
      <div>
        <Table style={ { marginBottom: '10px' } }>
          <tbody>
            <tr>
              <td width='10%'><span style={ { fontWeight: 600 } }>完成度</span></td>
              <td width='60%'>
                <table style={ { width: '100%', marginTop: '3px' } }>
                  <tbody>
                    <tr>
                      <td style={ { width: _.round(progress * 100) + '%' } }>
                        <div className='color-bar' style={ { borderTopColor: '#51a825' } }/>
                      </td>
                      <td style={ { width: _.round((1 - progress) * 100) + '%' } }>
                        <div className='color-bar' style={ { borderTopColor: '#ec8e00' } }/>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </td>
              <td width='30%'>
                <span>{ _.round(progress * 100) + '%' }</span>
                <span style={ { marginLeft: '10px', fontWeight: 600 } }>{ values.spend } 比 { ttFormat(values.spend_m + values.left_m, w2m, d2m) }</span>
              </td>
            </tr>
            <tr>
              <td width='10%'><span style={ { fontWeight: 600 } }>精准度</span></td>
              <td width='60%'>
                <table style={ { width: '100%', marginTop: '3px' } }>
                  <tbody>
                    <tr>
                      <td style={ { width: _.round(accuracy * 100) + '%' } }>
                        <div className='color-bar'/>
                      </td>
                      <td style={ { width: _.round((1 - accuracy) * 100) + '%' } }>
                        <div className='color-bar' style={ { borderTopColor: '#ccc' } }/>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </td>
              <td width='30%'>
                <span>{ _.round(accuracy * 100) + '%' }</span>
                <span style={ { marginLeft: '10px', fontWeight: 600 } }>{ values.diff_m < 0 ? ttFormat(values.origin_m, w2m, d2m) : ttFormat(values.spend_m + values.left_m, w2m, d2m) } 比 { values.diff_m < 0 ? ttFormat(values.spend_m + values.left_m, w2m, d2m) : ttFormat(values.origin_m, w2m, d2m) }</span>
              </td>
            </tr>
          </tbody>
        </Table>
      </div>
    );
  }
}
