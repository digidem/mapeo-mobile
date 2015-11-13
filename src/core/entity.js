// From https://github.com/openstreetmap/iD/blob/v1.7.4/js/id/core/entity.js
import _ from 'lodash'

const Entity = function (attrs) {
  // For prototypal inheritance.
  if (this instanceof Entity) return

  // Create the appropriate subtype.
  if (attrs && attrs.type) {
    return Entity[attrs.type].apply(this, arguments)
  } else if (attrs && attrs.id) {
    return Entity[Entity.id.type(attrs.id)].apply(this, arguments)
  }

  // Initialize a generic Entity (used only in tests).
  return (new Entity()).initialize(arguments)
}

Entity.id = function (type) {
  return Entity.id.fromOSM(type, Entity.id.next[type]--)
}

Entity.id.next = {node: -1, way: -1, relation: -1, observation: -1}

Entity.id.fromOSM = function (type, id) {
  return type[0] + id
}

Entity.id.toOSM = function (id) {
  return id.slice(1)
}

Entity.id.type = function (id) {
  return {'n': 'node', 'w': 'way', 'r': 'relation', 'o': 'observation'}[id[0]]
}

// A function suitable for use as the second argument to d3.selection#data().
Entity.key = function (entity) {
  return entity.id + 'v' + (entity.v || 0)
}

Entity.prototype = {
  tags: {},

  initialize: function (sources) {
    for (var i = 0; i < sources.length; ++i) {
      var source = sources[i]
      for (var prop in source) {
        if (Object.prototype.hasOwnProperty.call(source, prop)) {
          if (source[prop] === undefined) {
            delete this[prop]
          } else {
            this[prop] = source[prop]
          }
        }
      }
    }

    if (!this.id && this.type) {
      this.id = Entity.id(this.type)
    }
    if (!this.hasOwnProperty('visible')) {
      this.visible = true
    }

    if (process.env.DEBUG) {
      Object.freeze(this)
      Object.freeze(this.tags)

      if (this.loc) Object.freeze(this.loc)
      if (this.nodes) Object.freeze(this.nodes)
      if (this.members) Object.freeze(this.members)
    }

    return this
  },

  copy: function () {
    // Returns an array so that we can support deep copying ways and relations.
    // The first array element will contain this.copy, followed by any descendants.
    return [Entity(this, {id: undefined, user: undefined, version: undefined})]
  },

  osmId: function () {
    return Entity.id.toOSM(this.id)
  },

  isNew: function () {
    return this.osmId() < 0
  },

  update: function (attrs) {
    return Entity(this, attrs, {v: 1 + (this.v || 0)})
  },

  mergeTags: function (tags) {
    var merged = _.clone(this.tags)
    var changed = false

    for (var k in tags) {
      var t1 = merged[k]
      var t2 = tags[k]

      if (!t1) {
        changed = true
        merged[k] = t2
      } else if (t1 !== t2) {
        changed = true
        merged[k] = _.union(t1.split(/;\s*/), t2.split(/;\s*/)).join(';')
      }
    }
    return changed ? this.update({tags: merged}) : this
  },

  intersects: function (extent, resolver) {
    return this.extent(resolver).intersects(extent)
  },

  isUsed: function (resolver) {
    return _.without(Object.keys(this.tags), 'area').length > 0 ||
    resolver.parentRelations(this).length > 0 ||
    resolver.observations(this).length > 0
  },

  hasInterestingTags: function () {
    return _.keys(this.tags).some(function (key) {
      return key !== 'attribution' &&
      key !== 'created_by' &&
      key !== 'source' &&
      key !== 'odbl' &&
      key.indexOf('tiger:') !== 0
    })
  },

  isHighwayIntersection: function () {
    return false
  },

  // TODO: implement?
  deprecatedTags: function () {
    // var tags = _.pairs(this.tags)
    var deprecated = {}

    // iD.data.deprecated.forEach(function (d) {
    //   var match = _.pairs(d.old)[0]
    //   tags.forEach(function (t) {
    //     if (t[0] === match[0] &&
    //       (t[1] === match[1] || match[1] === '*')) {
    //       deprecated[t[0]] = t[1]
    //     }
    //   })
    // })

    return deprecated
  },

  asJSON: function () {
    const gps = {
      loc: this.loc && this.loc.slice()
    }
    const details = Object.assign({}, this.tags)
    const media = {}

    // TODO: move details props to media & gps object...

    return {
      gps,
      media,
      details
    }
  }
}

export default Entity
