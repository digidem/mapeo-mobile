import _ from 'lodash'
import geo from 'id-geo'
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
  nodeId: null,

  extent: function () {
    return new geo.Extent(this.loc)
  },

  geometry: function (graph) {
    return graph.transient(this, 'geometry', function () {
      return 'point'
    })
  },

  move: function (loc) {
    return this.update({loc: loc})
  },

  linkNode: function (id) {
    return this.update({nodeId: id})
  },

  unLinkNode: function () {
    return this.update({nodeId: null})
  },

  asJXON: function (changeset_id) {
    var r = {
      observation: {
        '@id': this.osmId(),
        '@lon': this.loc[0],
        '@lat': this.loc[1],
        '@version': (this.version || 0),
        '@nodeId': this.node,
        tag: _.map(this.tags, function (v, k) {
          return { keyAttributes: { k: k, v: v } }
        })
      }
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
