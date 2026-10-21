import {ACESFilmicToneMapping, AmbientLight, Box3, BoxGeometry, Color, DirectionalLight, DoubleSide, ExtrudeGeometry, Mesh, MeshBasicMaterial, MeshStandardMaterial, PCFShadowMap, PerspectiveCamera, PlaneGeometry, PMREMGenerator, PointLight, ShadowMaterial, Scene, Shape, SRGBColorSpace, Vector3, WebGLRenderer} from 'three';
import {EffectComposer} from 'three/addons/postprocessing/EffectComposer.js';
import {RenderPass} from 'three/addons/postprocessing/RenderPass.js';
import {SSAOPass} from 'three/addons/postprocessing/SSAOPass.js';
import {OutputPass} from 'three/addons/postprocessing/OutputPass.js';
import {volumes,interfaces,dimensions,viewpoints,type Viewpoint} from './model';

/** Static Gate 1 study. No timeline, events, scroll mapping or idle render loop. */
export function createWorld(host:HTMLElement) {
 const cleanup:Array<()=>void>=[];
 let disposed=false,view:Viewpoint='primary',draws=0;
 const release=()=>{for(const fn of cleanup.splice(0).reverse())try{fn();}catch{/* Continue independent disposal. */}};
 try {
 const renderer=new WebGLRenderer({antialias:true,alpha:true,powerPreference:'low-power'});
 cleanup.push(()=>renderer.domElement.remove(),()=>renderer.dispose(),()=>renderer.forceContextLoss());
 renderer.outputColorSpace=SRGBColorSpace;renderer.toneMapping=ACESFilmicToneMapping;renderer.toneMappingExposure=1.1;
 renderer.info.autoReset=false;
 renderer.shadowMap.enabled=true;renderer.shadowMap.type=PCFShadowMap;
 renderer.domElement.setAttribute('aria-hidden','true');host.append(renderer.domElement);
 const scene=new Scene(),studio=new Scene();scene.background=new Color(0x182127);studio.background=new Color(0x10151a);
 const cards:Array<Mesh>=[];
 const card=(w:number,h:number,p:number[],color:number,power:number)=>{
  const mesh=new Mesh(new PlaneGeometry(w,h),new MeshBasicMaterial({color:new Color(color).multiplyScalar(power),side:DoubleSide}));mesh.position.set(p[0]!,p[1]!,p[2]!);mesh.lookAt(0,0,0);studio.add(mesh);cards.push(mesh);
 };
 card(11,16,[-9,8,9],0xb9ced5,3);card(5,15,[10,3,4],0xc1d6d9,2);card(10,10,[0,12,-3],0xd4d1c8,3);card(5,12,[-4,0,-10],0xa4c0c7,2);
 const generator=new PMREMGenerator(renderer);
 try {const environment=generator.fromScene(studio,.08,.1,60);scene.environment=environment.texture;cleanup.push(()=>environment.dispose());}
 finally {generator.dispose();for(const mesh of cards){mesh.geometry.dispose();(mesh.material as MeshBasicMaterial).dispose();}studio.clear();}
 const materials={
  petrol:new MeshStandardMaterial({color:0x31545b,metalness:.48,roughness:.4,envMapIntensity:1.4,dithering:true}),
  graphite:new MeshStandardMaterial({color:0x3b464c,metalness:.52,roughness:.42,envMapIntensity:1.25,dithering:true}),
  alloy:new MeshStandardMaterial({color:0x72736a,metalness:.78,roughness:.34,envMapIntensity:.8}),
 };
 Object.values(materials).forEach(material=>cleanup.push(()=>material.dispose()));
 const bounds=new Box3();
 for(const volume of volumes){
  const shape=new Shape();volume.section.forEach(([x,y],i)=>i?shape.lineTo(volume.axis==='side'?-x:x,y):shape.moveTo(volume.axis==='side'?-x:x,y));shape.closePath();
  const geometry=new ExtrudeGeometry(shape,{depth:volume.depth[1]-volume.depth[0]-.044,steps:1,bevelEnabled:true,bevelSegments:3,bevelSize:dimensions.bevel,bevelThickness:dimensions.bevel,curveSegments:1});
  // Author in actual world units: the edge radius never stretches with a member.
  geometry.translate(0,0,volume.depth[0]+dimensions.bevel);
  if(volume.axis==='side')geometry.rotateY(Math.PI/2);
  const mesh=new Mesh(geometry,materials[volume.finish]);mesh.name=volume.id;mesh.castShadow=mesh.receiveShadow=true;scene.add(mesh);bounds.expandByObject(mesh);cleanup.push(()=>geometry.dispose());
 }
 // Subordinate machining, not a second grid: narrow shadow reveals only on transfer faces.
 const reveal=new MeshStandardMaterial({color:0x111b20,roughness:.62,metalness:.35});
 const lining=new MeshStandardMaterial({color:0x686457,roughness:.46,metalness:.57,dithering:true});
 cleanup.push(()=>reveal.dispose(),()=>lining.dispose());
 const detail=(position:[number,number,number],size:[number,number,number],material:MeshStandardMaterial)=>{
  const geometry=new BoxGeometry(...size),mesh=new Mesh(geometry,material);mesh.position.set(...position);mesh.receiveShadow=true;scene.add(mesh);cleanup.push(()=>geometry.dispose());
 };
 // These inserts sit against actual interior surfaces; no floating panels or painted outer blocks.
 detail([-2.823,6.15,-.5],[.018,2.1,4.5],lining);
 detail([-2.823,1.95,-.6],[.018,2.4,4.2],lining);
 detail([2.1,2.1,-2.223],[2.55,2.4,.018],lining);
 detail([2.1,6.3,-2.223],[2.55,2.1,.018],lining);
 for(const y of [3.6,3.75,3.9])detail([-2.1,y,2.702],[2.95,.012,.008],reveal);
 for(const y of [7.5,7.65,7.8])detail([-2.1,y,1.952],[2.95,.012,.008],reveal);
 for(const y of [.15,.3,.45])detail([-2.1,y,2.702],[2.95,.01,.008],reveal);
 for(const y of [3.75,3.9,4.05,4.2,4.5,4.65,4.8,4.95])detail([3.602,y,0],[.008,.012,5.95],reveal);
 const amber=new MeshStandardMaterial({color:0x8a6839,emissive:0xffae52,emissiveIntensity:1.6,roughness:.5,metalness:.35});cleanup.push(()=>amber.dispose());
 for(const seam of interfaces){
  const geometry=new BoxGeometry(...seam.size);cleanup.push(()=>geometry.dispose());const mesh=new Mesh(geometry,amber);mesh.position.set(seam.position[0],seam.position[1],seam.position[2]);scene.add(mesh);
  for(const offset of [-.25,.25]){const light=new PointLight(0xffad52,seam.power*1.5,4.5,2);light.position.set(seam.position[0],seam.position[1]-.18,seam.position[2]+seam.size[2]*offset);scene.add(light);}
 }
 const key=new DirectionalLight(0xd4e2e6,3.7);key.position.set(-5,12,10);key.castShadow=true;key.shadow.mapSize.set(2048,2048);Object.assign(key.shadow.camera,{left:-8,right:8,top:11,bottom:-3,near:1,far:35});key.shadow.normalBias=.025;key.shadow.bias=-.0001;key.shadow.radius=3;scene.add(key);cleanup.push(()=>key.shadow.dispose());
 const rim=new DirectionalLight(0x8fb1ba,2.2);rim.position.set(8,8,-8);scene.add(rim,new AmbientLight(0xbccbd0,.65));
 const floorMaterial=new ShadowMaterial({color:0x000000,opacity:.24});const floorGeometry=new PlaneGeometry(200,200);cleanup.push(()=>floorMaterial.dispose(),()=>floorGeometry.dispose());
 const floor=new Mesh(floorGeometry,floorMaterial);floor.rotation.x=-Math.PI/2;floor.position.y=-.022;floor.receiveShadow=true;scene.add(floor);
 const camera=new PerspectiveCamera(30,1,.1,80);
 const composer=new EffectComposer(renderer);cleanup.push(()=>composer.dispose());
 const renderPass=new RenderPass(scene,camera),ao=new SSAOPass(scene,camera,512,512,16),output=new OutputPass();
 ao.kernelRadius=5;ao.minDistance=.002;ao.maxDistance=.022;
 composer.renderTarget1.samples=4;composer.renderTarget2.samples=4;
 composer.addPass(renderPass);composer.addPass(ao);composer.addPass(output);cleanup.push(()=>renderPass.dispose(),()=>ao.dispose(),()=>output.dispose());
 function render(next?:Viewpoint){
  if(disposed)return;if(next)view=next;
  const w=host.clientWidth,h=host.clientHeight;if(!w||!h)return;
  renderer.setPixelRatio(Math.min(devicePixelRatio||1,w<700?1.5:2));renderer.setSize(w,h);
  const pose=viewpoints[view];camera.position.set(pose.position[0],pose.position[1],pose.position[2]);camera.lookAt(...pose.target);camera.aspect=w/h;
  // Same lens and model in every view. Fit only the narrow viewport, never a different model.
  if(w/h<1)camera.position.sub(new Vector3(...pose.target)).multiplyScalar(1/(w/h)**.6).add(new Vector3(...pose.target));
  camera.updateProjectionMatrix();composer.setPixelRatio(renderer.getPixelRatio());composer.setSize(w,h);renderer.info.reset();composer.render(0);draws++;
  host.dataset['report']=JSON.stringify({view,draws,volumes:volumes.length,dimensions,render:renderer.info.render,bounds:bounds.min.toArray().concat(bounds.max.toArray()),camera:camera.position.toArray()});
 }
 const observer=new ResizeObserver(()=>render());cleanup.push(()=>observer.disconnect());observer.observe(host);
 const lost=(event:Event)=>{event.preventDefault();host.dispatchEvent(new Event('v7-context-lost'));};renderer.domElement.addEventListener('webglcontextlost',lost);cleanup.push(()=>renderer.domElement.removeEventListener('webglcontextlost',lost));
 return {render,dispose(){if(disposed)return;disposed=true;release();}};
 } catch(error){release();throw error;}
}
