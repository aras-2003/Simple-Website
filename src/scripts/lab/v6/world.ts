import {ACESFilmicToneMapping, AmbientLight, Color, DirectionalLight, DoubleSide, DynamicDrawUsage, InstancedMesh, Mesh, MeshBasicMaterial, MeshStandardMaterial, Object3D, OrthographicCamera, PCFShadowMap, PlaneGeometry, PMREMGenerator, Raycaster, Scene, SRGBColorSpace, Vector2, Vector3, WebGLRenderer} from 'three';
import {RoundedBoxGeometry} from 'three/addons/geometries/RoundedBoxGeometry.js';
import {edges,edgePose,eventState,modulePose,modules,teams,organizations,localLinks,localLinkPose,eventAnchor,type Candidate} from './model';

export interface State {progress:number;time:number;candidate:Candidate;groups:boolean;signals:boolean;bounds:boolean;cameraYaw:number}
export function createWorld(host:HTMLElement){
 const started=performance.now(),renderer=new WebGLRenderer({antialias:true,alpha:true,powerPreference:'low-power'});
 const cleanup:Array<()=>void>=[()=>renderer.domElement.remove(),()=>renderer.dispose(),()=>renderer.forceContextLoss()];
 let disposed=false;
 const release=()=>{for(const fn of cleanup.splice(0).reverse()){try{fn();}catch{ /* Continue releasing independently owned resources. */ }}};
 try{
 renderer.outputColorSpace=SRGBColorSpace;renderer.toneMapping=ACESFilmicToneMapping;renderer.toneMappingExposure=1.18;
 renderer.shadowMap.enabled=true;renderer.shadowMap.type=PCFShadowMap;renderer.domElement.setAttribute('aria-hidden','true');host.append(renderer.domElement);
 const scene=new Scene(),studio=new Scene();studio.background=new Color(0x171b20);
 const studioResources:Array<()=>void>=[];
 const freeStudio=()=>{studioResources.splice(0).forEach(f=>f());studio.clear();};cleanup.push(freeStudio);
 const card=(w:number,h:number,x:number,y:number,z:number,intensity:number,color:number)=>{
 const g=new PlaneGeometry(w,h),m=new MeshBasicMaterial({color:new Color(color).multiplyScalar(intensity),side:DoubleSide}),mesh=new Mesh(g,m);
 mesh.position.set(x,y,z);mesh.lookAt(0,0,0);studio.add(mesh);studioResources.push(()=>g.dispose(),()=>m.dispose());};
 card(12,16,-9,9,11,1.5,0xd2d9de);card(8,12,9,1,6,1.0,0x8797a7);card(14,9,0,12,0,1.7,0xe8dfd0);card(6,10,-4,0,-9,1.1,0x8d9dab);card(10,7,2,-8,6,.6,0xb9aa94);card(14,16,0,4,19,1.0,0xadb6bc);
 const pmrem=new PMREMGenerator(renderer);let env:ReturnType<PMREMGenerator['fromScene']>;
 try{env=pmrem.fromScene(studio,.035,.1,60);}finally{pmrem.dispose();}cleanup.push(()=>env.dispose());scene.environment=env.texture;freeStudio();
 const geometry=new RoundedBoxGeometry(1,1,1,2,.018);cleanup.push(()=>geometry.dispose());
 const material=new MeshStandardMaterial({color:0xffffff,roughness:.43,metalness:.70,envMapIntensity:1.05});cleanup.push(()=>material.dispose());
 // Per-instance color also carries the response light, without a second geometry/overlay.
 material.onBeforeCompile=shader=>{shader.fragmentShader=shader.fragmentShader.replace('#include <emissivemap_fragment>',`#include <emissivemap_fragment>
 #ifdef USE_INSTANCING_COLOR
 float signal=max(0.0,max(vColor.r,max(vColor.g,vColor.b))-0.85);
 totalEmissiveRadiance += vColor * signal * 0.65;
 #endif`);};
 const solids=new InstancedMesh(geometry,material,modules.length);solids.instanceMatrix.setUsage(DynamicDrawUsage);solids.castShadow=true;solids.receiveShadow=true;solids.frustumCulled=false;scene.add(solids);cleanup.push(()=>solids.dispose());
 const joints=new InstancedMesh(geometry,material,edges.reduce((count,edge)=>count+(edge.strength==='strong'?9:3),0)+localLinks.length);joints.instanceMatrix.setUsage(DynamicDrawUsage);joints.castShadow=true;joints.receiveShadow=true;joints.frustumCulled=false;scene.add(joints);cleanup.push(()=>joints.dispose());
 const key=new DirectionalLight(0xf2eee5,4.2);key.position.set(-7,10,8);key.castShadow=true;key.shadow.mapSize.set(1024,1024);Object.assign(key.shadow.camera,{left:-9,right:9,top:9,bottom:-9,near:1,far:35});key.shadow.normalBias=.025;key.shadow.bias=-.00015;scene.add(key);cleanup.push(()=>key.shadow.dispose());
 const rim=new DirectionalLight(0xbacde3,1.3);rim.position.set(7,3,-6);scene.add(rim,new AmbientLight(0xd5e0e8,.65));
 const camera=new OrthographicCamera(-8,8,6,-6,.1,80);const dummy=new Object3D(),color=new Color(),up=new Vector3(0,1,0),direction=new Vector3();
 const palette=[0xa6aeb5,0x78838f,0xb8b9b6,0x697685,0x999b9f];
 const state:State={progress:0,time:0,candidate:'spine',groups:false,signals:true,bounds:false,cameraYaw:0};
 let width=0,height=0,draws=0,initializationMs=0;
 let report:{bounds:number[];centroid:number[];camera:number[];samples:number[];event:ReturnType<typeof eventState>;updateMs:number;submitMs:number;anchor:{module:number;world:number[];screen:number[];visible:boolean;reason:string}}={bounds:[],centroid:[],camera:[],samples:[],event:eventState(0,0),updateMs:0,submitMs:0,anchor:{module:0,world:[],screen:[],visible:false,reason:'inactive'}};
 const timings:number[]=[];
 const resize=()=>{
 const w=host.clientWidth,h=host.clientHeight;if(!w||!h)return;
 const phone=w<=700,dpr=Math.min(devicePixelRatio||1,phone?1.1:1.5);
 if(w===width&&h===height&&renderer.getPixelRatio()===dpr)return;
 width=w;height=h;renderer.setPixelRatio(dpr);renderer.setSize(w,h);
 // An orthographic fixed view preserves precision and gives reproducible projected measurements.
 const span=phone?14.2:20.5,vertical=span*h/w;
 camera.left=-span/2;camera.right=span/2;camera.top=vertical/2;camera.bottom=-vertical/2;
 camera.position.set(9,6.5,15);camera.lookAt(0,0,0);
 camera.setViewOffset(w,h,-w*(phone?0:.14),-h*(phone?.16:.025),w,h);camera.updateProjectionMatrix();camera.updateMatrixWorld();
 };
 function render(next:Partial<State>={}){
 if(disposed)return;Object.assign(state,next);resize();const before=performance.now();
 const angle=state.cameraYaw*Math.PI/180;camera.position.set(9*Math.cos(angle)+15*Math.sin(angle),6.5,15*Math.cos(angle)-9*Math.sin(angle));camera.lookAt(0,0,0);camera.updateMatrixWorld();
 let minX=Infinity,minY=Infinity,maxX=-Infinity,maxY=-Infinity,sumX=0,sumY=0;
 const samples:number[]=[],p=state.progress,t=state.time,anchorState=eventAnchor(p,t,state.signals);
 for(const m of modules){
 const pose=modulePose(m,p,t,state.candidate,state.signals);dummy.position.set(...pose.position);dummy.rotation.set(...pose.rotation);dummy.scale.set(...pose.size);dummy.updateMatrix();solids.setMatrixAt(m.id,dummy.matrix);
 const base=state.groups?palette[m.department]!:m.kind==='panel'?0x697078:m.id%5===0?0x7a8188:0x535b62;color.setHex(base);
 if(pose.signal>.01)color.lerp(new Color(pose.event===1?0xffb451:pose.event===2?0xb0d9ff:0xffffff).multiplyScalar(1.5),pose.signal*(m.id===anchorState.module.id?.85:m.kind==='panel'?.45:m.kind==='beam'?.025:.12));
 solids.setColorAt(m.id,color);
 const projected=new Vector3(...pose.position).project(camera),x=(projected.x+1)*width/2,y=(1-projected.y)*height/2;
 const radius=Math.max(...pose.size)*width/(camera.right-camera.left)*.6;
 minX=Math.min(minX,x-radius);maxX=Math.max(maxX,x+radius);minY=Math.min(minY,y-radius);maxY=Math.max(maxY,y+radius);sumX+=x;sumY+=y;
 if(m.id%17===0||m.kind==='panel')samples.push(...pose.position,...pose.size);
 }
 let jointIndex=0;
 const segment=(from:Vector3,to:Vector3,growth:number,width:number,depth:number,tint:number,activation=0)=>{
  const end=from.clone().lerp(to,growth);dummy.position.copy(from).lerp(end,.5);direction.subVectors(end,from);
  const length=Math.max(.001,direction.length());dummy.quaternion.setFromUnitVectors(up,direction.lengthSq()>1e-8?direction.normalize():up);
  dummy.scale.set(width,length,depth);dummy.updateMatrix();joints.setMatrixAt(jointIndex,dummy.matrix);
  color.setHex(tint);if(activation>.01)color.lerp(new Color(0xb4d0e6).multiplyScalar(1.4),activation);
  joints.setColorAt(jointIndex++,color);
 };
 for(const edge of edges){
  const e=edgePose(edge,p,t,state.candidate,state.signals),a=new Vector3(...e.a),b=new Vector3(...e.b);
  const bend=new Vector3(b.x,a.y,a.z),bend2=new Vector3(b.x,b.y,a.z),points=[a,bend,bend2,b];
  // Strong paths become a deck plus two side interfaces. Weaker paths retain a single narrow bridge.
  for(let lane=0;lane<(edge.strength==='strong'?3:1);lane++)for(let part=0;part<3;part++){
   const from=points[part]!.clone(),to=points[part+1]!.clone();
   const strong=edge.strength==='strong',offset=lane===0?0:lane===1?-.33:.33;
   from.z+=offset;to.z+=offset;
   const growth=Math.max(0,Math.min(1,e.growth*3-part));
   const width=lane===0?e.thickness:strong?.07:.001,depth=lane===0&&strong?.62:width;
   segment(from,to,growth,width,depth,state.groups?(strong?0x82898c:edge.strength==='moderate'?0x698597:0x414952):0x4d565f,e.response);
  }
 }
 for(const link of localLinks){
  const e=localLinkPose(link,p,t,state.candidate,state.signals);
  // Graph-owned local paths settle into fine inner interfaces; transient pulses travel only over those paths.
  segment(new Vector3(...e.a),new Vector3(...e.b),e.growth,.015+e.response*.027,.015+e.response*.027,e.response>.05?(anchorState.event.kind===1?0xc69755:anchorState.event.kind===2?0x8faec6:0xc8c7bf):0x4c5965,e.response*.35);
 }
 solids.instanceMatrix.needsUpdate=true;joints.instanceMatrix.needsUpdate=true;if(solids.instanceColor)solids.instanceColor.needsUpdate=true;if(joints.instanceColor)joints.instanceColor.needsUpdate=true;
 const anchorPose=modulePose(anchorState.module,p,t,state.candidate,state.signals);
 const anchorWorld=new Vector3(...anchorPose.position),projectedAnchor=anchorWorld.clone().project(camera);
 const ray=new Raycaster();ray.setFromCamera(new Vector2(projectedAnchor.x,projectedAnchor.y),camera);scene.updateMatrixWorld(true);
 const hit=anchorState.event.amount>.035?ray.intersectObjects([solids,joints],false)[0]:undefined;
 const front=projectedAnchor.z>=-1&&projectedAnchor.z<=1&&Math.abs(projectedAnchor.x)<.96&&Math.abs(projectedAnchor.y)<.94;
 const unoccluded=hit?.object===solids&&hit.instanceId===anchorState.module.id;
 const surface=unoccluded?hit!.point:anchorWorld,screen=surface.clone().project(camera);
 const anchor={module:anchorState.module.id,world:surface.toArray(),screen:[(screen.x+1)*width/2,(1-screen.y)*height/2],visible:front&&unoccluded&&anchorState.event.amount>.035,reason:!front?'offscreen':anchorState.event.amount<=.035?'inactive':!unoccluded?'occluded':'visible'};
 const updated=performance.now();renderer.render(scene,camera);const submitted=performance.now();draws++;
 report={bounds:[minX,minY,maxX,maxY],centroid:[sumX/modules.length,sumY/modules.length],camera:[...camera.position.toArray(),camera.left,camera.right,camera.top,camera.bottom],samples,anchor,event:eventState(p,t,state.signals),updateMs:updated-before,submitMs:submitted-updated};
 timings.push(submitted-before);if(timings.length>300)timings.shift();
 if(!initializationMs)initializationMs=submitted-started;
 host.dataset['renders']=String(draws);
 }
 const observer=new ResizeObserver(()=>render());cleanup.push(()=>observer.disconnect());observer.observe(host);
 const lost=(event:Event)=>{event.preventDefault();host.dispatchEvent(new Event('v6-context-lost'));};renderer.domElement.addEventListener('webglcontextlost',lost);cleanup.push(()=>renderer.domElement.removeEventListener('webglcontextlost',lost));
 return {render,measure(){const gl=renderer.getContext(),ext=gl.getExtension('WEBGL_debug_renderer_info');return {...state,...report,projection:camera.projectionMatrix.toArray(),view:camera.matrixWorldInverse.toArray(),viewport:[width,height],initializationMs,draws,modules:modules.length,teams:teams.length,organizations:organizations.length,edges:edges.length,renderer:ext?gl.getParameter(ext.UNMASKED_RENDERER_WEBGL):'unavailable',renderInfo:{...renderer.info.render,...renderer.info.memory},canvas:[renderer.domElement.width,renderer.domElement.height],instanceBytes:solids.instanceMatrix.array.byteLength+joints.instanceMatrix.array.byteLength+(solids.instanceColor?.array.byteLength||0)+(joints.instanceColor?.array.byteLength||0),geometryBytes:Object.values(geometry.attributes).reduce((n,a)=>n+a.array.byteLength,0)+(geometry.index?.array.byteLength||0),timings:[...timings]};},dispose(){if(disposed)return;disposed=true;release();}};
 }catch(error){release();throw error;}
}
