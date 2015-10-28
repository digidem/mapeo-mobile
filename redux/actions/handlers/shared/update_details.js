/**
 * Updates the tags on an entity - all questions / form details should be
 * stored as a flat unordered list of key-value tags. Replaces existing tags
 * We should maybe blacklist certain tags somewhere - tags we use internally
 * for things like the linked media file, gps accuracy, etc.
 *
 * @param {string} options.entityId Id of entity to update
 * @param {Object} options.tags     Shallow object of keys/values to set.
 */
export default function UpdateDetails ({ entityId, tags }) {
  return function (graph) {
    var entity = graph.entity(entityId)
    return graph.replace(entity.update({tags: tags}))
  }
}
