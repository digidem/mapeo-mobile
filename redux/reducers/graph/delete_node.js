import DeleteWay from './delete_way'

// https://github.com/openstreetmap/potlatch2/blob/master/net/systemeD/halcyon/connection/actions/DeleteNodeAction.as
export default function DeleteNode (nodeId) {
  var action = function (graph) {
    var node = graph.entity(nodeId)

    graph.parentWays(node)
      .forEach(function (parent) {
        parent = parent.removeNode(nodeId)
        graph = graph.replace(parent)

        if (parent.isDegenerate()) {
          graph = DeleteWay(parent.id)(graph)
        }
      })

    return graph.remove(node)
  }

  action.disabled = function () {
    return false
  }

  return action
}
