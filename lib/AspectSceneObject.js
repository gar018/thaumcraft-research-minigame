
import SceneObject from "/lib/SceneObject.js";
import TooltipTextObject from "/lib/TooltipTextObject.js";

export default class AspectSceneObject extends SceneObject {

    static nameTooltip = new TooltipTextObject(" ",100);
    static componentsTooltip = new TooltipTextObject(" ",60, "35px Times New Roman");

    constructor(aspect, pose) {
        super();

        //this is a reference to an aspect. if you change a property in this it will effect EVERY object with this aspect
        this.aspect = aspect; 
        this.pose = new Float32Array(pose);
        this.currentlyHovering = 0;
        this.parameterArray = new Int32Array(4).fill(0);

        this.aspectImage = new Image();
        this.aspectImage.src = this.aspect.texturePath;
        this.color = new Float32Array(this.aspect.baseColor);


    }

    async createGeometry() {

        //TODO refactor this texture building process as a separate function
        try {await this.aspectImage.decode();}
        catch(error) {
            console.log(error.message);
            this.aspectImage.src = "/assets/aspects/_unknown.png";
            await this.aspectImage.decode();
        }
        this._bitmap = await createImageBitmap(this.aspectImage);

        this._texture = this._device.createTexture({
            label: "Texture " + this.getName(),
            size: [this._bitmap.width, this._bitmap.height, 1],
            format: "rgba8unorm",
            usage: GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_DST | GPUTextureUsage.RENDER_ATTACHMENT,
        });

        this._sampler = this._device.createSampler({
            magFilter: "nearest",
            minFilter: "nearest"
        });

        // Create pose buffer to store the object pose in GPU
        this._poseBuffer = this._device.createBuffer({
            label: "Pose " + this.getName(),
            size: this.pose.byteLength,
            usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
        });

        this._colorBuffer = this._device.createBuffer({
            label: "Color " + this.getName(),
            size: this.color.byteLength,
            usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
        });

        this._parameterBuffer = this._device.createBuffer({
            label: "Parameter " + this.getName(),
            size: this.parameterArray.byteLength,
            usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
        });


        // Copy from CPU to GPU
        this._device.queue.copyExternalImageToTexture({source: this._bitmap}, {texture: this._texture}, [this._bitmap.width, this._bitmap.height]);
        this._device.queue.writeBuffer(this._poseBuffer, 0, this.pose);
        this._device.queue.writeBuffer(this._colorBuffer, 0, this.color);
        this._device.queue.writeBuffer(this._parameterBuffer, 0, this.parameterArray);

        
    }
        
    updateGeometry() {
        this._device.queue.writeBuffer(this._poseBuffer, 0, this.pose);
        this._device.queue.writeBuffer(this._colorBuffer, 0, this.color);

        this.parameterArray[0] = this.currentlyHovering;
        this._device.queue.writeBuffer(this._parameterBuffer, 0, this.parameterArray);
    }

    onHoverStart() {
      //console.log("Hovering over " + this.aspect.aspectName);
      let name = this.aspect.displayName;
      AspectSceneObject.nameTooltip.updateTextRegion(name);
      AspectSceneObject.nameTooltip.updateText(name);

      if (this.aspect.isPrimal) {
        AspectSceneObject.componentsTooltip.updateTextRegion("Primal Aspect");
        AspectSceneObject.componentsTooltip.updateText("Primal Aspect", "grey");
      }
      else {
        let component1 = this.aspect.components[0].displayName;
        let component2 = this.aspect.components[1].displayName;
        AspectSceneObject.componentsTooltip.updateTextRegion(component1 + " + " + component2);
        AspectSceneObject.componentsTooltip.updateText(component1 + " + " + component2, "grey");
      }

      this.updateGeometry();
    }

    onHoverEnd() {
      //console.log("STOPPED hovering over " + this.aspect.aspectName);
      AspectSceneObject.nameTooltip.updateTextRegion(" ");
      AspectSceneObject.nameTooltip.updateText(" ");
      AspectSceneObject.componentsTooltip.updateTextRegion(" ");
      AspectSceneObject.componentsTooltip.updateText(" ");
      this.updateGeometry();
    }

    async createShaders() {
        let shaderCode = await this.loadShader("/shaders/aspect.wgsl");
        this._shaderModule = this._device.createShaderModule({
          label: " Shader " + this.getName(),
          code: shaderCode,
        }); 
    }

    async createRenderPipeline() {
        this._renderPipeline = this._device.createRenderPipeline({
          label: "Render Pipeline " + this.getName(),
          layout: "auto",
          vertex: {
            module: this._shaderModule,         // the shader code
            entryPoint: "vertexMain",           // the shader function
          },
          fragment: {
            module: this._shaderModule,    // the shader code
            entryPoint: "fragmentMain",    // the shader function
            targets: [{
              format: this._canvasFormat,
              blend: {
                color: {
                  srcFactor: 'one',
                  dstFactor: 'one-minus-src-alpha'
                },
                alpha: {
                  srcFactor: 'one',
                  dstFactor: 'one-minus-src-alpha'
                },
              },   // the target canvas format
            }]
          }
        });
        // Create bind group to bind the texture
        this._bindGroup = this._device.createBindGroup({
          layout: this._renderPipeline.getBindGroupLayout(0),
          entries: [
            {
              binding: 0,
              resource: this._texture.createView(),
            },
            {
              binding: 1,
              resource: this._sampler,
            },
            {
                binding: 2,
                resource: {buffer: this._poseBuffer}
            },
            {
                binding: 3,
                resource: {buffer: this._colorBuffer}
            },
            {
              binding: 4,
              resource: {buffer: this._parameterBuffer}
            },
          ],
        });
      }

    render(pass) {
        // add to render pass to draw the object
        pass.setPipeline(this._renderPipeline);   // which render pipeline to use
        pass.setBindGroup(0, this._bindGroup);    // bind group to bind texture to shader
        pass.draw(6, 1, 0, 0);                    // 6 vertices to draw a quad
    }

    async createComputePipeline() {}
  
    compute(pass) {}
       
}