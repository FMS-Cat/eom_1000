(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"/Users/Yutaka/Dropbox/pro/_Projects/_eom/1000/src/script/cube-vertices.js":[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var b = [[-1, -1, 1], [0, 0, 1], [1, -1, 1], [0, 0, 1], [1, 1, 1], [0, 0, 1], [-1, -1, 1], [0, 0, 1], [1, 1, 1], [0, 0, 1], [-1, 1, 1], [0, 0, 1]];

var bm = function bm(_xRot, _yRot) {
  return b.reduce(function (_arr, _v, _i) {
    var x = b[_i][0];
    var y = b[_i][1];
    var z = b[_i][2];

    var zTemp = Math.cos(_yRot) * z - Math.sin(_yRot) * x;
    x = Math.sin(_yRot) * z + Math.cos(_yRot) * x;
    z = zTemp;

    var yTemp = Math.cos(_xRot) * y - Math.sin(_xRot) * z;
    z = Math.sin(_xRot) * y + Math.cos(_xRot) * z;
    y = yTemp;

    return _arr.concat([x, y, z, 0]);
  }, []);
};

var cubeVertices = function cubeVertices() {
  var a = bm(0.0, 0.0);
  a = a.concat(bm(0.0, Math.PI / 2.0));
  a = a.concat(bm(0.0, Math.PI));
  a = a.concat(bm(0.0, Math.PI / 2.0 * 3.0));
  a = a.concat(bm(Math.PI / 2.0, 0.0));
  a = a.concat(bm(-Math.PI / 2.0, 0.0));
  return a;
};

exports.default = cubeVertices();

},{}],"/Users/Yutaka/Dropbox/pro/_Projects/_eom/1000/src/script/glcat.js":[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () {
	function defineProperties(target, props) {
		for (var i = 0; i < props.length; i++) {
			var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
		}
	}return function (Constructor, protoProps, staticProps) {
		if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
	};
}();

function _classCallCheck(instance, Constructor) {
	if (!(instance instanceof Constructor)) {
		throw new TypeError("Cannot call a class as a function");
	}
}

var GLCat = function () {
	function GLCat(_gl) {
		_classCallCheck(this, GLCat);

		this.gl = _gl;
		var it = this;
		var gl = it.gl;

		gl.enable(gl.DEPTH_TEST);
		gl.depthFunc(gl.LEQUAL);
		gl.enable(gl.BLEND);
		gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

		gl.getExtension('OES_texture_float');
		gl.getExtension('OES_float_linear');
		gl.getExtension('OES_half_float_linear');

		it.program = null;
	}

	_createClass(GLCat, [{
		key: 'createProgram',
		value: function createProgram(_vert, _frag, _onError) {

			var it = this;
			var gl = it.gl;

			var error = void 0;
			if (typeof _onError === 'function') {
				error = _onError;
			} else {
				error = function error(_str) {
					console.error(_str);
				};
			}

			var vert = gl.createShader(gl.VERTEX_SHADER);
			gl.shaderSource(vert, _vert);
			gl.compileShader(vert);
			if (!gl.getShaderParameter(vert, gl.COMPILE_STATUS)) {
				error(gl.getShaderInfoLog(vert));
				return null;
			}

			var frag = gl.createShader(gl.FRAGMENT_SHADER);
			gl.shaderSource(frag, _frag);
			gl.compileShader(frag);
			if (!gl.getShaderParameter(frag, gl.COMPILE_STATUS)) {
				error(gl.getShaderInfoLog(frag));
				return null;
			}

			var program = gl.createProgram();
			gl.attachShader(program, vert);
			gl.attachShader(program, frag);
			gl.linkProgram(program);
			if (gl.getProgramParameter(program, gl.LINK_STATUS)) {
				program.locations = {};
				return program;
			} else {
				error(gl.getProgramInfoLog(program));
				return null;
			}
		}
	}, {
		key: 'useProgram',
		value: function useProgram(_program) {

			var it = this;
			var gl = it.gl;

			gl.useProgram(_program);
			it.program = _program;
		}
	}, {
		key: 'createVertexbuffer',
		value: function createVertexbuffer(_array) {

			var it = this;
			var gl = it.gl;

			var buffer = gl.createBuffer();

			gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
			gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(_array), gl.STATIC_DRAW);
			gl.bindBuffer(gl.ARRAY_BUFFER, null);

			buffer.length = _array.length;
			return buffer;
		}
	}, {
		key: 'createIndexbuffer',
		value: function createIndexbuffer(_array) {

			var it = this;
			var gl = it.gl;

			var buffer = gl.createBuffer();

			gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffer);
			gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Int16Array(_array), gl.STATIC_DRAW);
			gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);

			buffer.length = _array.length;
			return buffer;
		}
	}, {
		key: 'attribute',
		value: function attribute(_name, _buffer, _stride) {

			var it = this;
			var gl = it.gl;

			var location = void 0;
			if (it.program.locations[_name]) {
				location = it.program.locations[_name];
			} else {
				location = gl.getAttribLocation(it.program, _name);
				it.program.locations[_name] = location;
			}

			gl.bindBuffer(gl.ARRAY_BUFFER, _buffer);
			gl.enableVertexAttribArray(location);
			gl.vertexAttribPointer(location, _stride, gl.FLOAT, false, 0, 0);

			gl.bindBuffer(gl.ARRAY_BUFFER, null);
		}
	}, {
		key: 'getUniformLocation',
		value: function getUniformLocation(_name) {

			var it = this;
			var gl = it.gl;

			var location = void 0;

			if (it.program.locations[_name]) {
				location = it.program.locations[_name];
			} else {
				location = gl.getUniformLocation(it.program, _name);
				it.program.locations[_name] = location;
			}

			return location;
		}
	}, {
		key: 'uniform1i',
		value: function uniform1i(_name, _value) {

			var it = this;
			var gl = it.gl;

			var location = it.getUniformLocation(_name);
			gl.uniform1i(location, _value);
		}
	}, {
		key: 'uniform1f',
		value: function uniform1f(_name, _value) {

			var it = this;
			var gl = it.gl;

			var location = it.getUniformLocation(_name);
			gl.uniform1f(location, _value);
		}
	}, {
		key: 'uniform2fv',
		value: function uniform2fv(_name, _value) {

			var it = this;
			var gl = it.gl;

			var location = it.getUniformLocation(_name);
			gl.uniform2fv(location, _value);
		}
	}, {
		key: 'uniform3fv',
		value: function uniform3fv(_name, _value) {

			var it = this;
			var gl = it.gl;

			var location = it.getUniformLocation(_name);
			gl.uniform3fv(location, _value);
		}
	}, {
		key: 'uniformCubemap',
		value: function uniformCubemap(_name, _texture, _number) {

			var it = this;
			var gl = it.gl;

			var location = it.getUniformLocation(_name);
			gl.activeTexture(gl.TEXTURE0 + _number);
			gl.bindTexture(gl.TEXTURE_CUBE_MAP, _texture);
			gl.uniform1i(location, _number);
		}
	}, {
		key: 'uniformTexture',
		value: function uniformTexture(_name, _texture, _number) {

			var it = this;
			var gl = it.gl;

			var location = it.getUniformLocation(_name);
			gl.activeTexture(gl.TEXTURE0 + _number);
			gl.bindTexture(gl.TEXTURE_2D, _texture);
			gl.uniform1i(location, _number);
		}
	}, {
		key: 'createTexture',
		value: function createTexture() {

			var it = this;
			var gl = it.gl;

			var texture = gl.createTexture();
			gl.bindTexture(gl.TEXTURE_2D, texture);
			gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
			gl.bindTexture(gl.TEXTURE_2D, null);

			return texture;
		}
	}, {
		key: 'textureFilter',
		value: function textureFilter(_texture, _filter) {

			var it = this;
			var gl = it.gl;

			gl.bindTexture(gl.TEXTURE_2D, _texture);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, _filter);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, _filter);
			gl.bindTexture(gl.TEXTURE_2D, null);
		}
	}, {
		key: 'textureWrap',
		value: function textureWrap(_texture, _wrap) {

			var it = this;
			var gl = it.gl;

			gl.bindTexture(gl.TEXTURE_2D, _texture);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, _wrap);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, _wrap);
			gl.bindTexture(gl.TEXTURE_2D, null);
		}
	}, {
		key: 'setTexture',
		value: function setTexture(_texture, _image) {

			var it = this;
			var gl = it.gl;

			gl.bindTexture(gl.TEXTURE_2D, _texture);
			gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, _image);
			gl.bindTexture(gl.TEXTURE_2D, null);
		}
	}, {
		key: 'setTextureFromArray',
		value: function setTextureFromArray(_texture, _width, _height, _array) {

			var it = this;
			var gl = it.gl;

			gl.bindTexture(gl.TEXTURE_2D, _texture);
			gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, _width, _height, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array(_array));
			gl.bindTexture(gl.TEXTURE_2D, null);
		}
	}, {
		key: 'setTextureFromFloatArray',
		value: function setTextureFromFloatArray(_texture, _width, _height, _array) {

			var it = this;
			var gl = it.gl;

			gl.bindTexture(gl.TEXTURE_2D, _texture);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
			gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, _width, _height, 0, gl.RGBA, gl.FLOAT, new Float32Array(_array));
			gl.bindTexture(gl.TEXTURE_2D, null);
		}
	}, {
		key: 'copyTexture',
		value: function copyTexture(_texture, _width, _height) {

			var it = this;
			var gl = it.gl;

			gl.bindTexture(gl.TEXTURE_2D, _texture);
			gl.copyTexImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 0, 0, _width, _height, 0);
			gl.bindTexture(gl.TEXTURE_2D, null);
		}
	}, {
		key: 'createCubemap',
		value: function createCubemap(_arrayOfImage) {

			var it = this;
			var gl = it.gl;

			// order : X+, X-, Y+, Y-, Z+, Z-
			var texture = gl.createTexture();

			gl.bindTexture(gl.TEXTURE_CUBE_MAP, texture);
			for (var i = 0; i < 6; i++) {
				gl.texImage2D(gl.TEXTURE_CUBE_MAP_POSITIVE_X + i, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, _arrayOfImage[i]);
			}
			gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
			gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
			gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
			gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
			gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
			gl.bindTexture(gl.TEXTURE_CUBE_MAP, null);

			return texture;
		}
	}, {
		key: 'createFramebuffer',
		value: function createFramebuffer(_width, _height) {

			var it = this;
			var gl = it.gl;

			var framebuffer = gl.createFramebuffer();
			gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);

			framebuffer.depth = gl.createRenderbuffer();
			gl.bindRenderbuffer(gl.RENDERBUFFER, framebuffer.depth);
			gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, _width, _height);
			gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, framebuffer.depth);

			framebuffer.texture = it.createTexture();
			gl.bindTexture(gl.TEXTURE_2D, framebuffer.texture);
			gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, _width, _height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
			gl.bindTexture(gl.TEXTURE_2D, null);

			gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, framebuffer.texture, 0);
			gl.bindFramebuffer(gl.FRAMEBUFFER, null);

			return framebuffer;
		}
	}, {
		key: 'resizeFramebuffer',
		value: function resizeFramebuffer(_framebuffer, _width, _height) {

			var it = this;
			var gl = it.gl;

			gl.bindFramebuffer(gl.FRAMEBUFFER, _framebuffer);
			gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, _width, _height);
			gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, _width, _height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
			gl.bindFramebuffer(gl.FRAMEBUFFER, null);
		}
	}, {
		key: 'createFloatFramebuffer',
		value: function createFloatFramebuffer(_width, _height) {

			var it = this;
			var gl = it.gl;

			var framebuffer = gl.createFramebuffer();
			gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);

			framebuffer.depth = gl.createRenderbuffer();
			gl.bindRenderbuffer(gl.RENDERBUFFER, framebuffer.depth);
			gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, _width, _height);
			gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, framebuffer.depth);

			framebuffer.texture = it.createTexture();
			gl.bindTexture(gl.TEXTURE_2D, framebuffer.texture);
			gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, _width, _height, 0, gl.RGBA, gl.FLOAT, null);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
			gl.bindTexture(gl.TEXTURE_2D, null);

			gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, framebuffer.texture, 0);
			gl.bindFramebuffer(gl.FRAMEBUFFER, null);

			return framebuffer;
		}
	}, {
		key: 'resizeFloatFramebuffer',
		value: function resizeFloatFramebuffer(_framebuffer, _width, _height) {

			var it = this;
			var gl = it.gl;

			gl.bindFramebuffer(gl.FRAMEBUFFER, _framebuffer);
			gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, _width, _height);
			gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, _width, _height, 0, gl.RGBA, gl.FLOAT, null);
			gl.bindFramebuffer(gl.FRAMEBUFFER, null);
		}
	}, {
		key: 'clear',
		value: function clear(_r, _g, _b, _a, _d) {

			var it = this;
			var gl = it.gl;

			var r = _r || 0.0;
			var g = _g || 0.0;
			var b = _b || 0.0;
			var a = typeof _a === 'number' ? _a : 1.0;
			var d = typeof _d === 'number' ? _d : 1.0;

			gl.clearColor(r, g, b, a);
			gl.clearDepth(d);
			gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
		}
	}]);

	return GLCat;
}();

