let cache = {}

function selectEntity (state, {id} = {}) {
  if (id === 'new') {
    return {}
  }
  let entityJSON = cache.id === id ? cache.entityJSON
    : state.graph.entities[id].asJSON()
  cache = { id, entityJSON }
  return entityJSON
}

export default selectEntity
