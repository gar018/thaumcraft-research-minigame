
// Check your browser supports: https://github.com/gpuweb/gpuweb/wiki/Implementation-Status#implementation-status
// Need to enable experimental flags chrome://flags/
// Chrome & Edge 113+ : Enable Vulkan, Default ANGLE Vulkan, Vulkan from ANGLE, Unsafe WebGPU Support, and WebGPU Developer Features (if exsits)
// Firefox Nightly: sudo snap install firefox --channel=latext/edge or download from https://www.mozilla.org/en-US/firefox/channel/desktop/
import StandardTextObject from "./lib/StandardTextObject.js";
import Renderer from "./lib/2DRenderer.js";
import ScreenInterface from "./lib/ScreenInterface.js";
import Standard2DFullScreenObject from "./lib/Standard2DFullScreenObject.js";
import Aspect from "./lib/Aspect.js";
import AspectSceneObject from "./lib/AspectSceneObject.js";
import SceneObject from "./lib/SceneObject.js"
import ScrollObject from "./lib/ScrollObject.js";

async function init() {
  // Create a canvas tag
  const canvasTag = document.createElement('canvas');
  canvasTag.id = "renderCanvas";
  document.body.appendChild(canvasTag);
  canvasTag.hidden = true;
  
  var renderer = new Renderer(canvasTag);
  var interactor = new ScreenInterface(canvasTag);
  await renderer.init();
  //await interactor.init();
  await SceneObject.setRendererInfo(renderer._device, renderer._canvasFormat); //all scene objects will now adopt these automatically

  await renderer.appendSceneObject(new Standard2DFullScreenObject("./assets/tiles/planks_greatwood.png"));

  await renderer.appendSceneObject(new ScrollObject(0, [1,0,0.18,0,.92,.92]));
  //await renderer.appendSceneObject(new AspectSceneObject(Aspect.FIRE, [1,0,0,0,0.2,0.2]));
  var entry = 0;
  let cols = 8;
  await Object.entries(Aspect.aspectDict).forEach(([name, aspect]) => {
    let x = 1.0 - 0.29 * (entry % cols);
    let y = 1.2 - 0.35 * Math.floor(entry / cols);
    let aspectObj = new AspectSceneObject(aspect, [0.25,0,y,x,0.085,0.085]);
    renderer.appendSceneObject(aspectObj);
    interactor.appendSceneObject(aspectObj);
    entry++;
  });
  await interactor.init();
  //var nameTooltip = new TooltipTextObject("Hello World",100);
  //var componentsTooltip = new TooltipTextObject("Another thing + Another Thing",60, "35px Times New Roman", "grey");

  //await renderer.appendSceneObject(new Standard2DFullScreenObject(renderer._device, renderer._canvasFormat, "/assets/vignette.png"));
  let fps = '??';
  var fpsText = new StandardTextObject('fps: ' + fps);
  
  // run animation at 60 fps
  var frameCnt = 0;
  var tgtFPS = 60;
  var secPerFrame = 1. / tgtFPS;
  var frameInterval = secPerFrame * 1000;
  var lastCalled;
  let renderFrame = () => {
    let elapsed = Date.now() - lastCalled;
    if (elapsed > frameInterval) {
      ++frameCnt;
      lastCalled = Date.now() - (elapsed % frameInterval);
      renderer.render();
    }
    requestAnimationFrame(renderFrame);
  };

  lastCalled = Date.now();
  renderFrame();
  setInterval(() => { 
    fpsText.updateText('fps: ' + frameCnt);
    frameCnt = 0;
  }, 1000); // call every 1000 ms
  return renderer;
}

init().then( ret => {
  console.log(ret);
}).catch( error => {
  const pTag = document.createElement('p');
  pTag.innerHTML = navigator.userAgent + "</br>" + error.message;
  document.body.appendChild(pTag);
  document.getElementById("renderCanvas").remove();
});
