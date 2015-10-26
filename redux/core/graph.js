import _ from 'lodash'

const Graph = function (other, mutable) {
  if (!(this instanceof Graph)) return new Graph(other, mutable)

  if (other instanceof Graph) {
    var base = other.base()
    this.entities = _.assign(Object.create(base.entities), other.entities)
    this._parentWays = _.assign(Object.create(base.parentWays), other._parentWays)
    this._parentRels = _.assign(Object.create(base.parentRels), other._parentRels)
    this._observations = _.assign(Object.create(base.observations), other._observations)
  } else {
    this.entities = Object.create({})
    this._parentWays = Object.create({})
    this._parentRels = Object.create({})
    this._observations = Object.create({})
    this.rebase(other || [], [this])
  }

  this.transients = {}
  this._childNodes = {}
  this.frozen = !mutable
}

Graph.prototype = {
  hasEntity: function (id) {
    return this.entities[id]
  },

  entity: function (id) {
    var entity = this.entities[id]
    if (!entity) {
      throw new Error('entity ' + id + ' not found')
    }
    return entity
  },

  transient: function (entity, key, fn) {
    var id = entity.id
    var transients = this.transients[id] ||
      (this.transients[id] = {})

    if (transients[key] !== undefined) {
      return transients[key]
    }

    transients[key] = fn.call(entity)

    return transients[key]
  },

  parentWays: function (entity) {
    var parents = this._parentWays[entity.id]
    var result = []

    if (parents) {
      for (var i = 0; i < parents.length; i++) {
        result.push(this.entity(parents[i]))
      }
    }
    return result
  },

  isPoi: function (entity) {
    var parentWays = this._parentWays[entity.id]
    return !parentWays || parentWays.length === 0
  },

  isShared: function (entity) {
    var parentWays = this._parentWays[entity.id]
    return parentWays && parentWays.length > 1
  },

  parentRelations: function (entity) {
    var parents = this._parentRels[entity.id]
    var result = []

    if (parents) {
      for (var i = 0; i < parents.length; i++) {
        result.push(this.entity(parents[i]))
      }
    }
    return result
  },

  childNodes: function (entity) {
    if (this._childNodes[entity.id]) {
      return this._childNodes[entity.id]
    }

    var nodes = []
    if (entity.nodes) {
      for (var i = 0; i < entity.nodes.length; i++) {
        nodes[i] = this.entity(entity.nodes[i])
      }
    }

    if (process.env.DEBUG) Object.freeze(nodes)

    this._childNodes[entity.id] = nodes
    return this._childNodes[entity.id]
  },

  observations: function (entity) {
    const observations = this._observations[entity.id]
    const result = []

    if (observations) {
      for (var i = 0; i < observations.length; i++) {
        result.push(this.entity(observations[i]))
      }
    }
    return result
  },

  base: function () {
    return {
      'entities': Object.getPrototypeOf(this.entities),
      'parentWays': Object.getPrototypeOf(this._parentWays),
      'parentRels': Object.getPrototypeOf(this._parentRels),
      'observations': Object.getPrototypeOf(this._observations)
    }
  },

  // Unlike other graph methods, rebase mutates in place. This is because it
  // is used only during the history operation that merges newly downloaded
  // data into each state. To external consumers, it should appear as if the
  // graph always contained the newly downloaded data.
  rebase: function (entities, stack, force) {
    const base = this.base()

    for (let i = 0; i < entities.length; i++) {
      var entity = entities[i]

      if (!entity.visible || (!force && base.entities[entity.id])) {
        continue
      }

      // Merging data into the base graph
      base.entities[entity.id] = entity
      // This line needed to be updated to pass base.observations too
      this._updateCalculated(undefined, entity, base.parentWays, base.parentRels, base.observations)

      // Restore provisionally-deleted nodes that are discovered to have an extant parent
      if (entity.type === 'way') {
        for (let j = 0; j < entity.nodes.length; j++) {
          let id = entity.nodes[j]
          for (let k = 1; k < stack.length; k++) {
            var ents = stack[k].entities
            if (ents.hasOwnProperty(id) && ents[id] === undefined) {
              delete ents[id]
            }
          }
        }
      }
    }

    for (let i = 0; i < stack.length; i++) {
      stack[i]._updateRebased()
    }
  },

  _updateRebased: function () {
    const base = this.base()
    let keys

    keys = Object.keys(this._parentWays)
    for (let i = 0; i < keys.length; i++) {
      let child = keys[i]
      if (base.parentWays[child]) {
        for (let k = 0; k < base.parentWays[child].length; k++) {
          let id = base.parentWays[child][k]
          if (!this.entities.hasOwnProperty(id) && !_.contains(this._parentWays[child], id)) {
            this._parentWays[child].push(id)
          }
        }
      }
    }

    keys = Object.keys(this._parentRels)
    for (let i = 0; i < keys.length; i++) {
      let child = keys[i]
      if (base.parentRels[child]) {
        for (let k = 0; k < base.parentRels[child].length; k++) {
          let id = base.parentRels[child][k]
          if (!this.entities.hasOwnProperty(id) && !_.contains(this._parentRels[child], id)) {
            this._parentRels[child].push(id)
          }
        }
      }
    }

    keys = Object.keys(this._observations)
    for (let i = 0; i < keys.length; i++) {
      let child = keys[i]
      if (base.observations[child]) {
        for (let k = 0; k < base.observations[child].length; k++) {
          let id = base.observations[child][k]
          if (!this.entities.hasOwnProperty(id) && !_.contains(this._observations[child], id)) {
            this._observations[child].push(id)
          }
        }
      }
    }

    this.transients = {}
  },

  // Updates calculated properties (parentWays, parentRels, observations) for the specified change
  _updateCalculated: function (oldentity, entity, parentWays, parentRels, observations) {
    parentWays = parentWays || this._parentWays
    parentRels = parentRels || this._parentRels
    observations = observations || this._observations

    const type = entity && entity.type || oldentity && oldentity.type
    let removed
    let added

    if (type === 'way') {
      // Update parentWays
      if (oldentity && entity) {
        removed = _.difference(oldentity.nodes, entity.nodes)
        added = _.difference(entity.nodes, oldentity.nodes)
      } else if (oldentity) {
        removed = oldentity.nodes
        added = []
      } else if (entity) {
        removed = []
        added = entity.nodes
      }
      for (let i = 0; i < removed.length; i++) {
        parentWays[removed[i]] = _.without(parentWays[removed[i]], oldentity.id)
      }
      for (let i = 0; i < added.length; i++) {
        let ways = _.without(parentWays[added[i]], entity.id)
        ways.push(entity.id)
        parentWays[added[i]] = ways
      }
    } else if (type === 'relation') {
      // Update parentRels
      if (oldentity && entity) {
        removed = _.difference(oldentity.members, entity.members)
        added = _.difference(entity.members, oldentity)
      } else if (oldentity) {
        removed = oldentity.members
        added = []
      } else if (entity) {
        removed = []
        added = entity.members
      }
      for (let i = 0; i < removed.length; i++) {
        parentRels[removed[i].id] = _.without(parentRels[removed[i].id], oldentity.id)
      }
      for (let i = 0; i < added.length; i++) {
        let rels = _.without(parentRels[added[i].id], entity.id)
        rels.push(entity.id)
        parentRels[added[i].id] = rels
      }
    } else if (type === 'observation') {
      // Update observations
      let toRemove = oldentity && oldentity.nodeId
      let toAdd = entity && entity.nodeId

      if (toRemove) {
        observations[toRemove] = _.without(observations[toRemove], oldentity.id)
      }
      if (toAdd) {
        let addedObservations = _.without(observations[toAdd], entity.id)
        addedObservations.push(entity.id)
        observations[toAdd] = addedObservations
      }
    }
  },

  replace: function (entity) {
    if (this.entities[entity.id] === entity) {
      return this
    }

    return this.update(function () {
      this._updateCalculated(this.entities[entity.id], entity)
      this.entities[entity.id] = entity
    })
  },

  remove: function (entity) {
    return this.update(function () {
      this._updateCalculated(entity, undefined)
      this.entities[entity.id] = undefined
    })
  },

  revert: function (id) {
    var baseEntity = this.base().entities[id]
    var headEntity = this.entities[id]

    if (headEntity === baseEntity) {
      return this
    }

    return this.update(function () {
      this._updateCalculated(headEntity, baseEntity)
      delete this.entities[id]
    })
  },

  update: function () {
    const graph = this.frozen ? Graph(this, true) : this

    for (let i = 0; i < arguments.length; i++) {
      arguments[i].call(graph, graph)
    }

    if (this.frozen) graph.frozen = true

    return graph
  },

  // Obliterates any existing entities
  load: function (entities) {
    var base = this.base()
    this.entities = Object.create(base.entities)

    for (var i in entities) {
      this.entities[i] = entities[i]
      this._updateCalculated(base.entities[i], this.entities[i])
    }

    return this
  }
}

export default Graph
