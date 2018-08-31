const path = require("path");

module.exports = {
  entry: "./scripts/nest_constructor.js",
  output: {
    path: path.resolve(__dirname, "./scripts"),
    filename: "main-bundled.js"
  },
  module: {
    rules: [
      {
        test: /\.hbs$/,
        use: [{
          loader: "handlebars-loader",
          options: {}
        }]
      }
    ]
  }
};