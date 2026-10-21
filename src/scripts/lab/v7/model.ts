/** Canonical V7 target. World units, never randomly generated or seed dependent.
 * Each polygon is one continuous extrusion; openings are real empty space.
 * The four strata share a 0.15 unit detail grid and a 0.60 structural thickness.
 */
export type Point = readonly [number, number];
export type Finish = 'petrol' | 'graphite' | 'alloy';
export interface Volume {
  id: string;
  section: readonly Point[];
  depth: readonly [number, number];
  axis: 'front' | 'side';
  finish: Finish;
  joins: readonly string[];
  purpose: string;
}
const rectangle = (x:number,y:number,w:number,h:number):readonly Point[] => [[x,y],[x+w,y],[x+w,y+h],[x,y+h]];
export const volumes: readonly Volume[] = [
  {id:'west-plinth',section:rectangle(-3.6,0,3,0.6),depth:[-3,2.7],axis:'front',finish:'graphite',joins:['west-pier','rear-spine'],purpose:'Shared foundation of the western capability'},
  {id:'west-pier',section:rectangle(-3.6,.6,.75,2.85),depth:[-3,1.8],axis:'front',finish:'petrol',joins:['west-plinth','west-transfer'],purpose:'Offset load path; opens the lower chamber'},
  {id:'west-transfer',section:[[-3.6,3.45],[-1.35,3.45],[-1.35,2.55],[-.6,2.55],[-.6,4.2],[-3.6,4.2]],depth:[-3,2.7],axis:'front',finish:'graphite',joins:['west-pier','west-crown','central-sill'],purpose:'Deep cantilever with a stepped underside'},
  {id:'west-crown',section:[[-3.6,4.2],[-.6,4.2],[-.6,4.95],[-2.85,4.95],[-2.85,7.35],[-.6,7.35],[-.6,8.1],[-3.6,8.1]],depth:[-3,1.95],axis:'front',finish:'petrol',joins:['west-transfer','rear-spine','crown-link'],purpose:'Continuous C-shaped mass around the upper through-void'},
  {id:'east-plinth',section:rectangle(.6,0,3,.75),depth:[-3,3],axis:'front',finish:'petrol',joins:['east-lower','rear-spine'],purpose:'Eastern foundation with a distinct height'},
  // Side profiles use local x = world z, extrusion depth = world x.
  {id:'east-lower',section:[[-3,.75],[-2.25,.75],[-2.25,3.6],[2.25,3.6],[2.25,2.7],[3,2.7],[3,4.35],[-3,4.35]],depth:[.6,3.6],axis:'side',finish:'petrol',joins:['east-plinth','east-upper','central-sill'],purpose:'Side-facing open gallery; not a second front facade'},
  {id:'east-upper',section:[[-3,4.35],[3,4.35],[3,5.85],[2.4,5.85],[2.4,7.65],[1.8,7.65],[1.8,5.1],[-2.25,5.1],[-2.25,8.1],[-3,8.1]],depth:[.6,3.6],axis:'side',finish:'graphite',joins:['east-lower','crown-link','rear-spine'],purpose:'Reverse-folded upper chamber, asymmetric to the west'},
  {id:'crown-link',section:rectangle(-.6,7.35,1.2,.75),depth:[-3,.45],axis:'front',finish:'graphite',joins:['west-crown','east-upper','rear-spine'],purpose:'Recessed crown connection; leaves a vertical front incision'},
  {id:'rear-spine',section:rectangle(-.6,0,1.2,7.35),depth:[-3,-2.1],axis:'front',finish:'graphite',joins:['west-plinth','east-plinth','crown-link'],purpose:'Continuous rear spine, connects all strata'},
  {id:'central-sill',section:rectangle(-.6,3.45,1.2,.75),depth:[-2.1,1.05],axis:'front',finish:'alloy',joins:['west-transfer','east-lower','rear-spine'],purpose:'One precise cross-organization interface'},
  {id:'upper-key',section:rectangle(-.6,5.4,1.2,1.2),depth:[-2.1,1.05],axis:'front',finish:'petrol',joins:['rear-spine'],purpose:'Recessed upper articulation of the spine'},
  {id:'upper-interface',section:rectangle(-.6,5.1,2.7,.3),depth:[-2.1,1.05],axis:'front',finish:'alloy',joins:['upper-key','east-upper','rear-spine'],purpose:'Recessed transfer between differently oriented upper masses'},
  {id:'lower-interface',section:rectangle(-.6,.75,2.7,.6),depth:[-2.1,-.3],axis:'front',finish:'graphite',joins:['lower-key','east-plinth','rear-spine'],purpose:'Deep lower cross-link, independent of the upper gallery'},
  {id:'lower-key',section:rectangle(-.6,1.35,1.2,1.2),depth:[-2.1,1.05],axis:'front',finish:'graphite',joins:['rear-spine'],purpose:'Recessed lower articulation of the spine'},
];
export const dimensions = {width:7.2,height:8.1,depth:6,bevel:.022} as const;
/** Light lives on the underside of structural interfaces, never random faces. */
export const interfaces = [
 {id:'west-upper',position:[-1.8,7.32,-.1],size:[1.9,.025,3.7],power:11},
 {id:'west-lower',position:[-2.1,3.42,.15],size:[1.35,.025,3.6],power:9},
 {id:'east-upper',position:[2.1,5.07,0],size:[2,.025,3.9],power:10},
 {id:'east-lower',position:[2.1,3.57,-.1],size:[2,.025,3.9],power:8},
 {id:'central',position:[0,4.17,.15],size:[.85,.025,1.25],power:7},
] as const;
export const viewpoints = {
 primary:{position:[14,7.4,17],target:[0,4.05,0]},
 reverse:{position:[-15,10,-15],target:[0,4.05,0]},
 side:{position:[17,8,-12],target:[0,4.05,0]},
} as const;
export type Viewpoint = keyof typeof viewpoints;
