/** Persistent material coordinates: ribbon / longitudinal sample / cross-section.
 * All states have identical topology. No random sampling, remeshing or opacity swaps. */
export const RIBBONS = 9;
export const SEGMENTS = 192;
export const SIDES = 16;
export const smooth = (t:number) => {const x=Math.max(0,Math.min(1,t));return x*x*x*(x*(x*6-15)+10);};
const lerp=(a:number,b:number,t:number)=>a+(b-a)*t;

type Point=readonly [number,number,number];
const framework:readonly Point[]=[[-3.7,-2,0],[-3.7,.8,-.2],[-2.6,2.1,0],[1.8,2.1,.25],[3.1,1,.4],[3.1,-1.9,.6]];
const execution:readonly Point[]=[[-4.3,-1.8,-.3],[-3.3,-1.5,-.3],[-2.6,1.25,0],[-1.4,1.65,.15],[1.1,1.65,.25],[2,.05,.6],[4.2,.05,.8]];
function path(points:readonly Point[],u:number,out:Float64Array){
 const scaled=u*(points.length-1),i=Math.min(points.length-2,Math.floor(scaled)),t=scaled-i;
 const a=points[Math.max(0,i-1)]!,b=points[i]!,c=points[i+1]!,d=points[Math.min(points.length-1,i+2)]!;
 for(let j=0;j<3;j++)out[j]=.5*((2*b[j]!)+(-a[j]!+c[j]!)*t+(2*a[j]!-5*b[j]!+4*c[j]!-d[j]!)*t*t+(-a[j]!+3*b[j]!-3*c[j]!+d[j]!)*t*t*t);
}
const pathPoint=new Float64Array(3);

// Three capability families open their local folds into shared, directed lamellae.
function anchor(state:number, ribbon:number, u:number, out:Float64Array) {
  const family=Math.floor(ribbon/3), lane=ribbon%3;
  const v=(ribbon-4)/4, local=lane-1, a=u*Math.PI*2;
  let x=0,y=0,z=0;
  if(state===0){
    const phase=a*.77-.9+family*.22;
    x=(family-1)*3.05+Math.sin(phase)*1.25+local*.13;
    y=Math.cos(phase)*2.1+(family===1?.9:-.4)+local*.10;
    z=local*.20+Math.sin(phase*1.4+family)*.48;
  }else if(state===1){
    // Three linked spans share a central constraint while their outer ends
    // retain distinct responsibilities. Layers cross in depth, never teleport.
    x=(u-.5)*8.4;
    const convergence=Math.pow(Math.sin(u*Math.PI),4);
    y=(family-1)*1.9*(1-convergence*.82)+Math.sin(u*Math.PI*2)*.65+local*.10;
    z=(family-1)*.70+Math.sin(u*Math.PI)*1.3+local*.16;
  }else if(state===2){
    // The chosen central span becomes a common direction; side families
    // release their previous curves and form the two supporting returns.
    path(framework,u,pathPoint);
    const blend=smooth((family+1)/4);
    x=pathPoint[0]!*.72+(u-.5)*2.2;
    y=pathPoint[1]!*.72+(family-1)*.72+local*.10;
    z=pathPoint[2]!+(family-1)*.62+local*.16+Math.sin(u*Math.PI)*blend*.4;
  }else if(state===3){
    path(framework,u,pathPoint);
    x=pathPoint[0]!+v*.07;
    y=pathPoint[1]!+v*.17;
    z=pathPoint[2]!+v*1.1;
  }else{
    path(execution,u,pathPoint);
    x=pathPoint[0]!+v*.08;
    y=pathPoint[1]!+v*(.18+.30*u);
    z=pathPoint[2]!+v*(.9+.3*u)+Math.sin(u*7+v)*.06;
  }
  out[0]=x;out[1]=y;out[2]=z;
}

const first=new Float64Array(3),second=new Float64Array(3);
/** Reuses caller-owned buffers; does not allocate per vertex or depend on time. */
export function center(progress:number,ribbon:number,u:number,out:Float64Array){
  const p=Math.max(0,Math.min(1,progress))*4;
  const state=Math.min(3,Math.floor(p)), t=smooth(p-state);
  anchor(state,ribbon,u,first);anchor(state+1,ribbon,u,second);
  for(let j=0;j<3;j++)out[j]=lerp(first[j]!,second[j]!,t);
}

export function topology(){
  const indices:number[]=[];
  for(let r=0;r<RIBBONS;r++)for(let s=0;s<SEGMENTS;s++)for(let k=0;k<SIDES;k++){
    const a=(r*(SEGMENTS+1)+s)*SIDES+k,b=(r*(SEGMENTS+1)+s)*SIDES+(k+1)%SIDES;
    indices.push(a,b,a+SIDES,b,b+SIDES,a+SIDES);
  }
  // Each thin structural band is closed, including the two cut ends.
  for(let r=0;r<RIBBONS;r++)for(let k=1;k<SIDES-1;k++){
    const a=r*(SEGMENTS+1)*SIDES,b=a+SEGMENTS*SIDES;
    indices.push(a,a+k+1,a+k,b,b+k,b+k+1);
  }
  return indices;
}

const at=new Float64Array(3),before=new Float64Array(3),after=new Float64Array(3);
export function deform(progress:number,positions:Float32Array,normals?:Float32Array){
  let index=0;
  for(let r=0;r<RIBBONS;r++)for(let s=0;s<=SEGMENTS;s++){
    const u=s/SEGMENTS;
    center(progress,r,u,at);center(progress,r,Math.max(0,u-.001),before);center(progress,r,Math.min(1,u+.001),after);
    let tx=after[0]!-before[0]!,ty=after[1]!-before[1]!,tz=after[2]!-before[2]!;
    const length=Math.hypot(tx,ty,tz)||1;tx/=length;ty/=length;tz/=length;
    // Parallel sweep frame with a fixed reference axis: tangent always has a
    // non-zero x/y component, so this basis cannot collapse at the authored folds.
    const n=Math.hypot(tx,ty)||1,nx=-ty/n,ny=tx/n;
    const bx=-tz*ny,by=tz*nx,bz=tx*ny-ty*nx;
    const twist=.20*Math.sin(u*Math.PI*2+(r-4)*.035);
    const c=Math.cos(twist),d=Math.sin(twist);
    for(let k=0;k<SIDES;k++){
      const angle=k/SIDES*Math.PI*2;
      const width=Math.cos(angle)*.13,depth=Math.sin(angle)*.032;
      const w=width*c-depth*d,h=width*d+depth*c;
      if(normals){
        // Analytic elliptical sweep normals avoid triangulation-weighted highlight
        // bands. Rotate the ellipse gradient with the same local material frame.
        const nw=Math.cos(angle)/.13*c-Math.sin(angle)/.032*d;
        const nh=Math.cos(angle)/.13*d+Math.sin(angle)/.032*c;
        const ax=nx*nw+bx*nh,ay=ny*nw+by*nh,az=bz*nh;
        const norm=Math.hypot(ax,ay,az)||1;
        normals[index]=ax/norm;normals[index+1]=ay/norm;normals[index+2]=az/norm;
      }
      positions[index++]=at[0]!+nx*w+bx*h;
      positions[index++]=at[1]!+ny*w+by*h;
      positions[index++]=at[2]!+bz*h;
    }
  }
}
