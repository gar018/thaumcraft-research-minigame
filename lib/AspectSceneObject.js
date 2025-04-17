
import SceneObject from "/lib/SceneObject.js";

export default class AspectSceneObject extends SceneObject {
    constructor(aspect, pose) {
        super(); //TODO refactor device and canvasFormat to be already defined statically in SceneObject

         //this is a reference to an aspect. if you change a property in this it will effect EVERY object with this aspect
         this.aspect = aspect; 
         this.pose = new Float32Array(pose);

         this.aspectImage = new Image();
         this.aspectImage.src = this.aspect.texturePath;
         this.color = new Float32Array(this.aspect.baseColor);
    }

    async createGeometry() {

        //TODO refactor this texture building process as a separate function
        await this.aspectImage.decode();
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


        // Copy from CPU to GPU
        this._device.queue.copyExternalImageToTexture({source: this._bitmap}, {texture: this._texture}, [this._bitmap.width, this._bitmap.height]);
        this._device.queue.writeBuffer(this._poseBuffer, 0, this.pose);
        this._device.queue.writeBuffer(this._colorBuffer, 0, this.color);

        
    }
        
    updateGeometry() {
        this._device.queue.writeBuffer(this._poseBuffer, 0, this.pose);
        this._device.queue.writeBuffer(this._colorBuffer, 0, this.color);
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
            }
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