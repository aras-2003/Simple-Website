const smoothVision=(p:number)=>Math.max(0,Math.min(1,(p-.72)/.28));
import {ACESFilmicToneMapping, AmbientLight, BufferGeometry, Float32BufferAttribute, LineBasicMaterial, LineSegments, Color, DirectionalLight, DoubleSide, DynamicDrawUsage, InstancedMesh, Mesh, MeshBasicMaterial, MeshStandardMaterial, Object3D, OrthographicCamera, PCFShadowMap, PlaneGeometry, PMREMGenerator, Raycaster, Scene, SRGBColorSpace, Vector2, Vector3, WebGLRenderer} from 'three';
import {RoundedBoxGeometry} from 'three/addons/geometries/RoundedBoxGeometry.js';
import {eventState,modulePose,modules,teams,organizations,eventAnchor,type Candidate} from './model';

export interface State {progress:number;time:number;eventTime:number;candidate:Candidate;groups:boolean;signals:boolean;bounds:boolean;cameraYaw:number}
export function createWorld(host:HTMLElement){
 const started=performance.now(),renderer=new WebGLRenderer({antialias:true,alpha:true,powerPreference:'low-power'});
 const cleanup:Array<()=>void>=[()=>renderer.domElement.remove(),()=>renderer.dispose(),()=>renderer.forceContextLoss()];
 let disposed=false;
 const release=()=>{for(const fn of cleanup.splice(0).reverse()){try{fn();}catch{ /* Continue releasing independently owned resources. */ }}};
 try{
 renderer.outputColorSpace=SRGBColorSpace;renderer.toneMapping=ACESFilmicToneMapping;renderer.toneMappingExposure=1.3;
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
 const pulseMaterial=new MeshBasicMaterial({color:0xf5c987,depthTest:false,toneMapped:false});cleanup.push(()=>pulseMaterial.dispose());
 const joints=new InstancedMesh(geometry,pulseMaterial,8);joints.frustumCulled=false;joints.renderOrder=2;scene.add(joints);cleanup.push(()=>joints.dispose());
 const sketch:number[]=[];
 for(const m of modules.filter(m=>m.role<5&&m.kind==='beam')){
  const corners=Array.from({length:8},(_,i)=>m.target.map((v,a)=>v+((i>>a)&1?1:-1)*m.size[a]!/2));
  for(let i=0;i<8;i++)for(let a=0;a<3;a++)if(!((i>>a)&1))sketch.push(...corners[i]!,...corners[i|(1<<a)]!);
 }
 const ghostGeometry=new BufferGeometry();ghostGeometry.setAttribute('position',new Float32BufferAttribute(sketch,3));cleanup.push(()=>ghostGeometry.dispose());
 const ghostMaterial=new LineBasicMaterial({color:0x748c96,transparent:true,opacity:.15,depthWrite:false});cleanup.push(()=>ghostMaterial.dispose());
 const vision=new LineSegments(ghostGeometry,ghostMaterial);scene.add(vision);
 const key=new DirectionalLight(0xf2eee5,4.2);key.position.set(-7,10,8);key.castShadow=true;key.shadow.mapSize.set(1024,1024);Object.assign(key.shadow.camera,{left:-9,right:9,top:9,bottom:-9,near:1,far:35});key.shadow.normalBias=.025;key.shadow.bias=-.00015;scene.add(key);cleanup.push(()=>key.shadow.dispose());
 const rim=new DirectionalLight(0xbacde3,1.3);rim.position.set(7,3,-6);scene.add(rim,new AmbientLight(0xd5e0e8,.95));
 const camera=new OrthographicCamera(-8,8,6,-6,.1,80);const dummy=new Object3D(),color=new Color(),up=new Vector3(0,1,0),direction=new Vector3();
 const palette=[0xa6aeb5,0x78838f,0xb8b9b6,0x697685,0x999b9f];
 const state:State={progress:0,time:0,eventTime:0,candidate:'spine',groups:false,signals:true,bounds:false,cameraYaw:0};
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
 camera.position.set(11,4.5,15);camera.lookAt(0,0,0);
 camera.setViewOffset(w,h,-w*(phone?0:.10),-h*(phone?.20:.025),w,h);camera.updateProjectionMatrix();camera.updateMatrixWorld();
 };
 function render(next:Partial<State>={}){
 if(disposed)return;Object.assign(state,next);resize();const before=performance.now();
 const angle=state.cameraYaw*Math.PI/180;camera.position.set(11*Math.cos(angle)+15*Math.sin(angle),4.5,15*Math.cos(angle)-11*Math.sin(angle));camera.lookAt(0,0,0);camera.updateMatrixWorld();
 let minX=Infinity,minY=Infinity,maxX=-Infinity,maxY=-Infinity,sumX=0,sumY=0;
 const samples:number[]=[],p=state.progress,t=state.eventTime,anchorState=eventAnchor(p,t,state.signals);
 const activeTeams=new Set(Object.keys(anchorState.event.arrivals).map(Number).filter(id=>anchorState.event.activation(id)>.01).map(id=>modules[id]!.team));
 for(const m of modules){
 const pose=modulePose(m,p,t,state.candidate,state.signals);dummy.position.set(...pose.position);dummy.rotation.set(...pose.rotation);dummy.scale.set(...pose.size);dummy.updateMatrix();solids.setMatrixAt(m.id,dummy.matrix);
 const base=state.groups?palette[m.department]!:m.role===6?0x9b733b:m.kind==='panel'?0x38545b:m.id%5===0?0x697477:0x34434a;color.setHex(base);
 const e=anchorState.event;
 const participant=e.sources.includes(m.id)||e.links.some(l=>l.from===m.id||l.to===m.id);
 const teamActive=activeTeams.has(m.team);
 if(e.amount>.01&&!participant){color.lerp(new Color(0x363c40),.72*e.amount);color.multiplyScalar(1-e.amount*(teamActive?.08:.32));}
 if(m.role===6&&m.kind==='panel')color.setRGB(1.5, .83, .28).multiplyScalar(1-e.amount*(teamActive?.08:.22));
 if(m.role===8&&m.kind==='block')color.lerp(new Color(0xb5a584),.23);
 if(pose.signal>.01)color.lerp(new Color(pose.event===1?0xffba66:pose.event===2?0xb7dcf5:0xfff3d5).multiplyScalar(2.4),pose.signal);
 solids.setColorAt(m.id,color);
 const projected=new Vector3(...pose.position).project(camera),x=(projected.x+1)*width/2,y=(1-projected.y)*height/2;
 const radius=Math.max(...pose.size)*width/(camera.right-camera.left)*.6;
 minX=Math.min(minX,x-radius);maxX=Math.max(maxX,x+radius);minY=Math.min(minY,y-radius);maxY=Math.max(maxY,y+radius);sumX+=x;sumY+=y;
 if(m.id%17===0||m.kind==='panel')samples.push(...pose.position,...pose.size);
 }
 let jointIndex=0;
 const event=anchorState.event;
 for(const link of event.links){
  if(!state.signals||event.amount<.01||link.u<0||link.u>1)continue;
  const from=modulePose(modules[link.from]!,p,t,state.candidate,false),to=modulePose(modules[link.to]!,p,t,state.candidate,false);
  const a=new Vector3(...from.position),b=new Vector3(...to.position);
  const end=a.clone().lerp(b,link.u),start=a.clone().lerp(b,Math.max(0,link.u-.17));
  dummy.position.copy(start).lerp(end,.5);direction.subVectors(end,start);
  dummy.quaternion.setFromUnitVectors(up,direction.lengthSq()>1e-8?direction.clone().normalize():up);dummy.scale.set(.035,Math.max(.04,direction.length()),.035);dummy.updateMatrix();joints.setMatrixAt(jointIndex++,dummy.matrix);
 }
 joints.count=jointIndex;
 ghostMaterial.opacity=.17*(1-smoothVision(p));vision.visible=p<.999;
 solids.instanceMatrix.needsUpdate=true;joints.instanceMatrix.needsUpdate=true;if(solids.instanceColor)solids.instanceColor.needsUpdate=true;
 // Prefer the initiating surface; if hidden by real geometry, track another arrived participant.
 const ray=new Raycaster();scene.updateMatrixWorld(true);
 let anchor={module:anchorState.module.id,world:[] as number[],screen:[0,0],visible:false,reason:anchorState.event.amount<=.035?'inactive':'occluded'};
 const candidates=[...event.sources,...Object.keys(event.arrivals).map(Number).filter(id=>!event.sources.includes(id))].filter(id=>event.activation(id)>.01);
 for(const id of candidates){
  const pose=modulePose(modules[id]!,p,t,state.candidate,state.signals),point=new Vector3(...pose.position),projection=point.clone().project(camera);
  ray.setFromCamera(new Vector2(projection.x,projection.y),camera);
  const hit=ray.intersectObject(solids,false)[0];
  const front=projection.z>=-1&&projection.z<=1&&Math.abs(projection.x)<.96&&Math.abs(projection.y)<.94;
  if(front&&hit?.instanceId===id){const screen=hit.point.clone().project(camera);anchor={module:id,world:hit.point.toArray(),screen:[(screen.x+1)*width/2,(1-screen.y)*height/2],visible:true,reason:'visible'};break;}
 }
 const updated=performance.now();renderer.render(scene,camera);const submitted=performance.now();draws++;
 report={bounds:[minX,minY,maxX,maxY],centroid:[sumX/modules.length,sumY/modules.length],camera:[...camera.position.toArray(),camera.left,camera.right,camera.top,camera.bottom],samples,anchor,event:eventState(p,t,state.signals),updateMs:updated-before,submitMs:submitted-updated};
 timings.push(submitted-before);if(timings.length>300)timings.shift();
 if(!initializationMs)initializationMs=submitted-started;
 host.dataset['renders']=String(draws);
 }
 const observer=new ResizeObserver(()=>render());cleanup.push(()=>observer.disconnect());observer.observe(host);
 const lost=(event:Event)=>{event.preventDefault();host.dispatchEvent(new Event('v6-context-lost'));};renderer.domElement.addEventListener('webglcontextlost',lost);cleanup.push(()=>renderer.domElement.removeEventListener('webglcontextlost',lost));
 return {render,measure(){const gl=renderer.getContext(),ext=gl.getExtension('WEBGL_debug_renderer_info');return {...state,...report,projection:camera.projectionMatrix.toArray(),view:camera.matrixWorldInverse.toArray(),viewport:[width,height],initializationMs,draws,modules:modules.length,teams:teams.length,organizations:organizations.length,faces:[0,1,2,3,4].map(face=>modules.filter(m=>m.face===face).length),pulses:joints.count,renderer:ext?gl.getParameter(ext.UNMASKED_RENDERER_WEBGL):'unavailable',renderInfo:{...renderer.info.render,...renderer.info.memory},canvas:[renderer.domElement.width,renderer.domElement.height],instanceBytes:solids.instanceMatrix.array.byteLength+joints.instanceMatrix.array.byteLength+(solids.instanceColor?.array.byteLength||0)+(joints.instanceColor?.array.byteLength||0),geometryBytes:Object.values(geometry.attributes).reduce((n,a)=>n+a.array.byteLength,0)+(geometry.index?.array.byteLength||0),timings:[...timings]};},dispose(){if(disposed)return;disposed=true;release();}};
 }catch(error){release();throw error;}
}