exports.default = GLCat;

},{}],"/Users/Yutaka/Dropbox/pro/_Projects/_eom/1000/src/script/main.js":[function(require,module,exports){
'use strict';

var _xorshift = require('./xorshift');

var _xorshift2 = _interopRequireDefault(_xorshift);

var _glcat = require('./glcat');

var _glcat2 = _interopRequireDefault(_glcat);

var _sphereRandom = require('./sphere-random');

var _sphereRandom2 = _interopRequireDefault(_sphereRandom);

var _word = require('./word');

var _word2 = _interopRequireDefault(_word);

var _cubeVertices = require('./cube-vertices');

var _cubeVertices2 = _interopRequireDefault(_cubeVertices);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }


(0, _xorshift2.default)(421458254021);

// ---

var clamp = function clamp(_value, _min, _max) {
  return Math.min(Math.max(_value, _min), _max);
};

var saturate = function saturate(_value) {
  return clamp(_value, 0.0, 1.0);
};

// ---

var width = canvas.width = 300;
var height = canvas.height = 300;
var gl = canvas.getContext('webgl');
var glCat = new _glcat2.default(gl);

var particleCountSqrt = 256;
var particleCount = particleCountSqrt * particleCountSqrt;

// ---

var vboQuad = glCat.createVertexbuffer([-1, -1, 1, -1, -1, 1, 1, 1]);
var vboCube = glCat.createVertexbuffer(function () {
  var a = [];
  for (var iy = 0; iy < particleCountSqrt; iy++) {
    for (var ix = 0; ix < particleCountSqrt; ix++) {
      for (var iz = 0; iz < 36; iz++) {
        a.push(ix);
        a.push(iy);
        a.push(iz);
      }
    }
  }
  return a;
}());

// ---

var vertQuad = "#define GLSLIFY 1\nattribute vec2 p;\n\nvoid main() {\n  gl_Position = vec4( p, 0.0, 1.0 );\n}\n";

var programReturn = glCat.createProgram(vertQuad, "precision highp float;\n#define GLSLIFY 1\n\nuniform vec2 resolution;\nuniform sampler2D texture;\n\nvoid main() {\n  vec2 uv = gl_FragCoord.xy / resolution;\n  gl_FragColor = texture2D( texture, uv );\n}\n");

var programParticleCompute = glCat.createProgram(vertQuad, "#define PI 3.14159265\n#define V vec2(0.,1.)\n#define saturate(i) clamp(i,0.,1.)\n\n// ---\n\nprecision highp float;\n#define GLSLIFY 1\n\nuniform float time;\nuniform float particleCountSqrt;\nuniform bool frameZero;\nuniform float deltaTime;\n\nuniform sampler2D textureParticle;\nuniform sampler2D textureRandom;\nuniform sampler2D textureWord;\nuniform sampler2D textureSphereRandom;\n\n// ---\n\nmat2 rotate2D( float _t ) {\n  return mat2( cos( _t ), sin( _t ), -sin( _t ), cos( _t ) );\n}\n\nvec3 rotateEuler( vec3 _p, vec3 _r ) {\n  vec3 p = _p;\n  p.yz = rotate2D( _r.x ) * p.yz;\n  p.zx = rotate2D( _r.y ) * p.zx;\n  p.xy = rotate2D( _r.z ) * p.xy;\n  return p;\n}\n\n//\n// Description : Array and textureless GLSL 2D/3D/4D simplex\n//               noise functions.\n//      Author : Ian McEwan, Ashima Arts.\n//  Maintainer : ijm\n//     Lastmod : 20110822 (ijm)\n//     License : Copyright (C) 2011 Ashima Arts. All rights reserved.\n//               Distributed under the MIT License. See LICENSE file.\n//               https://github.com/ashima/webgl-noise\n//\n\nvec4 mod289(vec4 x) {\n  return x - floor(x * (1.0 / 289.0)) * 289.0; }\n\nfloat mod289(float x) {\n  return x - floor(x * (1.0 / 289.0)) * 289.0; }\n\nvec4 permute(vec4 x) {\n     return mod289(((x*34.0)+1.0)*x);\n}\n\nfloat permute(float x) {\n     return mod289(((x*34.0)+1.0)*x);\n}\n\nvec4 taylorInvSqrt(vec4 r)\n{\n  return 1.79284291400159 - 0.85373472095314 * r;\n}\n\nfloat taylorInvSqrt(float r)\n{\n  return 1.79284291400159 - 0.85373472095314 * r;\n}\n\nvec4 grad4(float j, vec4 ip)\n  {\n  const vec4 ones = vec4(1.0, 1.0, 1.0, -1.0);\n  vec4 p,s;\n\n  p.xyz = floor( fract (vec3(j) * ip.xyz) * 7.0) * ip.z - 1.0;\n  p.w = 1.5 - dot(abs(p.xyz), ones.xyz);\n  s = vec4(lessThan(p, vec4(0.0)));\n  p.xyz = p.xyz + (s.xyz*2.0 - 1.0) * s.www;\n\n  return p;\n  }\n\n// (sqrt(5) - 1)/4 = F4, used once below\n#define F4 0.309016994374947451\n\nfloat snoise(vec4 v)\n  {\n  const vec4  C = vec4( 0.138196601125011,  // (5 - sqrt(5))/20  G4\n                        0.276393202250021,  // 2 * G4\n                        0.414589803375032,  // 3 * G4\n                       -0.447213595499958); // -1 + 4 * G4\n\n// First corner\n  vec4 i  = floor(v + dot(v, vec4(F4)) );\n  vec4 x0 = v -   i + dot(i, C.xxxx);\n\n// Other corners\n\n// Rank sorting originally contributed by Bill Licea-Kane, AMD (formerly ATI)\n  vec4 i0;\n  vec3 isX = step( x0.yzw, x0.xxx );\n  vec3 isYZ = step( x0.zww, x0.yyz );\n//  i0.x = dot( isX, vec3( 1.0 ) );\n  i0.x = isX.x + isX.y + isX.z;\n  i0.yzw = 1.0 - isX;\n//  i0.y += dot( isYZ.xy, vec2( 1.0 ) );\n  i0.y += isYZ.x + isYZ.y;\n  i0.zw += 1.0 - isYZ.xy;\n  i0.z += isYZ.z;\n  i0.w += 1.0 - isYZ.z;\n\n  // i0 now contains the unique values 0,1,2,3 in each channel\n  vec4 i3 = clamp( i0, 0.0, 1.0 );\n  vec4 i2 = clamp( i0-1.0, 0.0, 1.0 );\n  vec4 i1 = clamp( i0-2.0, 0.0, 1.0 );\n\n  //  x0 = x0 - 0.0 + 0.0 * C.xxxx\n  //  x1 = x0 - i1  + 1.0 * C.xxxx\n  //  x2 = x0 - i2  + 2.0 * C.xxxx\n  //  x3 = x0 - i3  + 3.0 * C.xxxx\n  //  x4 = x0 - 1.0 + 4.0 * C.xxxx\n  vec4 x1 = x0 - i1 + C.xxxx;\n  vec4 x2 = x0 - i2 + C.yyyy;\n  vec4 x3 = x0 - i3 + C.zzzz;\n  vec4 x4 = x0 + C.wwww;\n\n// Permutations\n  i = mod289(i);\n  float j0 = permute( permute( permute( permute(i.w) + i.z) + i.y) + i.x);\n  vec4 j1 = permute( permute( permute( permute (\n             i.w + vec4(i1.w, i2.w, i3.w, 1.0 ))\n           + i.z + vec4(i1.z, i2.z, i3.z, 1.0 ))\n           + i.y + vec4(i1.y, i2.y, i3.y, 1.0 ))\n           + i.x + vec4(i1.x, i2.x, i3.x, 1.0 ));\n\n// Gradients: 7x7x6 points over a cube, mapped onto a 4-cross polytope\n// 7*7*6 = 294, which is close to the ring size 17*17 = 289.\n  vec4 ip = vec4(1.0/294.0, 1.0/49.0, 1.0/7.0, 0.0) ;\n\n  vec4 p0 = grad4(j0,   ip);\n  vec4 p1 = grad4(j1.x, ip);\n  vec4 p2 = grad4(j1.y, ip);\n  vec4 p3 = grad4(j1.z, ip);\n  vec4 p4 = grad4(j1.w, ip);\n\n// Normalise gradients\n  vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));\n  p0 *= norm.x;\n  p1 *= norm.y;\n  p2 *= norm.z;\n  p3 *= norm.w;\n  p4 *= taylorInvSqrt(dot(p4,p4));\n\n// Mix contributions from the five corners\n  vec3 m0 = max(0.6 - vec3(dot(x0,x0), dot(x1,x1), dot(x2,x2)), 0.0);\n  vec2 m1 = max(0.6 - vec2(dot(x3,x3), dot(x4,x4)            ), 0.0);\n  m0 = m0 * m0;\n  m1 = m1 * m1;\n  return 49.0 * ( dot(m0*m0, vec3( dot( p0, x0 ), dot( p1, x1 ), dot( p2, x2 )))\n               + dot(m1*m1, vec2( dot( p3, x3 ), dot( p4, x4 ) ) ) ) ;\n\n  }\n\n// ---\n\nvoid main() {\n  vec2 reso = vec2( 4.0, 1.0 ) * particleCountSqrt;\n\n  float type = mod( floor( gl_FragCoord.x ), 4.0 );\n  vec2 uv = gl_FragCoord.xy;\n  uv.x += -type + 1.5;\n  uv /= reso;\n\n  vec4 pos = texture2D( textureParticle, ( gl_FragCoord.xy + vec2( 0.0 - type, 0.0 ) ) / reso );\n  vec4 vel = texture2D( textureParticle, ( gl_FragCoord.xy + vec2( 1.0 - type, 0.0 ) ) / reso );\n  vec4 rot = texture2D( textureParticle, ( gl_FragCoord.xy + vec2( 2.0 - type, 0.0 ) ) / reso );\n  vec4 col = texture2D( textureParticle, ( gl_FragCoord.xy + vec2( 3.0 - type, 0.0 ) ) / reso );\n\n  if ( frameZero ) {\n    vec4 posI = texture2D( textureWord, uv );\n    pos = posI;\n    pos.x -= 0.03;\n\n    vel = 0.0 * texture2D( textureSphereRandom, uv );\n    vel.w = texture2D( textureRandom, ( gl_FragCoord.xy + vec2( 1.0 - type, 0.0 ) ) / reso ).w;\n\n    vec4 rotI = texture2D( textureRandom, ( gl_FragCoord.xy + vec2( 2.0 - type, 0.0 ) ) / reso );\n\n    // rot.xyz -= 0.5;\n    float rotMax = max( max( abs( rot.x ), abs( rot.y ) ), abs( rot.z ) );\n    if ( abs( rot.x ) == rotMax ) { rot.y = 0.0; rot.z = 0.0; }\n    if ( abs( rot.y ) == rotMax ) { rot.z = 0.0; rot.x = 0.0; }\n    if ( abs( rot.z ) == rotMax ) { rot.x = 0.0; rot.y = 0.0; }\n    rot.w = 1.0;\n\n    vec4 colI = texture2D( textureRandom, ( gl_FragCoord.xy + vec2( 3.0 - type, 0.0 ) ) / reso );\n    col = colI;\n\n    col.xyz -= 0.5;\n    float colMax = max( max( abs( col.x ), abs( col.y ) ), abs( col.z ) );\n    if ( abs( col.x ) == colMax ) { col.y = 0.0; col.z = 0.0; }\n    if ( abs( col.y ) == colMax ) { col.z = 0.0; col.x = 0.0; }\n    if ( abs( col.z ) == colMax ) { col.x = 0.0; col.y = 0.0; }\n\n    col.w = pow( col.w, 40.0 ) * 0.04;\n  }\n\n  if ( time < 0.5 ) {\n    rot.xyz *= exp( -deltaTime * 6.0 );\n    rot.w *= exp( -deltaTime * 6.0 );\n\n    if ( 0.2 < time ) {\n      col.xyz *= exp( -deltaTime * 6.0 );\n      col.w = mix(\n        0.01,\n        col.w,\n        exp( -deltaTime * 6.0 )\n      );\n    }\n  } else {\n    float speedMul = time < 0.65 ? 0.4 : 0.1 + pow( ( time - 0.45 ) * 3.0, 2.0 );\n    float speedMul2 = time < 0.65 ? 0.7 : 0.1;\n\n    pos += vel * speedMul2 * deltaTime;\n    pos.w *= exp( -deltaTime * speedMul * 2.0 );\n    pos.yz = rotate2D( speedMul2 * deltaTime * -6.0 ) * pos.yz;\n\n    vel.xyz += vec3(\n      snoise( vec4( pos.xyz * 3.0, 55.16 ) ),\n      snoise( vec4( pos.xyz * 3.0, 66.12 ) ),\n      snoise( vec4( pos.xyz * 3.0, 33.43 ) )\n    ) * speedMul2 * 9.0 * deltaTime;\n    vel.yz = rotate2D( speedMul * deltaTime * -6.0 ) * vel.yz;\n\n    vel.xyz += -pos.xyz * speedMul2 * 1.0 * deltaTime;\n\n    vel *= exp( -deltaTime );\n\n    rot.zw = texture2D( textureRandom, ( gl_FragCoord.xy + vec2( 2.0 - type, 0.0 ) ) / reso ).zw - 0.5;\n    rot.xy += rot.zw * deltaTime;\n  }\n\n  vec4 ret;\n  if ( type == 0.0 ) {\n    ret = pos;\n  } else if ( type == 1.0 ) {\n    ret = vel;\n  } else if ( type == 2.0 ) {\n    ret = rot;\n  } else if ( type == 3.0 ) {\n    ret = col;\n  }\n\n  gl_FragColor = ret;\n}\n");

var programMotionblur = glCat.createProgram(vertQuad, "precision highp float;\n#define GLSLIFY 1\n\nuniform bool init;\nuniform float add;\nuniform vec2 resolution;\nuniform sampler2D renderTexture;\nuniform sampler2D blurTexture;\n\nvoid main() {\n  vec2 uv = gl_FragCoord.xy / resolution;\n  vec3 ret = texture2D( renderTexture, uv ).xyz * add;\n  if ( !init ) {\n    ret += texture2D( blurTexture, uv ).xyz;\n  }\n  gl_FragColor = vec4( ret, 1.0 );\n}\n");

var programPost = glCat.createProgram(vertQuad, "#define V vec2(0.,1.)\n\n#define PI 3.14159265\n\nprecision highp float;\n#define GLSLIFY 1\n\nuniform float time;\nuniform vec2 resolution;\nuniform sampler2D texture;\nuniform sampler2D textureRandom;\n\nvoid main() {\n  vec2 uv = gl_FragCoord.xy / resolution;\n\n  vec3 rnd = texture2D( textureRandom, floor( uv * V.yy * 120.0 ) / 120.0 * V.xy ).xyz;\n\n  vec3 ret = V.xxx;\n\n  float amp = 0.3 * pow( max( 0.0, time - 0.6 ), 2.0 );\n  ret.x = texture2D( texture, uv + V.yx * sin( time + rnd.x * 190.0 ) * amp ).x;\n  ret.y = texture2D( texture, uv + V.yx * sin( time + rnd.y * 190.0 ) * amp ).y;\n  ret.z = texture2D( texture, uv + V.yx * sin( time + rnd.z * 190.0 ) * amp ).z;\n\n  ret *= 1.0 - length( uv - 0.5 ) * 0.2;\n\n  gl_FragColor = vec4( ret, 1.0 );\n}\n");

var programParticleRender = glCat.createProgram("#define GLSLIFY 1\n#define PI 3.14159265\n#define V vec2(0.,1.)\n\n// ---\n\nattribute vec3 uv;\n\nvarying vec3 vPos;\nvarying vec3 vCol;\nvarying vec3 vNormal;\nvarying float vVelw;\nvarying float vLightDist;\nvarying vec2 vTextureShadowCoord;\n\nuniform float time;\nuniform vec2 resolution;\nuniform float particleCountSqrt;\nuniform vec3 u_cameraPos;\nuniform vec3 u_lightPos;\n\nuniform sampler2D textureParticle;\nuniform sampler2D textureCube;\n\n// ---\n\nmat4 lookAt( vec3 _pos, vec3 _tar, vec3 _air ) {\n  vec3 dir = normalize( _tar - _pos );\n  vec3 sid = normalize( cross( dir, _air ) );\n  vec3 top = normalize( cross( sid, dir ) );\n  return mat4(\n    sid.x, top.x, dir.x, 0.0,\n    sid.y, top.y, dir.y, 0.0,\n    sid.z, top.z, dir.z, 0.0,\n    - sid.x * _pos.x - sid.y * _pos.y - sid.z * _pos.z,\n    - top.x * _pos.x - top.y * _pos.y - top.z * _pos.z,\n    - dir.x * _pos.x - dir.y * _pos.y - dir.z * _pos.z,\n    1.0\n  );\n}\n\nmat4 perspective( float _fov, float _aspect, float _near, float _far ) {\n  float p = 1.0 / tan( _fov * PI / 180.0 / 2.0 );\n  float d = _far / ( _far - _near );\n  return mat4(\n    p / _aspect, 0.0, 0.0, 0.0,\n    0.0, p, 0.0, 0.0,\n    0.0, 0.0, d, 1.0,\n    0.0, 0.0, -_near * d, 0.0\n  );\n}\n\nmat2 rotate2D( float _theta ) {\n  return mat2( cos( _theta ), sin( _theta ), -sin( _theta ), cos( _theta ) );\n}\n\n//\n// Description : Array and textureless GLSL 2D/3D/4D simplex\n//               noise functions.\n//      Author : Ian McEwan, Ashima Arts.\n//  Maintainer : ijm\n//     Lastmod : 20110822 (ijm)\n//     License : Copyright (C) 2011 Ashima Arts. All rights reserved.\n//               Distributed under the MIT License. See LICENSE file.\n//               https://github.com/ashima/webgl-noise\n//\n\nvec4 mod289(vec4 x) {\n  return x - floor(x * (1.0 / 289.0)) * 289.0; }\n\nfloat mod289(float x) {\n  return x - floor(x * (1.0 / 289.0)) * 289.0; }\n\nvec4 permute(vec4 x) {\n     return mod289(((x*34.0)+1.0)*x);\n}\n\nfloat permute(float x) {\n     return mod289(((x*34.0)+1.0)*x);\n}\n\nvec4 taylorInvSqrt(vec4 r)\n{\n  return 1.79284291400159 - 0.85373472095314 * r;\n}\n\nfloat taylorInvSqrt(float r)\n{\n  return 1.79284291400159 - 0.85373472095314 * r;\n}\n\nvec4 grad4(float j, vec4 ip)\n  {\n  const vec4 ones = vec4(1.0, 1.0, 1.0, -1.0);\n  vec4 p,s;\n\n  p.xyz = floor( fract (vec3(j) * ip.xyz) * 7.0) * ip.z - 1.0;\n  p.w = 1.5 - dot(abs(p.xyz), ones.xyz);\n  s = vec4(lessThan(p, vec4(0.0)));\n  p.xyz = p.xyz + (s.xyz*2.0 - 1.0) * s.www;\n\n  return p;\n  }\n\n// (sqrt(5) - 1)/4 = F4, used once below\n#define F4 0.309016994374947451\n\nfloat snoise(vec4 v)\n  {\n  const vec4  C = vec4( 0.138196601125011,  // (5 - sqrt(5))/20  G4\n                        0.276393202250021,  // 2 * G4\n                        0.414589803375032,  // 3 * G4\n                       -0.447213595499958); // -1 + 4 * G4\n\n// First corner\n  vec4 i  = floor(v + dot(v, vec4(F4)) );\n  vec4 x0 = v -   i + dot(i, C.xxxx);\n\n// Other corners\n\n// Rank sorting originally contributed by Bill Licea-Kane, AMD (formerly ATI)\n  vec4 i0;\n  vec3 isX = step( x0.yzw, x0.xxx );\n  vec3 isYZ = step( x0.zww, x0.yyz );\n//  i0.x = dot( isX, vec3( 1.0 ) );\n  i0.x = isX.x + isX.y + isX.z;\n  i0.yzw = 1.0 - isX;\n//  i0.y += dot( isYZ.xy, vec2( 1.0 ) );\n  i0.y += isYZ.x + isYZ.y;\n  i0.zw += 1.0 - isYZ.xy;\n  i0.z += isYZ.z;\n  i0.w += 1.0 - isYZ.z;\n\n  // i0 now contains the unique values 0,1,2,3 in each channel\n  vec4 i3 = clamp( i0, 0.0, 1.0 );\n  vec4 i2 = clamp( i0-1.0, 0.0, 1.0 );\n  vec4 i1 = clamp( i0-2.0, 0.0, 1.0 );\n\n  //  x0 = x0 - 0.0 + 0.0 * C.xxxx\n  //  x1 = x0 - i1  + 1.0 * C.xxxx\n  //  x2 = x0 - i2  + 2.0 * C.xxxx\n  //  x3 = x0 - i3  + 3.0 * C.xxxx\n  //  x4 = x0 - 1.0 + 4.0 * C.xxxx\n  vec4 x1 = x0 - i1 + C.xxxx;\n  vec4 x2 = x0 - i2 + C.yyyy;\n  vec4 x3 = x0 - i3 + C.zzzz;\n  vec4 x4 = x0 + C.wwww;\n\n// Permutations\n  i = mod289(i);\n  float j0 = permute( permute( permute( permute(i.w) + i.z) + i.y) + i.x);\n  vec4 j1 = permute( permute( permute( permute (\n             i.w + vec4(i1.w, i2.w, i3.w, 1.0 ))\n           + i.z + vec4(i1.z, i2.z, i3.z, 1.0 ))\n           + i.y + vec4(i1.y, i2.y, i3.y, 1.0 ))\n           + i.x + vec4(i1.x, i2.x, i3.x, 1.0 ));\n\n// Gradients: 7x7x6 points over a cube, mapped onto a 4-cross polytope\n// 7*7*6 = 294, which is close to the ring size 17*17 = 289.\n  vec4 ip = vec4(1.0/294.0, 1.0/49.0, 1.0/7.0, 0.0) ;\n\n  vec4 p0 = grad4(j0,   ip);\n  vec4 p1 = grad4(j1.x, ip);\n  vec4 p2 = grad4(j1.y, ip);\n  vec4 p3 = grad4(j1.z, ip);\n  vec4 p4 = grad4(j1.w, ip);\n\n// Normalise gradients\n  vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));\n  p0 *= norm.x;\n  p1 *= norm.y;\n  p2 *= norm.z;\n  p3 *= norm.w;\n  p4 *= taylorInvSqrt(dot(p4,p4));\n\n// Mix contributions from the five corners\n  vec3 m0 = max(0.6 - vec3(dot(x0,x0), dot(x1,x1), dot(x2,x2)), 0.0);\n  vec2 m1 = max(0.6 - vec2(dot(x3,x3), dot(x4,x4)            ), 0.0);\n  m0 = m0 * m0;\n  m1 = m1 * m1;\n  return 49.0 * ( dot(m0*m0, vec3( dot( p0, x0 ), dot( p1, x1 ), dot( p2, x2 )))\n               + dot(m1*m1, vec2( dot( p3, x3 ), dot( p4, x4 ) ) ) ) ;\n\n  }\n\n// ---\n\nvoid main() {\n  vec4 pos = texture2D( textureParticle, ( uv.xy * vec2( 4.0, 1.0 ) + vec2( 0.5, 0.5 ) ) / vec2( 4.0, 1.0 ) / particleCountSqrt );\n  vec4 vel = texture2D( textureParticle, ( uv.xy * vec2( 4.0, 1.0 ) + vec2( 1.5, 0.5 ) ) / vec2( 4.0, 1.0 ) / particleCountSqrt );\n  vec4 rot = texture2D( textureParticle, ( uv.xy * vec2( 4.0, 1.0 ) + vec2( 2.5, 0.5 ) ) / vec2( 4.0, 1.0 ) / particleCountSqrt );\n  vec4 col = texture2D( textureParticle, ( uv.xy * vec2( 4.0, 1.0 ) + vec2( 3.5, 0.5 ) ) / vec2( 4.0, 1.0 ) / particleCountSqrt );\n\n  mat4 matP = perspective( 40.0, resolution.x / resolution.y, 0.01, 100.0 );\n  vec3 cameraPos = u_cameraPos;\n  mat4 matV = lookAt( cameraPos, vec3( 0.0, 0.0, 0.0 ), vec3( 0.0, 1.0, 0.0 ) );\n\n  vec3 cubeVert = texture2D( textureCube, vec2( 0.5 / 2.0, ( uv.z + 0.5 ) / 36.0 ) ).xyz;\n  cubeVert.yz = rotate2D( rot.x ) * cubeVert.yz;\n  cubeVert.zx = rotate2D( rot.y ) * cubeVert.zx;\n\n  float size = pos.w;\n  size *= time < 0.5 ? ( 1.0 - rot.w ) : 1.0;\n  size *= col.w;\n  pos.xyz += cubeVert * size;\n  pos.xyz += time < 0.5 ? rot.xyz : V.xxx;\n  pos.xyz += col.xyz;\n\n  float startRot = exp( -max( 0.0, time - 0.2 ) * 20.0 );\n  float endRot = 1.0 - exp( -max( 0.0, time - 0.5 ) * 20.0 );\n  pos.xy = rotate2D( -startRot * PI / 4.0 ) * pos.xy;\n  pos.z += startRot * 0.5;\n  pos.xy = rotate2D( endRot * 0.4 ) * pos.xy;\n  pos.zx = rotate2D( endRot * 0.4 ) * pos.zx;\n\n  vNormal = texture2D( textureCube, vec2( 1.5 / 2.0, ( uv.z + 0.5 ) / 36.0 ) ).xyz;\n  vNormal.yz = rotate2D( rot.x ) * vNormal.yz;\n  vNormal.zx = rotate2D( rot.y ) * vNormal.zx;\n  vNormal = ( matV * vec4( vNormal, 0.0 ) ).xyz;\n\n  gl_Position = (\n    matP\n    * matV\n    * vec4( pos.xyz, 1.0 )\n  );\n\n  vec4 posFromLight = (\n    matP\n    * lookAt( u_lightPos, vec3( 0.0, 0.0, 0.0 ), vec3( 0.0, 1.0, 0.0 ) )\n    * vec4( pos.xyz, 1.0 )\n  );\n  vTextureShadowCoord = posFromLight.xy / posFromLight.w;\n\n  vLightDist = length( u_lightPos - pos.xyz );\n  vPos = pos.xyz;\n  vCol = col.xyz;\n  vVelw = vel.w;\n}\n", "#define PI 3.14159265\n#define saturate(i) clamp(i,0.,1.)\n#define V vec2(0.,1.)\n\n#define SHADOW_EPSILON 0.04\n\n// ---\n\nprecision highp float;\n#define GLSLIFY 1\n\nvarying vec3 vPos;\nvarying vec3 vCol;\nvarying vec3 vNormal;\nvarying float vLightDist;\nvarying vec2 vTextureShadowCoord;\n\nuniform vec2 resolution;\nuniform vec3 u_cameraPos;\nuniform vec3 u_lightPos;\n\nuniform sampler2D textureShadow;\n\n// ---\n\nvoid main() {\n  float dist = length( u_cameraPos - vPos );\n  float decay = exp( -dist * 4E-2 );\n  vec3 ligDir = normalize( vPos - u_lightPos );\n  float dif = saturate( dot( vNormal, ligDir ) ) * 0.9 + 0.1;\n\n  float shadow = 1.0;\n  vec4 proj = texture2D( textureShadow, vTextureShadowCoord.xy * 0.5 + 0.5 );\n  if ( proj.y < 0.5 && proj.x + SHADOW_EPSILON < vLightDist ) {\n    shadow = 0.7;\n  }\n\n  gl_FragColor = vec4( mix(\n    V.xxx,\n    V.yyy * dif * shadow,\n    decay\n  ), 1.0 );\n}\n");

var programParticleRenderShadow = glCat.createProgram("#define GLSLIFY 1\n#define PI 3.14159265\n#define V vec2(0.,1.)\n\n// ---\n\nattribute vec3 uv;\n\nvarying vec3 vPos;\nvarying vec3 vCol;\nvarying vec3 vNormal;\nvarying float vVelw;\nvarying float vLightDist;\nvarying vec2 vTextureShadowCoord;\n\nuniform float time;\nuniform vec2 resolution;\nuniform float particleCountSqrt;\nuniform vec3 u_cameraPos;\nuniform vec3 u_lightPos;\n\nuniform sampler2D textureParticle;\nuniform sampler2D textureCube;\n\n// ---\n\nmat4 lookAt( vec3 _pos, vec3 _tar, vec3 _air ) {\n  vec3 dir = normalize( _tar - _pos );\n  vec3 sid = normalize( cross( dir, _air ) );\n  vec3 top = normalize( cross( sid, dir ) );\n  return mat4(\n    sid.x, top.x, dir.x, 0.0,\n    sid.y, top.y, dir.y, 0.0,\n    sid.z, top.z, dir.z, 0.0,\n    - sid.x * _pos.x - sid.y * _pos.y - sid.z * _pos.z,\n    - top.x * _pos.x - top.y * _pos.y - top.z * _pos.z,\n    - dir.x * _pos.x - dir.y * _pos.y - dir.z * _pos.z,\n    1.0\n  );\n}\n\nmat4 perspective( float _fov, float _aspect, float _near, float _far ) {\n  float p = 1.0 / tan( _fov * PI / 180.0 / 2.0 );\n  float d = _far / ( _far - _near );\n  return mat4(\n    p / _aspect, 0.0, 0.0, 0.0,\n    0.0, p, 0.0, 0.0,\n    0.0, 0.0, d, 1.0,\n    0.0, 0.0, -_near * d, 0.0\n  );\n}\n\nmat2 rotate2D( float _theta ) {\n  return mat2( cos( _theta ), sin( _theta ), -sin( _theta ), cos( _theta ) );\n}\n\n//\n// Description : Array and textureless GLSL 2D/3D/4D simplex\n//               noise functions.\n//      Author : Ian McEwan, Ashima Arts.\n//  Maintainer : ijm\n//     Lastmod : 20110822 (ijm)\n//     License : Copyright (C) 2011 Ashima Arts. All rights reserved.\n//               Distributed under the MIT License. See LICENSE file.\n//               https://github.com/ashima/webgl-noise\n//\n\nvec4 mod289(vec4 x) {\n  return x - floor(x * (1.0 / 289.0)) * 289.0; }\n\nfloat mod289(float x) {\n  return x - floor(x * (1.0 / 289.0)) * 289.0; }\n\nvec4 permute(vec4 x) {\n     return mod289(((x*34.0)+1.0)*x);\n}\n\nfloat permute(float x) {\n     return mod289(((x*34.0)+1.0)*x);\n}\n\nvec4 taylorInvSqrt(vec4 r)\n{\n  return 1.79284291400159 - 0.85373472095314 * r;\n}\n\nfloat taylorInvSqrt(float r)\n{\n  return 1.79284291400159 - 0.85373472095314 * r;\n}\n\nvec4 grad4(float j, vec4 ip)\n  {\n  const vec4 ones = vec4(1.0, 1.0, 1.0, -1.0);\n  vec4 p,s;\n\n  p.xyz = floor( fract (vec3(j) * ip.xyz) * 7.0) * ip.z - 1.0;\n  p.w = 1.5 - dot(abs(p.xyz), ones.xyz);\n  s = vec4(lessThan(p, vec4(0.0)));\n  p.xyz = p.xyz + (s.xyz*2.0 - 1.0) * s.www;\n\n  return p;\n  }\n\n// (sqrt(5) - 1)/4 = F4, used once below\n#define F4 0.309016994374947451\n\nfloat snoise(vec4 v)\n  {\n  const vec4  C = vec4( 0.138196601125011,  // (5 - sqrt(5))/20  G4\n                        0.276393202250021,  // 2 * G4\n                        0.414589803375032,  // 3 * G4\n                       -0.447213595499958); // -1 + 4 * G4\n\n// First corner\n  vec4 i  = floor(v + dot(v, vec4(F4)) );\n  vec4 x0 = v -   i + dot(i, C.xxxx);\n\n// Other corners\n\n// Rank sorting originally contributed by Bill Licea-Kane, AMD (formerly ATI)\n  vec4 i0;\n  vec3 isX = step( x0.yzw, x0.xxx );\n  vec3 isYZ = step( x0.zww, x0.yyz );\n//  i0.x = dot( isX, vec3( 1.0 ) );\n  i0.x = isX.x + isX.y + isX.z;\n  i0.yzw = 1.0 - isX;\n//  i0.y += dot( isYZ.xy, vec2( 1.0 ) );\n  i0.y += isYZ.x + isYZ.y;\n  i0.zw += 1.0 - isYZ.xy;\n  i0.z += isYZ.z;\n  i0.w += 1.0 - isYZ.z;\n\n  // i0 now contains the unique values 0,1,2,3 in each channel\n  vec4 i3 = clamp( i0, 0.0, 1.0 );\n  vec4 i2 = clamp( i0-1.0, 0.0, 1.0 );\n  vec4 i1 = clamp( i0-2.0, 0.0, 1.0 );\n\n  //  x0 = x0 - 0.0 + 0.0 * C.xxxx\n  //  x1 = x0 - i1  + 1.0 * C.xxxx\n  //  x2 = x0 - i2  + 2.0 * C.xxxx\n  //  x3 = x0 - i3  + 3.0 * C.xxxx\n  //  x4 = x0 - 1.0 + 4.0 * C.xxxx\n  vec4 x1 = x0 - i1 + C.xxxx;\n  vec4 x2 = x0 - i2 + C.yyyy;\n  vec4 x3 = x0 - i3 + C.zzzz;\n  vec4 x4 = x0 + C.wwww;\n\n// Permutations\n  i = mod289(i);\n  float j0 = permute( permute( permute( permute(i.w) + i.z) + i.y) + i.x);\n  vec4 j1 = permute( permute( permute( permute (\n             i.w + vec4(i1.w, i2.w, i3.w, 1.0 ))\n           + i.z + vec4(i1.z, i2.z, i3.z, 1.0 ))\n           + i.y + vec4(i1.y, i2.y, i3.y, 1.0 ))\n           + i.x + vec4(i1.x, i2.x, i3.x, 1.0 ));\n\n// Gradients: 7x7x6 points over a cube, mapped onto a 4-cross polytope\n// 7*7*6 = 294, which is close to the ring size 17*17 = 289.\n  vec4 ip = vec4(1.0/294.0, 1.0/49.0, 1.0/7.0, 0.0) ;\n\n  vec4 p0 = grad4(j0,   ip);\n  vec4 p1 = grad4(j1.x, ip);\n  vec4 p2 = grad4(j1.y, ip);\n  vec4 p3 = grad4(j1.z, ip);\n  vec4 p4 = grad4(j1.w, ip);\n\n// Normalise gradients\n  vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));\n  p0 *= norm.x;\n  p1 *= norm.y;\n  p2 *= norm.z;\n  p3 *= norm.w;\n  p4 *= taylorInvSqrt(dot(p4,p4));\n\n// Mix contributions from the five corners\n  vec3 m0 = max(0.6 - vec3(dot(x0,x0), dot(x1,x1), dot(x2,x2)), 0.0);\n  vec2 m1 = max(0.6 - vec2(dot(x3,x3), dot(x4,x4)            ), 0.0);\n  m0 = m0 * m0;\n  m1 = m1 * m1;\n  return 49.0 * ( dot(m0*m0, vec3( dot( p0, x0 ), dot( p1, x1 ), dot( p2, x2 )))\n               + dot(m1*m1, vec2( dot( p3, x3 ), dot( p4, x4 ) ) ) ) ;\n\n  }\n\n// ---\n\nvoid main() {\n  vec4 pos = texture2D( textureParticle, ( uv.xy * vec2( 4.0, 1.0 ) + vec2( 0.5, 0.5 ) ) / vec2( 4.0, 1.0 ) / particleCountSqrt );\n  vec4 vel = texture2D( textureParticle, ( uv.xy * vec2( 4.0, 1.0 ) + vec2( 1.5, 0.5 ) ) / vec2( 4.0, 1.0 ) / particleCountSqrt );\n  vec4 rot = texture2D( textureParticle, ( uv.xy * vec2( 4.0, 1.0 ) + vec2( 2.5, 0.5 ) ) / vec2( 4.0, 1.0 ) / particleCountSqrt );\n  vec4 col = texture2D( textureParticle, ( uv.xy * vec2( 4.0, 1.0 ) + vec2( 3.5, 0.5 ) ) / vec2( 4.0, 1.0 ) / particleCountSqrt );\n\n  mat4 matP = perspective( 40.0, resolution.x / resolution.y, 0.01, 100.0 );\n  vec3 cameraPos = u_cameraPos;\n  mat4 matV = lookAt( cameraPos, vec3( 0.0, 0.0, 0.0 ), vec3( 0.0, 1.0, 0.0 ) );\n\n  vec3 cubeVert = texture2D( textureCube, vec2( 0.5 / 2.0, ( uv.z + 0.5 ) / 36.0 ) ).xyz;\n  cubeVert.yz = rotate2D( rot.x ) * cubeVert.yz;\n  cubeVert.zx = rotate2D( rot.y ) * cubeVert.zx;\n\n  float size = pos.w;\n  size *= time < 0.5 ? ( 1.0 - rot.w ) : 1.0;\n  size *= col.w;\n  pos.xyz += cubeVert * size;\n  pos.xyz += time < 0.5 ? rot.xyz : V.xxx;\n  pos.xyz += col.xyz;\n\n  float startRot = exp( -max( 0.0, time - 0.2 ) * 20.0 );\n  float endRot = 1.0 - exp( -max( 0.0, time - 0.5 ) * 20.0 );\n  pos.xy = rotate2D( -startRot * PI / 4.0 ) * pos.xy;\n  pos.z += startRot * 0.5;\n  pos.xy = rotate2D( endRot * 0.4 ) * pos.xy;\n  pos.zx = rotate2D( endRot * 0.4 ) * pos.zx;\n\n  vNormal = texture2D( textureCube, vec2( 1.5 / 2.0, ( uv.z + 0.5 ) / 36.0 ) ).xyz;\n  vNormal.yz = rotate2D( rot.x ) * vNormal.yz;\n  vNormal.zx = rotate2D( rot.y ) * vNormal.zx;\n  vNormal = ( matV * vec4( vNormal, 0.0 ) ).xyz;\n\n  gl_Position = (\n    matP\n    * matV\n    * vec4( pos.xyz, 1.0 )\n  );\n\n  vec4 posFromLight = (\n    matP\n    * lookAt( u_lightPos, vec3( 0.0, 0.0, 0.0 ), vec3( 0.0, 1.0, 0.0 ) )\n    * vec4( pos.xyz, 1.0 )\n  );\n  vTextureShadowCoord = posFromLight.xy / posFromLight.w;\n\n  vLightDist = length( u_lightPos - pos.xyz );\n  vPos = pos.xyz;\n  vCol = col.xyz;\n  vVelw = vel.w;\n}\n", "#define PI 3.14159265\n#define saturate(i) clamp(i,0.,1.)\n#define V vec2(0.,1.)\n\n// ---\n\nprecision highp float;\n#define GLSLIFY 1\n\nvarying float vLightDist;\n\n// ---\n\nvoid main() {\n  gl_FragColor = vec4(\n    vLightDist,\n    0.0,\n    0.0,\n    1.0\n  );\n}\n");

// ---

var framebufferParticleCompute = glCat.createFloatFramebuffer(particleCountSqrt * 4, particleCountSqrt);
var framebufferParticleComputeReturn = glCat.createFloatFramebuffer(particleCountSqrt * 4, particleCountSqrt);

var shadowSize = 2048;
var framebufferParticleShadow = glCat.createFloatFramebuffer(shadowSize, shadowSize);
var framebufferParticleRender = glCat.createFloatFramebuffer(width, height);

var framebufferMotionblur = glCat.createFloatFramebuffer(width, height);
var framebufferMotionblurReturn = glCat.createFloatFramebuffer(width, height);

// ---

var textureRandomSize = 2048;
var textureRandom = glCat.createTexture();
glCat.textureWrap(textureRandom, gl.REPEAT);
glCat.setTextureFromFloatArray(textureRandom, textureRandomSize, textureRandomSize, function () {
  var len = textureRandomSize * textureRandomSize * 4;
  var ret = new Float32Array(len);

  for (var iArr = 0; iArr < len; iArr++) {
    ret[iArr] = (0, _xorshift2.default)();
  }

  return ret;
}());

var textureWord = glCat.createTexture();
glCat.textureWrap(textureWord, gl.REPEAT);
glCat.setTextureFromFloatArray(textureWord, particleCountSqrt, particleCountSqrt, (0, _word2.default)(particleCount));

var textureSphereRandom = glCat.createTexture();
glCat.textureWrap(textureSphereRandom, gl.REPEAT);
glCat.setTextureFromFloatArray(textureSphereRandom, particleCountSqrt, particleCountSqrt, (0, _sphereRandom2.default)(particleCount));

var textureCube = glCat.createTexture();
glCat.setTextureFromFloatArray(textureCube, 2, 36, _cubeVertices2.default);

// ---

var frame = 0;
var frames = 150;
var blurSample = 40;
var time = 0.0;
var stop = false;

// ---

var cameraPos = [0.0, 0.0, 2.5];
var lightPos = [1.0 * 0.6, 2.0 * 0.6, 3.0 * 0.6];

// ---

var render = function render(_deltaTime, _iSample, _nSample) {
  {
    // return compute particle texture
    gl.viewport(0, 0, particleCountSqrt * 4.0, particleCountSqrt);
    glCat.useProgram(programReturn);
    gl.bindFramebuffer(gl.FRAMEBUFFER, framebufferParticleComputeReturn);
    gl.blendFunc(gl.ONE, gl.ONE);
    glCat.clear(0.0, 0.0, 0.0, 0.0);

    glCat.attribute('p', vboQuad, 2);

    glCat.uniform2fv('resolution', [particleCountSqrt * 4.0, particleCountSqrt]);

    glCat.uniformTexture('texture', framebufferParticleCompute.texture, 0);

    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
  }

  {
    // compute particle
    gl.viewport(0, 0, particleCountSqrt * 4.0, particleCountSqrt);
    glCat.useProgram(programParticleCompute);
    gl.bindFramebuffer(gl.FRAMEBUFFER, framebufferParticleCompute);
    gl.blendFunc(gl.ONE, gl.ONE);
    glCat.clear(0.0, 0.0, 0.0, 0.0);

    glCat.attribute('p', vboQuad, 2);

    glCat.uniform1f('time', time);
    glCat.uniform1f('particleCountSqrt', particleCountSqrt);
    glCat.uniform1i('frameZero', frame % frames === 0);
    glCat.uniform1f('deltaTime', _deltaTime);

    glCat.uniformTexture('textureRandom', textureRandom, 0);
    glCat.uniformTexture('textureParticle', framebufferParticleComputeReturn.texture, 1);
    glCat.uniformTexture('textureWord', textureWord, 2);
    glCat.uniformTexture('textureSphereRandom', textureSphereRandom, 3);

    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
  }

  {
    // render particle shadow map
    gl.viewport(0, 0, shadowSize, shadowSize);
    glCat.useProgram(programParticleRenderShadow);
    gl.bindFramebuffer(gl.FRAMEBUFFER, framebufferParticleShadow);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    glCat.clear(1.0, 1.0, 1.0);

    glCat.attribute('uv', vboCube, 3);

    glCat.uniform1f('time', time);
    glCat.uniform1f('particleCountSqrt', particleCountSqrt);
    glCat.uniform2fv('resolution', [shadowSize, shadowSize]);
    glCat.uniform3fv('u_cameraPos', lightPos);
    glCat.uniform3fv('u_lightPos', lightPos);

    glCat.uniformTexture('textureParticle', framebufferParticleCompute.texture, 0);
    glCat.uniformTexture('textureCube', textureCube, 1);

    gl.drawArrays(gl.TRIANGLES, 0, vboCube.length / 3.0);
  }

  {
    // render particle
    gl.viewport(0, 0, width, height);
    glCat.useProgram(programParticleRender);
    gl.bindFramebuffer(gl.FRAMEBUFFER, framebufferParticleRender);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    glCat.clear();

    glCat.attribute('uv', vboCube, 3);

    glCat.uniform1f('time', time);
    glCat.uniform1f('particleCountSqrt', particleCountSqrt);
    glCat.uniform2fv('resolution', [width, height]);
    glCat.uniform3fv('u_cameraPos', cameraPos);
    glCat.uniform3fv('u_lightPos', lightPos);

    glCat.uniformTexture('textureParticle', framebufferParticleCompute.texture, 0);
    glCat.uniformTexture('textureCube', textureCube, 1);
    glCat.uniformTexture('textureShadow', framebufferParticleShadow.texture, 2);

    gl.drawArrays(gl.TRIANGLES, 0, vboCube.length / 3.0);
  }

  {
    // return motionblur texture
    gl.viewport(0, 0, width, height);
    glCat.useProgram(programReturn);
    gl.bindFramebuffer(gl.FRAMEBUFFER, framebufferMotionblurReturn);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    glCat.clear();

    glCat.attribute('p', vboQuad, 2);
    glCat.uniform2fv('resolution', [width, height]);
    glCat.uniformTexture('texture', framebufferMotionblur.texture, 0);

    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
  }

  {
    // motionblur
    gl.viewport(0, 0, width, height);
    glCat.useProgram(programMotionblur);
    gl.bindFramebuffer(gl.FRAMEBUFFER, framebufferMotionblur);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    glCat.clear();

    glCat.attribute('p', vboQuad, 2);
    glCat.uniform1f('add', 1.0 / _nSample);
    glCat.uniform1i('init', _iSample === 0);
    glCat.uniform2fv('resolution', [width, height]);
    glCat.uniformTexture('renderTexture', framebufferParticleRender.texture, 0);
    glCat.uniformTexture('blurTexture', framebufferMotionblurReturn.texture, 1);

    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
  }

  gl.flush();
};

var post = function post() {
  gl.viewport(0, 0, width, height);
  glCat.useProgram(programPost);
  gl.bindFramebuffer(gl.FRAMEBUFFER, null);
  gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
  glCat.clear();

  glCat.attribute('p', vboQuad, 2);

  glCat.uniform1f('time', time);
  glCat.uniform2fv('resolution', [width, height]);

  glCat.uniformTexture('texture', framebufferMotionblur.texture, 0);
  glCat.uniformTexture('textureRandom', textureRandom, 1);

  gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
};

// ---

var renderA = document.createElement('a');

var saveFrame = function saveFrame() {
  renderA.href = canvas.toDataURL();
  renderA.download = ('0000' + frame).slice(-5) + '.png';
  renderA.click();
};

// ---

var update = function update() {
  if (!checkboxPlay.checked) {
    requestAnimationFrame(update);
    return;
  }

  var bS = checkboxBlur.checked ? blurSample : 1;
  for (var iSample = 0; iSample < bS; iSample++) {
    var timePrev = time;
    time += 1.0 / bS / frames;
    var deltaTime = time - timePrev;
    time = time % 1.0;

    render(deltaTime * 4.0, iSample, bS);
  }
  post();

  if (checkboxSave.checked && frames <= frame) {
    saveFrame();
  }

  frame++;
  if (frame % frames === 0) {}

  requestAnimationFrame(update);
};
update();

window.addEventListener('keydown', function (_e) {
  if (_e.which === 27) {
    checkboxPlay.checked = false;
  }
});

},{"./cube-vertices":"/Users/Yutaka/Dropbox/pro/_Projects/_eom/1000/src/script/cube-vertices.js","./glcat":"/Users/Yutaka/Dropbox/pro/_Projects/_eom/1000/src/script/glcat.js","./sphere-random":"/Users/Yutaka/Dropbox/pro/_Projects/_eom/1000/src/script/sphere-random.js","./word":"/Users/Yutaka/Dropbox/pro/_Projects/_eom/1000/src/script/word.js","./xorshift":"/Users/Yutaka/Dropbox/pro/_Projects/_eom/1000/src/script/xorshift.js"}],"/Users/Yutaka/Dropbox/pro/_Projects/_eom/1000/src/script/sphere-random.js":[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _xorshift = require('./xorshift');

var _xorshift2 = _interopRequireDefault(_xorshift);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var sphereRandom = function sphereRandom(_size) {
  var len = _size * 4;
  var ret = new Float32Array(len);

  for (var iPix = 0; iPix < len / 4; iPix++) {
    var x = 1.0;
    var y = 1.0;
    var z = 1.0;

    while (1.0 < x * x + y * y + z * z) {
      x = (0, _xorshift2.default)() * 2.0 - 1.0;
      y = (0, _xorshift2.default)() * 2.0 - 1.0;
      z = (0, _xorshift2.default)() * 2.0 - 1.0;
    }

    ret[iPix * 4 + 0] = x;
    ret[iPix * 4 + 1] = y;
    ret[iPix * 4 + 2] = z;
    ret[iPix * 4 + 3] = (0, _xorshift2.default)();
  }

  return ret;
};

exports.default = sphereRandom;

},{"./xorshift":"/Users/Yutaka/Dropbox/pro/_Projects/_eom/1000/src/script/xorshift.js"}],"/Users/Yutaka/Dropbox/pro/_Projects/_eom/1000/src/script/word.js":[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _xorshift = require('./xorshift');

var _xorshift2 = _interopRequireDefault(_xorshift);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var canvas = document.createElement('canvas');
var canvasSize = 2048;
canvas.width = canvasSize;
canvas.height = canvasSize;

var context = canvas.getContext('2d');
context.textAlign = 'center';
context.textBaseline = 'middle';
context.font = '900 ' + canvasSize / 3.0 + 'px "Helvetica Neue", "Helvetica Neue OTS"';

context.fillStyle = '#000';
context.fillRect(0, 0, canvasSize, canvasSize);

context.fillStyle = '#fff';
context.fillText('1000', canvasSize / 2.0, canvasSize / 2.0);

var imageData = context.getImageData(0, 0, canvasSize, canvasSize).data;

var testNemui = function testNemui(_x, _y) {
  var x = _x;
  var y = _y;

  return 127 < imageData[4 * (x + canvasSize * y)];
};

var hits = new Float32Array(canvasSize * canvasSize * 2);
var head = 0;
for (var iy = 0; iy < canvasSize; iy++) {
  for (var ix = 0; ix < canvasSize; ix++) {
    if (testNemui(ix, iy)) {
      hits[head * 2 + 0] = ix / canvasSize * 2.0 - 1.0;
      hits[head * 2 + 1] = -(iy / canvasSize) * 2.0 + 1.0;
      head++;
    }
  }
}

var word = function word(_size) {
  var out = new Float32Array(_size * 4);
  for (var iOut = 0; iOut < _size; iOut++) {
    var dice = Math.floor((0, _xorshift2.default)() * head);
    out[iOut * 4 + 0] = hits[dice * 2 + 0];
    out[iOut * 4 + 1] = hits[dice * 2 + 1];
    out[iOut * 4 + 2] = ((0, _xorshift2.default)() - 0.5) * 0.1;
    out[iOut * 4 + 3] = (0, _xorshift2.default)();
  }
  return out;
};

exports.default = word;

},{"./xorshift":"/Users/Yutaka/Dropbox/pro/_Projects/_eom/1000/src/script/xorshift.js"}],"/Users/Yutaka/Dropbox/pro/_Projects/_eom/1000/src/script/xorshift.js":[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var seed = void 0;
var xorshift = function xorshift(_seed) {
  seed = _seed || seed || 1;
  seed = seed ^ seed << 13;
  seed = seed ^ seed >>> 17;
  seed = seed ^ seed << 5;
  return seed / Math.pow(2, 32) + 0.5;
};

exports.default = xorshift;

},{}]},{},["/Users/Yutaka/Dropbox/pro/_Projects/_eom/1000/src/script/main.js"]);
