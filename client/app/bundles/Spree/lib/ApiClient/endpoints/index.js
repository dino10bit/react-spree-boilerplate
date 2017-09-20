import _ from "lodash"
import url from "url"
import qs from "querystring"
// eslint-disable-next-line import/extensions
import Router from "universal-router"

const createEndpoint = (api, callback) => callback.bind(api)

// Final hydrate() endpoint
const hydrate = (api, endpointNames) => (data) => {
  const finalData = Object.assign({}, data)
  endpointNames.forEach((name) => {
    Object.assign(finalData, api[name].hydrate(data))
  })
  return finalData
}

const route = (api, router) => (target, context = {}) => {
  const { pathname, query: queryString } = url.parse(target)
  const query = qs.parse(queryString)
  return router.resolve({
    ...context,
    path: pathname,
    queryString,
    query
  })
}

function entityEndpoints(api, entities) {
  const hydrateEndpoints = []
  const result = {}
  _.values(entities).forEach((Entity) => {
    if(!Entity.collection || _.isEmpty(Entity.endpoints)) return
    const name = Entity.collection
    const methods = {}
    if("hydrate" in Entity.endpoints) {
      hydrateEndpoints.push(name)
    }
    _.keys(Entity.endpoints).forEach((key) => {
      methods[key] = createEndpoint(api, Entity.endpoints[key])
    })
    result[name] = methods
  })
  result.hydrate = hydrate(api, hydrateEndpoints)
  return result
}

function routerEndpoints(api, routes) {
  const finalRoutes = Object.keys(routes).map(path => ({
    path,
    action: createEndpoint(api, routes[path])
  }))
  const router = new Router(finalRoutes, {
    context: { api }
  })
  return { route: route(api, router) }
}

export default function createEndpoints(api, { entities, routes }) {
  return {
    ...entityEndpoints(api, entities),
    ...routerEndpoints(api, routes)
  }
}
