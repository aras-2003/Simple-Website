import {
  ACESFilmicToneMapping, AmbientLight, BoxGeometry, Color, DataTexture,
  DirectionalLight, DoubleSide, ExtrudeGeometry, Fog, Group, HalfFloatType,
  Mesh, MeshBasicMaterial, MeshStandardMaterial, Path, PCFShadowMap,
  PerspectiveCamera, PlaneGeometry, PMREMGenerator, RGBAFormat, RepeatWrapping,
  Scene, ShaderMaterial, Shape, SRGBColorSpace, Vector3, WebGLRenderer, LinearFilter, LinearMipmapLinearFilter, type WebGLRenderTarget, type BufferGeometry,
} from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import { Reflector } from 'three/addons/objects/Reflector.js';

export type Frame = 'complexity' | 'transformation' | 'coherence';
export type Candidate = 'incision' | 'compression';
export type Quality = 'studio' | 'direct';
export interface Study { frame: Frame; candidate: Candidate; quality: Quality; detail: boolean }
type Pose = [number, number, number, number, number, number];
const poses: Record<Candidate, Record<Frame, Pose[]>> = {
  incision: {
    complexity: [[-1.9,0,-.8,0,-.20,0],[.65,0,.6,0,.23,0],[2.5,0,-1.15,0,-.12,0],[.5,0,2.0,0,.05,0],[3.25,0,1.1,0,-.18,0],[.2,2.5,.3,0,.15,.03]],
    transformation: [[-.85,0,-.9,0,-.12,0],[.25,0,.35,0,.16,0],[1.25,0,-.1,0,-.06,0],[1.35,0,1.7,0,.15,0],[2.5,0,.1,0,-.08,0],[.4,3.1,.3,0,.10,0]],
    coherence: [[0,0,-1.05,0,0,0],[.05,0,0,0,0,0],[.1,0,1.05,0,0,0],[1.9,0,.4,0,0,0],[-1.9,0,.4,0,0,0],[0,3.3,.15,0,0,0]],
  },
  compression: {
    complexity: [[-1,1.8,-.6,Math.PI/2,0,-.15],[1,2.8,.55,Math.PI/2,0,.18],[.3,4,-.7,Math.PI/2,0,-.06],[2.0,0,.4,0,0,0],[-1.7,0,-.6,0,0,0],[0,1.3,1,0,.35,0]],
    transformation: [[-.5,1.35,-.3,Math.PI/2,0,-.08],[.55,2.35,.25,Math.PI/2,0,.10],[.15,3.35,-.2,Math.PI/2,0,-.03],[1.6,0,.1,0,0,0],[-1.65,0,-.3,0,0,0],[0,1.7,.6,0,.15,0]],
    coherence: [[0,1.0,0,Math.PI/2,0,0],[0,1.9,0,Math.PI/2,0,0],[0,2.8,0,Math.PI/2,0,0],[1.55,0,0,0,0,0],[-1.55,0,0,0,0,0],[0,2.3,0,0,0,0]],
  },
};

