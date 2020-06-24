exports.default = {
  tree: {
    base: {
      listStyle: 'none',
      backgroundColor: '#fff',
      margin: 0,
      padding: 0,
      fontFamily: 'lucida grande ,tahoma,verdana,arial,sans-serif',
      fontSize: '14px'
    },
    node: {
      base: {
        position: 'relative'
      },
      link: {
        cursor: 'pointer',
        position: 'relative',
        padding: '0px 5px',
        display: 'block',
        minWidth: '100%',
        width: 'fit-content',
        whiteSpace: 'nowrap'
      },
      activeLink: {
        background: '#f5f5f5'
      },
      toggle: {
        base: {
          position: 'relative',
          display: 'inline-block',
          verticalAlign: 'top',
          textAlign: 'center',
          marginLeft: '-5px',
          height: '28px',
          lineHeight: '28px',
          width: '24px'
        },
        wrapper: {
          position: 'absolute',
          top: '50%',
          left: '50%',
          margin: '-9px 0 0 -7px',
          height: '14px'
        },
        height: 12,
        width: 12,
        arrow: {
          fill: '#777',
          strokeWidth: 0
        }
      },
      header: {
        base: {
          display: 'inline-block',
          verticalAlign: 'top',
          color: '#777'
        },
        connector: {
          width: '2px',
          height: '12px',
          borderLeft: 'solid 2px black',
          borderBottom: 'solid 2px black',
          position: 'absolute',
          top: '0px',
          left: '-21px'
        },
        title: {
          whiteSpace: 'nowrap',
          lineHeight: '28px',
          verticalAlign: 'middle'
        },
        folder: {
          float: 'left',
          color: '#FFD300',
          marginRight: '5px'
        }
      },
      subtree: {
        listStyle: 'none',
        paddingLeft: '19px'
      },
      loading: {
        marginLeft: '8px',
        color: '#E2C089'
      }
    }
  }
};
