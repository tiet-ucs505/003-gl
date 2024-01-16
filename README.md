# 001 : Pixel Manipulations #

## Usage ##

## With VSCode/Live-Server Extension ##

1. Install VSCode;
2. Install [Live Server
Extension](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer);
3. As per official docs, "Launch a local development
server with live reload feature for static & dynamic
pages."

![](https://github.com/ritwickdey/vscode-live-server/raw/HEAD/images/Screenshot/vscode-live-server-animated-demo.gif)

## With BrowserSync ##

1. Install BrowserSync,
2. Descend into the directory and launch using:

```sh
browser-sync -w
```

## Using Web Browser Context ##

Three major operations for pixel level graphic
manipulation using HTML Canvas.

### Get 2D Javascript Canvas Context ###

This consists of two steps,
1. Get a handle to the HTML Canvas Element;
2. Retrieve "2d" context.

```javascript
/**
 * Params:
 *  canvas: canvas element or its selector.
 */
function getCtx(canvasOrSelector) {
  let canvas = canvasOrSelector
  if (canvas instanceof String)
    canvas = document.querySelector(canvas)

  return canvas.getContext('2d')
}
```

### Image I/O ###

To read image data, use
[`getImageData`](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/getImageData)
function, and specify the start (i.e. top-left) and end
(i.e. bottom-right) pixel coordinates for the slice of
the image required to be read.

To write, the slice back, similarly use
[`putImageData`](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/putImageData)

```javascript
// getImageData
let canvas = document.querySelector('#canvasImg')
let ctx = canvas.getContext('2d') 
let [x0,y0,W,H] = [0, 0, canvas.width, canvas.height]
let imData = ctx.getImageData(x0,y0,W,H)

// putImageData
ctx.putImageData(imData, x0, y0)
```

### Image Data Manipulation ###

```javascript
/**
 * Adapted from here:
 * https://www.measurethat.net/Benchmarks/Show/8386/0/setting-canvas-pixel-with-lots-of-iterations
 */

function asUint8 (a) {
  return Math.min(255, Math.max(0, a << 0))
}

function setPixel(imData, H, W, x, y, r, g, b, a) {
  const px = {
    x: asUint8(x),
    y: asUint8(y),
    r: asUint8(r),
    g: asUint8(g),
    b: asUint8(b),
    a: asUint8(a),
  }
  px.rgba = [px.r, px.g, px.b, px.a]

  const offset = (px.y * W + px.x) * 4

  const pixels = imData.data
  pixels.set(px.rgba, offset)
}
```