/** Original geometry and procedural studio: no reference image or external asset ships. */
export function createWorld(host: HTMLElement) {
  const renderer = new WebGLRenderer({antialias:true,powerPreference:'low-power'});
  renderer.outputColorSpace=SRGBColorSpace;
  renderer.toneMapping=ACESFilmicToneMapping;
  renderer.toneMappingExposure=1.25;
  renderer.info.autoReset=false;
  renderer.shadowMap.enabled=true;
  renderer.shadowMap.type=PCFShadowMap;
  renderer.domElement.setAttribute('aria-hidden','true');
  host.append(renderer.domElement);
  const scene=new Scene();
  scene.background=new Color(0x090d12);
  scene.fog=new Fog(0x090d12,20,50);
  const camera=new PerspectiveCamera(34,1,.1,80);
  const geometry:BufferGeometry[]=[];
  const materials:(MeshStandardMaterial|MeshBasicMaterial)[]=[];
  const keep=<T extends BufferGeometry>(value:T):T=>{geometry.push(value);return value;};
  const grain=new Uint8Array(256*64*4);
  let seed=471;
  for(let y=0;y<64;y++)for(let x=0;x<256;x++){
    seed=(seed*1664525+1013904223)>>>0;
    const value=232+((seed>>>24)%16)+Math.round(Math.sin(y*1.1)*3);
    const i=(y*256+x)*4;grain.set([value,value,value,255],i);
  }
  const roughness=new DataTexture(grain,256,64,RGBAFormat);
  roughness.magFilter=LinearFilter;roughness.minFilter=LinearMipmapLinearFilter;roughness.generateMipmaps=true;roughness.anisotropy=4;
  roughness.wrapS=roughness.wrapT=RepeatWrapping;roughness.repeat.set(2,9);roughness.needsUpdate=true;
  function metal(color:number,rough:number){
    const material=new MeshStandardMaterial({color,metalness:1,roughness:rough,roughnessMap:roughness,envMapIntensity:1.2});
    materials.push(material);return material;
  }
  const graphite=metal(0x45494e,.28);
  const cutMetal=metal(0x9da3a8,.17);
  const satin=metal(0x6a6d70,.26);
  const polished=metal(0xb8bec2,.15);
  const floorMaterial=new MeshStandardMaterial({color:0x0d1218,metalness:.35,roughness:.48,envMapIntensity:.12});
  const wallMaterial=new MeshStandardMaterial({color:0x040609,metalness:.10,roughness:.90,envMapIntensity:.06});
  materials.push(floorMaterial,wallMaterial);
  const floor=new Mesh(keep(new PlaneGeometry(120,120)),floorMaterial);
  floor.rotation.x=-Math.PI/2;floor.receiveShadow=true;scene.add(floor);
  const wall=new Mesh(keep(new BoxGeometry(45,20,.5)),wallMaterial);
  wall.position.set(0,9,-7);wall.receiveShadow=true;scene.add(wall);
  for(const x of[-7,7]){
    const fin=new Mesh(keep(new BoxGeometry(.48,13,2.0)),wallMaterial);
    fin.position.set(x,6.4,-5.9);fin.castShadow=true;fin.receiveShadow=true;scene.add(fin);
  }
  const root=new Group();root.position.y=.24;scene.add(root);
  function roundedPath(target:Shape|Path,w:number,h:number,r:number){
    target.moveTo(-w/2+r,-h/2);target.lineTo(w/2-r,-h/2);
    target.quadraticCurveTo(w/2,-h/2,w/2,-h/2+r);target.lineTo(w/2,h/2-r);
    target.quadraticCurveTo(w/2,h/2,w/2-r,h/2);target.lineTo(-w/2+r,h/2);
    target.quadraticCurveTo(-w/2,h/2,-w/2,h/2-r);target.lineTo(-w/2,-h/2+r);
    target.quadraticCurveTo(-w/2,-h/2,-w/2+r,-h/2);
  }
  const bodies:Group[]=[];
  [[3.0,5.8,.70,.40],[2.65,4.8,.84,.34],[3.25,6.55,.63,.46]].forEach(([w,h,d,t],i)=>{
    const shape=new Shape();roundedPath(shape,w!,h!,.10);
    const hole=new Path();roundedPath(hole,w!-t!*2,h!-t!*2,.06);
    shape.holes.push(hole);
    const solid=keep(new ExtrudeGeometry(shape,{depth:d!,steps:1,bevelEnabled:true,bevelSegments:4,bevelSize:.045,bevelThickness:.045,curveSegments:8}));
    solid.translate(0,0,-d!/2);
    const portal=new Mesh(solid,[i===1?satin:graphite,cutMetal]);
    portal.castShadow=true;portal.receiveShadow=true;
    const object=new Group();portal.position.y=h!/2+.05;object.add(portal);object.name=`portal-${i+1}`;root.add(object);bodies.push(object);
  });
  [[.65,4.1,1.0],[.78,2.9,.82],[3.2,.18,2.45]].forEach(([w,h,d],i)=>{
    const block=new Mesh(keep(new RoundedBoxGeometry(w!,h!,d!,3,.035)),i===0?polished:i===1?satin:graphite);
    block.castShadow=true;block.receiveShadow=true;
    const object=new Group();block.position.y=i<2?h!/2:0;object.add(block);object.name=i<2?`decision-key-${i+1}`:'decision-plane';root.add(object);bodies.push(object);
  });
  const plinth=new Mesh(keep(new RoundedBoxGeometry(10.5,.24,7,3,.035)),graphite);
  plinth.position.set(.2,.12,0);plinth.castShadow=true;plinth.receiveShadow=true;scene.add(plinth);
  const key=new DirectionalLight(0xf2e5d3,3.5);
  key.position.set(-9,10,12);key.target.position.set(.5,4.4,0);key.castShadow=true;
  key.shadow.mapSize.set(1536,1536);
  Object.assign(key.shadow.camera,{left:-11,right:11,top:12,bottom:-9,near:.5,far:40});
  key.shadow.normalBias=.035;key.shadow.bias=-.0002;key.shadow.radius=3;
  scene.add(key,key.target);
  const rim=new DirectionalLight(0xc4d5e7,2.7);rim.position.set(5,7,-4);scene.add(rim);
  const ambient=new AmbientLight(0xb4c2ce,.22);scene.add(ambient);

  // Lighting-only room. Cards are reflected by physical metal, never visible as glowing outlines.
  const studio=new Scene();studio.background=new Color(0x080a0d);
  const studioGeometry:BufferGeometry[]=[];const studioMaterials:MeshBasicMaterial[]=[];
  function card(w:number,h:number,position:Vector3,radiance:number,color=0xffffff){
    const g=new PlaneGeometry(w,h);const m=new MeshBasicMaterial({color:new Color(color).multiplyScalar(radiance),side:DoubleSide});
    studioGeometry.push(g);studioMaterials.push(m);
    const mesh=new Mesh(g,m);mesh.position.copy(position);mesh.lookAt(0,3,0);studio.add(mesh);
  }
  card(5,10,new Vector3(-7,6,5),5.8,0xe4ebf3);
  card(1.2,12,new Vector3(7,5,1),8.0,0xf2e0c7);
  card(12,5,new Vector3(0,12,1),3.2);
  card(2.2,9,new Vector3(-2,5,-8),4.0,0xcdddeb);
  card(7,10,new Vector3(-5,5,12),4.5,0xf3f0eb);
  let environment:WebGLRenderTarget|undefined;
  let mirror:Reflector|undefined;
  let environmentMs=0;
  function ensureStudio(){
    if(environment)return;
    const pmrem=new PMREMGenerator(renderer);
    const start=performance.now();
    environment=pmrem.fromScene(studio,.04,.1,60);
    environmentMs=performance.now()-start;
    pmrem.dispose();
    // Low-opacity planar reflection: one extra render, no bloom or screen-space effects.
    mirror=new Reflector(keep(new PlaneGeometry(70,70)),{textureWidth:768,textureHeight:768,color:0x586068,clipBias:.003,multisample:0});
    const material=mirror.material as ShaderMaterial;
    material.uniforms['uOpacity']={value:.22};
    material.fragmentShader=material.fragmentShader
      .replace('void main() {','uniform float uOpacity;\nvoid main() {')
      .replace('blendOverlay( base.rgb, color ), 1.0','blendOverlay( base.rgb, color ), uOpacity');
    material.transparent=true;material.depthWrite=false;
    mirror.rotation.x=-Math.PI/2;mirror.position.y=.006;mirror.renderOrder=1;scene.add(mirror);
  }
  let current:Study={frame:'complexity',candidate:'incision',quality:'studio',detail:false};
  let disposed=false;let renders=0;
  const target=new Vector3();
  function compose(){
    if(disposed)return;
    const phone=window.innerWidth<=650;
    const compression=current.candidate==='compression';
    const p=poses[current.candidate][current.frame];
    bodies.forEach((object,i)=>{const v=p[i]!;object.position.set(v[0],v[1],v[2]-(compression && i<3?[5.8,4.8,6.55][i]!/2:0));object.rotation.set(v[3],v[4],v[5]);});
    const cameras:Record<Frame,[number,number,number]>=compression
      ? {complexity:[8.5,7.4,10],transformation:[7,5.8,8],coherence:[7.2,5.3,9]}
      : {complexity:[9.0,4.0,12.8],transformation:[7.4,2.9,10.7],coherence:[8.0,3.5,12.2]};
    const view=cameras[current.frame];
    camera.position.set(...view);target.set(compression ? .2 : .35,compression ? 2.0 : 3.1,0);
    camera.fov=current.detail?31:34;
    if(current.detail){camera.position.set(compression?4.5:4.1,compression?3.7:4.0,compression?5.4:4.5);target.set(.2,compression?2.5:3.4,.1);}
    if(phone){camera.position.sub(target).multiplyScalar(current.detail?1.45:1.85).add(target);}
    camera.lookAt(target);
    const {width,height}=host.getBoundingClientRect();
    camera.aspect=width/height;camera.clearViewOffset();
    // Full-width environment; a deliberate lens shift reserves readable negative space.
    if(!phone)camera.setViewOffset(width,height,-width*(current.detail ? .03 : .12),0,width,height);
    else camera.setViewOffset(width,height,0,-height*.16,width,height);
    camera.updateProjectionMatrix();
    if(current.quality==='studio')ensureStudio();
    scene.environment=current.quality==='studio'?environment!.texture:null;
    if(mirror)mirror.visible=current.quality==='studio';
    ambient.intensity=current.quality==='studio' ? .13 : .55;
    renderer.setPixelRatio(Math.min(devicePixelRatio,phone?1.25:1.5));
    renderer.setSize(width,height,false);
  }
  function render(){
    if(disposed||document.hidden)return;
    const start=performance.now();renderer.info.reset();renderer.render(scene,camera);
    const elapsed=performance.now()-start;renders++;host.dataset['renders']=String(renders);
    return {cpuSubmitMs:elapsed,renders,calls:renderer.info.render.calls,triangles:renderer.info.render.triangles,geometries:renderer.info.memory.geometries,textures:renderer.info.memory.textures};
  }
  function setStudy(value:Study){current=value;compose();return render();}
  function measure(){
    const times:number[]=[];const gl=renderer.getContext();
    for(let i=0;i<4;i++){const start=performance.now();renderer.info.reset();renderer.render(scene,camera);gl.finish();times.push(performance.now()-start);}
    const image=environment?.texture.image as {width?:number;height?:number}|undefined;
    return {study:current,framesMs:times,environmentSetupCpuMs:environmentMs,renderInfo:{geometries:renderer.info.memory.geometries,textures:renderer.info.memory.textures,calls:renderer.info.render.calls,triangles:renderer.info.render.triangles},environment:environment?{width:image?.width,height:image?.height,type:environment.texture.type===HalfFloatType?'half-float':'other'}:null,reflectionTarget:current.quality==='studio'?[768,768]:null,nativeGPUPerformance:'NOT VERIFIED'};
  }
  const observer=new ResizeObserver(()=>{compose();render();});observer.observe(host);
  const onVisibility=()=>{if(!document.hidden){compose();render();}};document.addEventListener('visibilitychange',onVisibility);
  const onLost=(event:Event)=>{event.preventDefault();host.dispatchEvent(new CustomEvent('v4-context-lost'));};
  renderer.domElement.addEventListener('webglcontextlost',onLost);
  function dispose(){
    if(disposed)return;disposed=true;observer.disconnect();document.removeEventListener('visibilitychange',onVisibility);
    renderer.domElement.removeEventListener('webglcontextlost',onLost);geometry.forEach(g=>g.dispose());materials.forEach(m=>m.dispose());
    roughness.dispose();environment?.dispose();mirror?.dispose();studioGeometry.forEach(g=>g.dispose());studioMaterials.forEach(m=>m.dispose());renderer.dispose();renderer.domElement.remove();renderer.forceContextLoss();
  }
  return {setStudy,measure,dispose,objectIds:bodies.map(body=>body.name),get renders(){return renders;}};
}
