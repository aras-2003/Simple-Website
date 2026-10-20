import {ACESFilmicToneMapping, AmbientLight, Color, DirectionalLight, DoubleSide, DynamicDrawUsage, InstancedMesh, Mesh, MeshBasicMaterial, MeshStandardMaterial, Object3D, OrthographicCamera, PCFShadowMap, PlaneGeometry, PMREMGenerator, Scene, SRGBColorSpace, Vector3, WebGLRenderer} from 'three';
import {RoundedBoxGeometry} from 'three/addons/geometries/RoundedBoxGeometry.js';
import {edges,edgePose,eventState,modulePose,modules,teams,organizations,type Candidate} from './model';

export interface State {progress:number;time:number;candidate:Candidate;groups:boolean;signals:boolean;bounds:boolean}
export function createWorld(host:HTMLElement){
 const started=performance.now(),renderer=new WebGLRenderer({antialias:true,alpha:true,powerPreference:'low-power'});
 const cleanup:Array<()=>void>=[()=>renderer.domElement.remove(),()=>renderer.dispose(),()=>renderer.forceContextLoss()];
 let disposed=false;
 const release=()=>{for(const fn of cleanup.splice(0).reverse()){try{fn();}catch{ /* Continue releasing independently owned resources. */ }}};
 try{
 renderer.outputColorSpace=SRGBColorSpace;renderer.toneMapping=ACESFilmicToneMapping;renderer.toneMappingExposure=1.12;
 renderer.shadowMap.enabled=true;renderer.shadowMap.type=PCFShadowMap;renderer.domElement.setAttribute('aria-hidden','true');host.append(renderer.domElement);
 const scene=new Scene(),studio=new Scene();studio.background=new Color(0x05070a);
 const studioResources:Array<()=>void>=[];
 const freeStudio=()=>{studioResources.splice(0).forEach(f=>f());studio.clear();};cleanup.push(freeStudio);
 const card=(w:number,h:number,x:number,y:number,z:number,intensity:number,color:number)=>{
 const g=new PlaneGeometry(w,h),m=new MeshBasicMaterial({color:new Color(color).multiplyScalar(intensity),side:DoubleSide}),mesh=new Mesh(g,m);
 mesh.position.set(x,y,z);mesh.lookAt(0,0,0);studio.add(mesh);studioResources.push(()=>g.dispose(),()=>m.dispose());};
 card(9,14,-7,7,8,4,0xe1e7ed);card(2,12,8,1,4,4,0xc5d4e5);card(12,4,0,9,0,5,0xfaf5eb);card(2,10,-3,0,-8,3,0xffffff);card(7,5,3,-7,5,2,0xc4c9d0);card(8,12,0,3,17,3.2,0xe1e5eb);card(1.2,12,-5,1,15,5,0xffffff);
 const pmrem=new PMREMGenerator(renderer);let env:ReturnType<PMREMGenerator['fromScene']>;
 try{env=pmrem.fromScene(studio,.035,.1,60);}finally{pmrem.dispose();}cleanup.push(()=>env.dispose());scene.environment=env.texture;freeStudio();
 const geometry=new RoundedBoxGeometry(1,1,1,2,.045);cleanup.push(()=>geometry.dispose());
 const material=new MeshStandardMaterial({color:0xffffff,roughness:.28,metalness:1,envMapIntensity:1.10});cleanup.push(()=>material.dispose());
 // Per-instance color also carries the response light, without a second geometry/overlay.
 material.onBeforeCompile=shader=>{shader.fragmentShader=shader.fragmentShader.replace('#include <emissivemap_fragment>',`#include <emissivemap_fragment>
 #ifdef USE_INSTANCING_COLOR
 float signal=max(0.0,max(vColor.r,max(vColor.g,vColor.b))-0.85);
 totalEmissiveRadiance += vColor * signal * 0.65;
 #endif`);};
 const solids=new InstancedMesh(geometry,material,modules.length);solids.instanceMatrix.setUsage(DynamicDrawUsage);solids.castShadow=true;solids.receiveShadow=true;solids.frustumCulled=false;scene.add(solids);cleanup.push(()=>solids.dispose());
 const joints=new InstancedMesh(geometry,material,edges.length*3);joints.instanceMatrix.setUsage(DynamicDrawUsage);joints.castShadow=true;joints.receiveShadow=true;joints.frustumCulled=false;scene.add(joints);cleanup.push(()=>joints.dispose());
 const key=new DirectionalLight(0xf2eee5,3.4);key.position.set(-7,10,8);key.castShadow=true;key.shadow.mapSize.set(1024,1024);Object.assign(key.shadow.camera,{left:-9,right:9,top:9,bottom:-9,near:1,far:35});key.shadow.normalBias=.025;key.shadow.bias=-.00015;scene.add(key);cleanup.push(()=>key.shadow.dispose());
 const rim=new DirectionalLight(0xbacde3,2.3);rim.position.set(7,3,-6);scene.add(rim,new AmbientLight(0xd5e0e8,.35));
 const camera=new OrthographicCamera(-8,8,6,-6,.1,80);const dummy=new Object3D(),color=new Color(),up=new Vector3(0,1,0),direction=new Vector3();
 const palette=[0xa6aeb5,0x78838f,0xb8b9b6,0x697685,0x999b9f];
 const state:State={progress:0,time:0,candidate:'spine',groups:false,signals:true,bounds:false};
 let width=0,height=0,draws=0,initializationMs=0;
 let report:{bounds:number[];centroid:number[];camera:number[];samples:number[];event:ReturnType<typeof eventState>;updateMs:number;submitMs:number}={bounds:[],centroid:[],camera:[],samples:[],event:eventState(0,0),updateMs:0,submitMs:0};
 const timings:number[]=[];
 const resize=()=>{
 const w=host.clientWidth,h=host.clientHeight;if(!w||!h)return;
 const phone=w<=700,dpr=Math.min(devicePixelRatio||1,phone?1.1:1.5);
 if(w===width&&h===height&&renderer.getPixelRatio()===dpr)return;
 width=w;height=h;renderer.setPixelRatio(dpr);renderer.setSize(w,h);
 // An orthographic fixed view preserves precision and gives reproducible projected measurements.
 const span=phone?12.7:17.5,vertical=span*h/w;
 camera.left=-span/2;camera.right=span/2;camera.top=vertical/2;camera.bottom=-vertical/2;
 camera.position.set(9,6.5,15);camera.lookAt(0,0,0);
 camera.setViewOffset(w,h,-w*(phone?0:.105),-h*(phone?.15:.035),w,h);camera.updateProjectionMatrix();camera.updateMatrixWorld();
 };
 function render(next:Partial<State>={}){
 if(disposed)return;Object.assign(state,next);resize();const before=performance.now();
 let minX=Infinity,minY=Infinity,maxX=-Infinity,maxY=-Infinity,sumX=0,sumY=0;
 const samples:number[]=[],p=state.progress,t=state.time;
 for(const m of modules){
 const pose=modulePose(m,p,t,state.candidate,state.signals);dummy.position.set(...pose.position);dummy.rotation.set(...pose.rotation);dummy.scale.set(...pose.size);dummy.updateMatrix();solids.setMatrixAt(m.id,dummy.matrix);
 const base=state.groups?palette[m.department]!:m.kind==='panel'?0x88919b:m.id%5===0?0xbfc3c5:0x69737e;color.setHex(base);
 if(pose.signal>.01)color.lerp(new Color(pose.event===1?0xffb451:pose.event===2?0xb0d9ff:0xffffff).multiplyScalar(1.5),pose.signal);
 solids.setColorAt(m.id,color);
 const projected=new Vector3(...pose.position).project(camera),x=(projected.x+1)*width/2,y=(1-projected.y)*height/2;
 const radius=Math.max(...pose.size)*width/(camera.right-camera.left)*.6;
 minX=Math.min(minX,x-radius);maxX=Math.max(maxX,x+radius);minY=Math.min(minY,y-radius);maxY=Math.max(maxY,y+radius);sumX+=x;sumY+=y;
 if(m.id%17===0||m.kind==='panel')samples.push(...pose.position,...pose.size);
 }
 for(const edge of edges){
 const e=edgePose(edge,p,t,state.candidate,state.signals);
 // Orthogonal dog-leg interfaces, with shared broad sockets vs long narrow independent spans.
 const a=new Vector3(...e.a),b=new Vector3(...e.b),bend=new Vector3(b.x,a.y,a.z),bend2=new Vector3(b.x,b.y,a.z);
 const points=[a,bend,bend2,b];
 for(let part=0;part<3;part++){
 const from=points[part]!,to=points[part+1]!,end=from.clone().lerp(to,e.growth);
 dummy.position.copy(from).lerp(end,.5);direction.subVectors(end,from);const length=Math.max(.006,direction.length());
 dummy.quaternion.setFromUnitVectors(up,direction.lengthSq()>.0000001?direction.normalize():up);dummy.scale.set(e.thickness,length,e.thickness);dummy.updateMatrix();joints.setMatrixAt(edge.id*3+part,dummy.matrix);
 color.setHex(state.groups?(edge.strength==='strong'?0xd3d4d4:edge.strength==='moderate'?0x8aafcc:0x555e6b):0x747d88);
 if(e.response>.01)color.lerp(new Color(0xb6ddff).multiplyScalar(1.5),e.response);joints.setColorAt(edge.id*3+part,color);
 }
 }
 solids.instanceMatrix.needsUpdate=true;joints.instanceMatrix.needsUpdate=true;if(solids.instanceColor)solids.instanceColor.needsUpdate=true;if(joints.instanceColor)joints.instanceColor.needsUpdate=true;
 const updated=performance.now();renderer.render(scene,camera);const submitted=performance.now();draws++;
 report={bounds:[minX,minY,maxX,maxY],centroid:[sumX/modules.length,sumY/modules.length],camera:[...camera.position.toArray(),camera.left,camera.right,camera.top,camera.bottom],samples,event:eventState(p,t,state.signals),updateMs:updated-before,submitMs:submitted-updated};
 timings.push(submitted-before);if(timings.length>300)timings.shift();
 if(!initializationMs)initializationMs=submitted-started;
 host.dataset['renders']=String(draws);
 }
 const observer=new ResizeObserver(()=>render());cleanup.push(()=>observer.disconnect());observer.observe(host);
 const lost=(event:Event)=>{event.preventDefault();host.dispatchEvent(new Event('v6-context-lost'));};renderer.domElement.addEventListener('webglcontextlost',lost);cleanup.push(()=>renderer.domElement.removeEventListener('webglcontextlost',lost));
 return {render,measure(){const gl=renderer.getContext(),ext=gl.getExtension('WEBGL_debug_renderer_info');return {...state,...report,initializationMs,draws,modules:modules.length,teams:teams.length,organizations:organizations.length,edges:edges.length,renderer:ext?gl.getParameter(ext.UNMASKED_RENDERER_WEBGL):'unavailable',renderInfo:{...renderer.info.render,...renderer.info.memory},canvas:[renderer.domElement.width,renderer.domElement.height],instanceBytes:solids.instanceMatrix.array.byteLength+joints.instanceMatrix.array.byteLength+(solids.instanceColor?.array.byteLength||0)+(joints.instanceColor?.array.byteLength||0),geometryBytes:Object.values(geometry.attributes).reduce((n,a)=>n+a.array.byteLength,0)+(geometry.index?.array.byteLength||0),timings:[...timings]};},dispose(){if(disposed)return;disposed=true;release();}};
 }catch(error){release();throw error;}
}
