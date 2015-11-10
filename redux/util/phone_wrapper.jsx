import React from 'react'

const style = {
  galaxyPhone: {
    background: 'url(img/galaxy-xcover-2.png)',
    width: 619,
    height: 1167,
    margin: '0 auto',
    position: 'relative'
  },
  galaxyScreen: {
    position: 'absolute',
    top: 203,
    left: 69,
    width: 480,
    height: 790,
    backgroundColor: 'white',
    overflow: 'hidden'
  }
}

const PhoneWrapper = (Component) => (props) => {
  if (window.innerWidth < 500) {
    return <Component {...props} />
  } else {
    return (
      <div style={style.galaxyPhone}>
        <div style={style.galaxyScreen}>
          <Component {...props} />
        </div>
      </div>
    )
  }
}

export default PhoneWrapper
