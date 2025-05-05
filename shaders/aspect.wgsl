

// struct to store a multi vector
struct MultiVector {
  s: f32,
  e01: f32,
  eo0: f32,
  eo1: f32
};

// struct to store 2D PGA pose
struct Pose {
  motor: MultiVector,
  scale: vec2f
};

fn geometricProduct(a: MultiVector, b: MultiVector) -> MultiVector {
  // ref: https://geometricalgebratutorial.com/pga/
  // eoo = 0, e00 = 1 e11 = 1
  // s + e01 + eo0 + eo1
  // ss   = s   , se01   = e01  , seo0            = eo0  , seo1          = eo1
  // e01s = e01 , e01e01 = -s   , e01eo0 = e10e0o = -eo1 , e01eo1 = -e0o = eo0
  // eo0s = eo0 , eo0e01 = eo1  , eo0eo0          = 0    , eo0eo1        = 0
  // e01s = e01 , eo1e01 = -eo0 , eo1eo0          = 0    , eo1eo1        = 0
  return MultiVector(
    a.s * b.s   - a.e01 * b.e01 , // scalar
    a.s * b.e01 + a.e01 * b.s   , // e01
    a.s * b.eo0 + a.e01 * b.eo1 + a.eo0 * b.s   - a.eo1 * b.e01, // eo0
    a.s * b.eo1 - a.e01 * b.eo0 + a.eo0 * b.e01 + a.eo1 * b.s    // eo1
  );
}
fn reverse(a: MultiVector) -> MultiVector {
  return MultiVector( a.s, -a.e01, -a.eo0, -a.eo1 );
}

fn applyMotor(p: MultiVector, m: MultiVector) -> MultiVector {
  return geometricProduct(m, geometricProduct(p, reverse(m)));
}

fn applyMotorToPoint(p: vec2f, m: MultiVector) -> vec2f {
  // ref: https://geometricalgebratutorial.com/pga/
  // Three basic vectors e0, e1 and eo (origin)
  // Three basic bi-vectors e01, eo0, eo1
  // p = 0 1 + 1 e_01 - x e_o1 + y e_o0 
  // m = c 1 + s e_01 + dx / 2 e_o0 - dy / 2 e_o1 
  let new_p = applyMotor(MultiVector(0, 1, p[0], p[1]), m);
  return vec2f(new_p.eo0 / new_p.e01, new_p.eo1 / new_p.e01);
}

struct VertexOutput {
  @builtin(position) pos: vec4f,
  @location(0) texCoords: vec2f
};

struct Parameter {
  isHovering: i32,
  parameter2: i32,
  parameter3: i32,
  parameter4: i32
}


@group(0) @binding(2) var<uniform> pose: Pose;

@vertex
fn vertexMain(@builtin(vertex_index) vIdx: u32) -> VertexOutput {

  //let scale : f32 = 0.2;

  var quadPoints = array<vec2f, 6>(
    vec2f(-1, -1), vec2f(1, -1), vec2f(-1, 1),
    vec2f(1, 1), vec2f(1, -1), vec2f(-1, 1)
  );
  var texCoords = array<vec2f, 6>(
    vec2f(0, 1), vec2f(1, 1), vec2f(0, 0),
    vec2f(1, 0), vec2f(1, 1), vec2f(0, 0)
  );

  var out: VertexOutput;
  let transformedPos = applyMotorToPoint(quadPoints[vIdx], pose.motor) * pose.scale;
  out.pos = vec4f(transformedPos, 0, 1);
  out.texCoords = texCoords[vIdx];
  return out;
}

@group(0) @binding(0) var inTexture: texture_2d<f32>;
@group(0) @binding(1) var inSampler: sampler;
@group(0) @binding(3) var<uniform> color: vec4f;
@group(0) @binding(4) var<uniform> parameters: Parameter;

@fragment
fn fragmentMain(@builtin(position) pos: vec4f, @location(0) texCoords: vec2f) -> @location(0) vec4f {
  let selected = f32(parameters.isHovering);
  let x = texCoords[0] - 0.5;
  let y = texCoords[1] - 0.5;
  let selectionGlow = x * x * x * x + y * y * y * y;
  let tex = textureSample(inTexture, inSampler, texCoords);
  //if (tex.w < 0.9) {
   // discard;
  //}
  return color * textureSample(inTexture, inSampler, texCoords) + color * selected * 25.0 * selectionGlow * vec4f(0.5, 0.5, 0.5, 0.5);
}
