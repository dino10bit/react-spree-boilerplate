import webpack from "webpack"
import merge from "webpack-merge"
import ExtractTextPlugin from "extract-text-webpack-plugin"
import config, { loaders } from "../config"
import vendorConfig, { outputDir as vendorDir } from "./vendor.babel"

const vendors = Object.keys(vendorConfig.entry).map(module => `${module}.manifest.json`)

export default merge.smart(config, {
  entry: {
    app: [
      "babel-polyfill",
      "./styles/app.css",
      "./styles/app.less",
      "./app/bundles/Store/startup"
    ]
  },
  output: {
    filename: "[name]-bundle.js"
  },
  module: {
    rules: loaders({
      styles: {
        extract: ExtractTextPlugin,
        fallback: "style-loader"
      }
    })
  },
  plugins: [
    new webpack.optimize.CommonsChunkPlugin("common"),
    new ExtractTextPlugin("[name]-bundle.css"),
    ...(vendors.map(fileName => (
      new webpack.DllReferencePlugin({
        // eslint-disable-next-line import/no-dynamic-require
        manifest: require(`${vendorDir}/${fileName}`)
      })
    )))
  ]
})
