import React, { PropTypes, Component } from 'react';
import { Button, Dropdown, MenuItem, Clearfix } from 'react-bootstrap'; 

export default class Menu extends Component {
  constructor(props) {
    super(props);
    this.state = { open: false };
    this.onSelectMenu = this.onSelectMenu.bind(this);
  }

  static propTypes = {
    issueNo: PropTypes.string.isRequired,
    inSprint: PropTypes.bool,
    toTop: PropTypes.func,
    toBottom: PropTypes.func,
    removeFromSprint: PropTypes.func
  }

  onSelectMenu(eventKey) {
    const { issueNo, toTop, toBottom, removeFromSprint } = this.props;
    if (eventKey === 'toTop') {
      toTop(issueNo);
    } else if (eventKey === 'toBottom') {
      toBottom(issueNo);
    } else if (eventKey === 'removeFromSprint') {
      removeFromSprint(issueNo);
    }
  }

  render() {
    const { inSprint } = this.props;

    return (
      <Dropdown 
        open
        style={ { position: 'fixed' } }
        onSelect={ this.onSelectMenu.bind(this) }>
        <Dropdown.Menu>
          <MenuItem eventKey='toTop'>移至顶部</MenuItem>
          <MenuItem eventKey='toBottom'>移至底部</MenuItem>
          { inSprint && <MenuItem divider /> }
          { inSprint && <MenuItem eventKey='removeFromSprint'>移出Sprint</MenuItem> }
        </Dropdown.Menu>
      </Dropdown>
    );
  }
}

