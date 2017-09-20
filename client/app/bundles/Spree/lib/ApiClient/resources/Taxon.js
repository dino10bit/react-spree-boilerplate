import Resource from "./Resource"
import { page, hydrate } from "../endpoints/methods"

export default class Taxon extends Resource {
  static baseUrl = "/api/v1/taxons"

  static collection = "taxons"

  static endpoints = {
    page: page(Taxon),
    hydrate: hydrate(Taxon)
  }

  static relationships = {
    taxons: Taxon
  }

  constructor(data) {
    super()
    this.id = data.id
    this.parentId = data.parent_id
    this.taxonomyId = data.taxonomy_id
    this.name = data.name
    this.permalink = data.permalink
    this.position = data.position
    this.taxons = data.taxons.map(t => new Taxon(t))
  }

  get breadcrumbs() {
    const breadcrumbs = (this.parentId ? this.parent.breadcrumbs() : [])
    breadcrumbs.push(this.name)
    return breadcrumbs
  }

  get parent() {
    if(!this.parentId) return undefined
    if(this.parentId === this.taxonomyId) return this.api.taxonomies.get(this.parentId)
    return this.api.taxons.get(this.parentId)
  }

  get taxonomy() {
    return this.parentId ? this.api.taxonomies.get(this.taxonomyId) : undefined
  }

  flatten() {
    return this.taxons.reduce((array, taxon) => (
      array.concat(taxon.flatten())
    ), [ this ])
  }
}