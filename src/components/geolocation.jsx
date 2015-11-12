import React, { Component } from 'react'

export default class Geolocation extends Component {

  watchID = null

  componentDidMount() {
    if ('geolocation' in navigator) {
      console.log('geolocation exists')
    } else {
      console.log('geolocation DOES NOT exist')
    }
    navigator.geolocation.getCurrentPosition(
      (initialPosition) => console.dir(initialPosition),
      (error) => alert(error.message),
      {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000}
    )

    this.watchID = navigator.geolocation.watchPosition(
      () => null,
      () => null,
      {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000}
    )
  }
  componentWillUnmount() {
    navigator.geolocation.clearWatch(this.watchID)
  }
  render() {
    return null
  }
}
