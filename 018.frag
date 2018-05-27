precision mediump float;
uniform vec2  resolution;     // resolution (width, height)
uniform vec2  mouse;          // mouse      (0.0 ~ 1.0)
uniform float time;           // time       (1second == 1.0)
uniform sampler2D backbuffer; // previous scene texture

// distance function
// 距離関数
float distanceSphere(vec3 ray){
	float dist = length(ray) - 1.0;
	return dist;
}

// vec3 p = 0.0;
// vec3 b = 0.0;
// float r;
// float distanceSphere(vec3 p, vec3 b, float r) {
//   return length(max(abs(p)-b,0.0))-r;
// }

// repetition distance function
float repetitionSphere(vec3 ray){
	float dist = length(mod(ray, 2.0) - 1.0) - 0.25;
	return dist;
}

// distance hub
float distanceHub(vec3 ray){
	return repetitionSphere(ray);
}

// generate normal
vec3 genNormal(vec3 ray){
  float d = 0.001;
  return normalize(vec3(
	  distanceHub(ray + vec3(  d, 0.0, 0.0)) - distanceHub(ray + vec3( -d, 0.0, 0.0)),
	  distanceHub(ray + vec3(0.0,   d, 0.0)) - distanceHub(ray + vec3(0.0,  -d, 0.0)),
	  distanceHub(ray + vec3(0.0, 0.0,   d)) - distanceHub(ray + vec3(0.0, 0.0,  -d))
  ));
}


void main(){
    vec2 p = (gl_FragCoord.xy * 2.0 - resolution) / min(resolution.x, resolution.y);

    // ray direction
    vec3 dir = normalize(vec3(p, -1.0));

    // origin position
		// レイが飛んでいく原点
    vec3 origin = vec3(0.0, 0.0, 3.0 - time);

    // marching loop
		// rayの初期位置はorigin
    vec3 ray = origin;
		float dist = 0.0;
    for(int i = 0; i < 32; ++i){
			dist = distanceHub(ray);
    	ray += dir * dist;
    }

    // distance check
		vec3 normal = vec3(0.0);
		if(dist < 0.001){
			normal = genNormal(ray);
		}
    // float f = 0.0;
    // if(ray.z > 31.0){
    // 	f = 1.0;
    // }

		gl_FragColor = vec4(normal, 1.0);
    // gl_FragColor = vec4(vec3(f), 1.0);
}