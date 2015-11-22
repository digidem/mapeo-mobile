import distance from 'turf-distance'
import Point from 'turf-point'

const cache = {}

function selectSortedItemList (state) {
  const locationCoords = state.location.coords
  let items
  const distanceFromLastLocation = cache.coords && locationCoords ? distance(Point(locationCoords), Point(cache.coords)) : Infinity
  // If the graph has not changed and we haven't moved more than 100m
  // do not change the list of items
  // TODO: switch to quicker distance function if necessary
  if (state.graph === cache.graph && distanceFromLastLocation < 0.1) {
    items = cache.items
  } else {
    const entities = []
    for (let id in state.graph.entities) {
      entities.push(state.graph.entities[id])
    }
    items = entities.map(entity => {
      return {
        id: entity.id,
        title: entity.tags['category'],
        date: Date.parse(entity.tags['survey:date']),
        distance: locationCoords ? distance(Point(locationCoords), Point(entity.loc)) * 1000 : null
      }
    }).sort((a, b) => a.distance - b.distance)
  }
  cache.coords = state.location.coords
  cache.graph = state.graph
  cache.items = items
  return items
}

export default selectSortedItemList
