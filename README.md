# notion-copy-blocks

A totally free open-source browser extension that helps you quickly copy text from Notion blocks.

---

How does it work?
Install the extension

- Go to notion
- Open any page and hover over a block.
- A copy icon will show up on the left hand side
- Click on it to copy the text content of that block

Some blocks work differently:

- Image block : copies the image url
- Page block : copies the page url

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
