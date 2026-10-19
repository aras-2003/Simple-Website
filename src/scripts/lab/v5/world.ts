import {ACESFilmicToneMapping, AmbientLight, BufferAttribute, BufferGeometry, Color, DirectionalLight, DoubleSide, Mesh, MeshBasicMaterial, MeshStandardMaterial, PerspectiveCamera, PlaneGeometry, PMREMGenerator, Scene, SRGBColorSpace, Vector2, WebGLRenderer} from 'three';
import {deform,RIBBONS,SEGMENTS,SIDES,smooth,topology} from './morph';

export function createWorld(host:HTMLElement){
  const start=performance.now();
  const renderer=new WebGLRenderer({antialias:true,alpha:true,powerPreference:'low-power'});
  // Construction may fail after a context exists (environment/observer setup).
  // The caller cannot dispose a world that has not returned yet.
  const cleanup:Array<()=>void>=[()=>renderer.domElement.remove(),()=>renderer.forceContextLoss(),()=>renderer.dispose()];
  const release=()=>{for(const dispose of cleanup.splice(0).reverse()){try{dispose();}catch(error){console.warn('V5 resource cleanup failed',error);}}};
  try {
    renderer.outputColorSpace=SRGBColorSpace;renderer.toneMapping=ACESFilmicToneMapping;renderer.toneMappingExposure=1.15;
    renderer.domElement.setAttribute('aria-hidden','true');host.append(renderer.domElement);
    const scene=new Scene(),studio=new Scene();studio.background=new Color(0x080b0f);
    const camera=new PerspectiveCamera(34,1,.1,80);camera.position.set(1.5,3.3,17.4);camera.lookAt(0,0,0);
    const cards:Mesh[]=[];
    const freeStudio=()=>{cards.forEach(card=>{card.geometry.dispose();(card.material as MeshBasicMaterial).dispose();});cards.length=0;studio.clear();};
    cleanup.push(freeStudio);
    function card(w:number,h:number,x:number,y:number,z:number,intensity:number,color:number){
      const mesh=new Mesh(new PlaneGeometry(w,h),new MeshBasicMaterial({color:new Color(color).multiplyScalar(intensity),side:DoubleSide}));
      mesh.position.set(x,y,z);mesh.lookAt(0,0,0);studio.add(mesh);cards.push(mesh);
    }
    card(10,13,-7,6,7,4,0xe4ebf3);card(3,12,7,4,1,5,0xf2e4d1);
    card(12,5,0,10,1,3.5,0xffffff);card(2,9,-2,3,-8,4,0xcdddeb);
    card(10,12,-5,3,12,2.8,0xf3f0eb);card(6,9,9,6,-6,3,0xcdddeb);
    const pmrem=new PMREMGenerator(renderer);
    let environment:ReturnType<PMREMGenerator['fromScene']>;
    try{environment=pmrem.fromScene(studio,.06,.1,60);}finally{pmrem.dispose();}
    cleanup.push(()=>environment.dispose());scene.environment=environment.texture;
    freeStudio();
    const positions=new Float32Array(RIBBONS*(SEGMENTS+1)*SIDES*3);
    const geometry=new BufferGeometry();cleanup.push(()=>geometry.dispose());geometry.setAttribute('position',new BufferAttribute(positions,3));
    // Index layout remains unchanged throughout the complete narrative.
    geometry.setIndex(topology());
    const normals=new Float32Array(positions.length);geometry.setAttribute('normal',new BufferAttribute(normals,3));
    const material=new MeshStandardMaterial({color:0x78818a,metalness:.92,roughness:.34,envMapIntensity:1.45});
    cleanup.push(()=>material.dispose());
    const surface=new Mesh(geometry,material);surface.frustumCulled=false;scene.add(surface);
    scene.add(new AmbientLight(0xb4c2ce,.5));const key=new DirectionalLight(0xe7edf5,3.0);key.position.set(-4,7,8);scene.add(key);
    let progress=0,tail=0,previousProgress=-1,locked=false,detail=false,disposed=false,renders=0,initializationMs=0;
    const timings:number[]=[];
    const frameSize=new Vector2();
    function render(){
      if(disposed)return;
      const before=performance.now();
      const width=host.clientWidth,height=host.clientHeight,phone=width<=650;
      const dpr=Math.min(devicePixelRatio||1,phone?1.25:1.5);
      renderer.getSize(frameSize);
      if(frameSize.x!==width||frameSize.y!==height||renderer.getPixelRatio()!==dpr){renderer.setPixelRatio(dpr);renderer.setSize(width,height);}
      camera.aspect=width/height;camera.clearViewOffset();camera.fov=detail?(phone?26:22):(phone?39:34);
      const shifts=[-.20,.22,-.25,.22,-.18];
      const phase=Math.min(3,Math.floor(progress*4)),t=smooth(progress*4-phase);
      const baseShift=shifts[phase]!+(shifts[phase+1]!-shifts[phase]!)*t;
      const shift=baseShift+(.22-baseShift)*smooth(tail);
      camera.position.set(1.5,3.3,phone?33:17.4);camera.lookAt(0,0,0);
      if(!locked&&!detail){if(phone)camera.setViewOffset(width,height,0,-height*(.38-.05*smooth((progress-.75)/.25)-.15*smooth(tail)),width,height);else camera.setViewOffset(width,height,width*shift,0,width,height);}
      camera.updateProjectionMatrix();renderer.render(scene,camera);renders++;
      timings.push(performance.now()-before);if(timings.length>240)timings.shift();
      host.dataset['renders']=String(renders);host.dataset['camera']=JSON.stringify([...camera.position.toArray(),camera.fov,locked?0:shift]);
    }
    function setProgress(value:number,editorialTail=0){
      progress=Math.max(0,Math.min(1,value));tail=editorialTail;const before=performance.now();
      if(previousProgress!==progress){deform(progress,positions,normals);geometry.attributes['position']!.needsUpdate=true;geometry.attributes['normal']!.needsUpdate=true;previousProgress=progress;}
      host.dataset['deformMs']=(performance.now()-before).toFixed(3);
      // Small, stable samples expose actual geometry rather than a playhead-only diagnostic.
      host.dataset['geometry']=JSON.stringify(Array.from({length:63},(_,i)=>positions[Math.floor(i*(positions.length-1)/62)]));
      host.dataset['progress']=String(progress);render();if(!initializationMs)initializationMs=performance.now()-start;
    }
    const resize=new ResizeObserver(render);cleanup.push(()=>resize.disconnect());resize.observe(host);
    const contextlost=(event:Event)=>{event.preventDefault();host.dispatchEvent(new Event('v5-context-lost'));};
    renderer.domElement.addEventListener('webglcontextlost',contextlost);cleanup.push(()=>renderer.domElement.removeEventListener('webglcontextlost',contextlost));
    return {setProgress,setCameraLocked(value:boolean){if(locked!==value){locked=value;render();}},setDetail(value:boolean){if(detail!==value){detail=value;render();}},
      measure(){const gl=renderer.getContext();const ext=gl.getExtension('WEBGL_debug_renderer_info');return {progress,initializationMs,renderer:ext?gl.getParameter(ext.UNMASKED_RENDERER_WEBGL):'unavailable',renderInfo:{...renderer.info.memory,...renderer.info.render},canvas:[renderer.domElement.width,renderer.domElement.height],cpuSubmissionMs:timings.slice(),bufferBytes:positions.byteLength+(geometry.index?.array.byteLength||0)+(geometry.attributes['normal']?.array.byteLength||0),ribbons:RIBBONS,vertices:positions.length/3};},
      dispose(){if(disposed)return;disposed=true;release();}
    };
  }catch(error){release();throw error;}
}
