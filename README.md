# swipekit-extension

## Project setup

```
npm install
```

### Compiles and hot-reloads for development

```
npm run serve
```

### Compiles and minifies for production

```
npm run build
```

### Customize configuration

See [Configuration Reference](https://cli.vuejs.org/config/).

### Publishing to the store

- Updated version number in package.json
- Set the version number manually in src/manifest.development.json and manifest.production.json
- Run build task
- Run build-extension task
- Go to the artifacts folder and update the newly created package zip file to the chrome webstore
