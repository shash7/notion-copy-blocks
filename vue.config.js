const path = require("path");
const fs = require("fs");
const webpack = require("webpack");
const packageJson = fs.readFileSync("./package.json");

const version = JSON.parse(packageJson).version || 0;

// Generate pages object
const pages = {};

function getEntryFile(entryPath) {
  let files = fs.readdirSync(entryPath);
  return files;
}

const chromeName = getEntryFile(path.resolve(`src/entry`));

function getFileExtension(filename) {
  return /[.]/.exec(filename) ? /[^.]+$/.exec(filename)[0] : undefined;
}
chromeName.forEach((name) => {
  const fileExtension = getFileExtension(name);
  const fileName = name.replace("." + fileExtension, "");
  pages[fileName] = {
    entry: `src/entry/${name}`,
    template: "public/index.html",
    filename: `${fileName}.html`,
  };
});

const isDevMode = process.env.NODE_ENV === "development";

process.env.VUE_APP_VERSION = version;

module.exports = {
  pages,
  filenameHashing: false,
  chainWebpack: (config) => {
    config.plugin("copy").use(require("copy-webpack-plugin"), [
      {
        patterns: [
          {
            from: path.resolve(`src/manifest.${process.env.NODE_ENV}.json`),
            to: `${path.resolve("dist")}/manifest.json`,
          },
          {
            from: path.resolve(`public/`),
            to: `${path.resolve("dist")}/`,
          },
        ],
      },
    ]);
  },
  configureWebpack: {
    output: {
      filename: `[name].js`,
      chunkFilename: `[name].js`,
    },
    devtool: isDevMode ? "inline-source-map" : false,
    plugins: [
      new webpack.DefinePlugin({
        // allow access to process.env from within the vue app
        "process.env": {
          VUE_NODE_ENV: JSON.stringify(process.env.NODE_ENV),
        },
      }),
    ],
    optimization: {
      minimize: false,
      minimizer: [],
    },
  },
  css: {
    extract: false, // Make sure the css is the same
    loaderOptions: {
      sass: {
        prependData: `
        @import "node_modules/bootstrap/scss/functions.scss";
      @import "node_modules/bootstrap/scss/variables.scss";
      @import "node_modules/bootstrap/scss/mixins/_breakpoints.scss";
      @import "node_modules/@swipekit/styles/common/_global.scss";
        @import "node_modules/@swipekit/styles/common/_global.scss";
        `,
      },
    },
  },
};
