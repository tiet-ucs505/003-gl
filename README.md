# 003 : OpenGL 101 #

## Using Web Browser Context for OpenGL ##

Three major operations for pixel level graphic
manipulation using HTML Canvas.

### Get WebGL Javascript Canvas Context ###

This consists of two steps,
1. Get a handle to the HTML Canvas Element;
2. Retrieve "webgl2" context.

```javascript
/**
 * Params:
 *  canvas: canvas element or its selector.
 */
function getCtx(canvasOrSelector) {
  let canvas = canvasOrSelector
  if (canvas instanceof String)
    canvas = document.querySelector(canvas)

  return canvas.getContext('webgl2')
}
```

For further details please look at [this javascript file](./points/index.js).

## Usage ##

### With VSCode/Live-Server Extension ###

1. Install VSCode;
2. Install [Live Server
Extension](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer);
3. As per official docs, "Launch a local development
server with live reload feature for static & dynamic
pages."

![](https://github.com/ritwickdey/vscode-live-server/raw/HEAD/images/Screenshot/vscode-live-server-animated-demo.gif)

### With BrowserSync ###

1. Install BrowserSync,
2. Descend into the directory and launch using:

```sh
browser-sync -w
```

