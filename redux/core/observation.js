import _ from 'lodash'
import geo from 'id-geo'
import deepEqual from 'deep-equal'
import Entity from './entity'

const Observation = Entity.observation = function () {
  if (!(this instanceof Observation)) {
    return (new Observation()).initialize(arguments)
  } else if (arguments.length) {
    this.initialize(arguments)
  }
}

Observation.prototype = Object.create(Entity.prototype)

_.extend(Observation.prototype, {
  type: 'observation',
  link: null,

  extent: function () {
    return new geo.Extent(this.loc)
  },

  move: function (loc) {
    return this.update({loc: loc})
  },

  setLink: function (link) {
    if (deepEqual(link, this.link)) return this
    return this.update({link: link})
  },

  removeLink: function () {
    return this.update({link: null})
  },

  asJXON: function (changeset_id) {
    var r = {
      observation: {
        '@id': this.osmId(),
        '@lon': this.loc[0],
        '@lat': this.loc[1],
        '@version': (this.version || 0),
        tag: _.map(this.tags, function (v, k) {
          return { keyAttributes: { k: k, v: v } }
        })
      }
    }
    if (this.link) {
      r.observation.link = [{
        keyAttributes: {
          type: this.link.type,
          ref: Entity.id.toOSM(this.link.id)
        }
      }]
    }
    if (changeset_id) r.observation['@changeset'] = changeset_id
    return r
  },

  asGeoJSON: function () {
    return {
      type: 'Point',
      coordinates: this.loc
    }
  }
})

export default Observation
