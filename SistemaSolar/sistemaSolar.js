let renderer = null;
let scene = null;
let camera = null;
let currentTime = Date.now();

const MOON_TEXTURE_URL = './Textures/Luna.jpg';
const MOON_TEXTURE_MAP = new THREE.TextureLoader().load(MOON_TEXTURE_URL);
const MOON_BUMP_URL = './Bump/lunaBump.jpg';
const MOON_BUMP_MAP = new THREE.TextureLoader().load(MOON_BUMP_URL);
const MOON_MATERIAL = new THREE.MeshPhongMaterial({map: MOON_TEXTURE_MAP, bumpMap: MOON_BUMP_MAP, bumpScale: 0.06});

var distance = 5000;
// Un contenedor del sistema solar
let sistemaSolar = null;

//  Un arreglo con todos los planetas y su propia rotación
let planetas = [];

// Un arreglo con todas las lunas y su propia rotación
let lunas = [];

// contenedor de (Object3D objects)
// Cada planeta tiene una orbita con respecto a z y en el sol
let orbitaPlanetas = [];

// contenedor de (Object3D objects
//  Cada luna tiene una orbita con respecto a z y en cada planeta
let orbitaLunas = []

//Creamos un array con los planetas, asi como sus propiedades
const PLANET_DATA = [
  // Mercurio
  {
    radius: 0.382,
    moonCount: 0,
    textureMap: new THREE.TextureLoader().load('./Textures/Mercurio.jpg'),
    bumpMap: new THREE.TextureLoader().load('./Bump/01.jpg'),
    normalMap: null,
    orbitRadius: 3.9
  },
  // Venus
  {
    radius: 0.949,
    moonCount: 0,
    textureMap: new THREE.TextureLoader().load('./Textures/Venus.jpg'),
    bumpMap: new THREE.TextureLoader().load('./Bump/02.jpg'),
    normalMap: null,
    orbitRadius: 7.2
  },
  // Tierra
  {
    radius: 1,
    moonCount: 1,
    textureMap: new THREE.TextureLoader().load('./Textures/Tierra.jpg'),
    bumpMap: new THREE.TextureLoader().load('./Bump/03.jpg'),
    normalMap: new THREE.TextureLoader().load('./Normal/03.jpg'),
    orbitRadius: 10
  },
  // Marte
  {
    radius: 0.532,
    moonCount: 2,
    textureMap: new THREE.TextureLoader().load('./Textures/Marte.jpg'),
    bumpMap: new THREE.TextureLoader().load('./Bump/04.jpg'),
    normalMap: new THREE.TextureLoader().load('./Normal/04.jpg'),
    orbitRadius: 15.2
  },
  // Jupiter
  {
    radius: 5.2,
    moonCount: 5,
    textureMap: new THREE.TextureLoader().load('./Textures/Jupiter.jpg'),
    bumpMap: null,
    normalMap: null,
    orbitRadius: 52
  },
  // Saturno
  {
    radius: 9.54,
    moonCount: 5,
    textureMap: new THREE.TextureLoader().load('./Textures/Saturno.jpg'),
    bumpMap: null,
    normalMap: null,
    orbitRadius: 95.4
  },
  // Urano
  {
    radius: 19.18,
    moonCount: 5,
    textureMap: new THREE.TextureLoader().load('./Textures/Urano.jpg'),
    bumpMap: null,
    normalMap: null,
    orbitRadius: 191.8
  },
  // Neptuno
  {
    radius: 3.883,
    moonCount: 5,
    textureMap: new THREE.TextureLoader().load('./Textures/Neptuno.jpg'),
    bumpMap: null,
    normalMap: null,
    orbitRadius: 300.6
  },
  // Pluton
  {
    radius: 0.18,
    moonCount: 1,
    textureMap: new THREE.TextureLoader().load('./Textures/Pluton.jpg'),
    bumpMap: new THREE.TextureLoader().load('./Bump/09.jpg'),
    normalMap: null,
    orbitRadius: 394.4
  },
];




function main() {
    // declaramos el canvas
    canvas = document.getElementById("webglcanvas");

    // creamos la escena
    createScene(canvas);
    
    // llamamos a la funcion run
    run();
}

function animate() 
{
    let now = Date.now();
    let deltat = now - currentTime;
    currentTime = now;
    let fract = deltat / distance;
    let angle = Math.PI * 2 * fract;

    // añadimos las rotaciones de los planetas
    planetas.forEach(planeta => {
      planeta.rotation.y += angle;
    });

    // añadimos la rotacion de las lunas
    lunas.forEach(luna => {
      luna.rotation.y += angle;
    });

    // hacemos que los planetas realicen el movimiento de traslación
    orbitaPlanetas.forEach(orbitas => {
      orbitas.rotation.y += angle * Math.random();
    })

    // hacemos que las lunes realicen el movimiento de traslacion
    orbitaLunas.forEach(orbitas => {
      orbitas.rotation.y -= angle;
    })

}

function run() {
    requestAnimationFrame(function() { run(); });
    
    // Renderizamos la escena con la camara
    renderer.render( scene, camera );

    // llamamos la funcion animate
    animate();
}

function createScene(canvas)
{    
    // Creamos el renderer de three.js y lo añadimos al canvas
    renderer = new THREE.WebGLRenderer( { canvas: canvas, antialias: true } );

    // Declaramos el tamaño del viewport
    renderer.setSize(canvas.width, canvas.height);
    
    // Creamos una nueva escena de three.js
    scene = new THREE.Scene();

    // Ponemos el color del fondo
    scene.background = new THREE.Color( 0.15, 0.15, 0.15 );

    // Añadimos la camara
    camera = new THREE.PerspectiveCamera( 45, canvas.width / canvas.height, 1, 4000 );
    const controls = new THREE.OrbitControls( camera, renderer.domElement );
    camera.position.z = 20;
    controls.update();
    scene.add(camera);

    // Añadimos una luz direccional
    let luz = new THREE.DirectionalLight( 0xffffff, 1.0);

    // Posicionamos la luz al origen y la añadimos
    luz.position.set(-.5, .2, 1);
    luz.target.position.set(0,-2,0);
    scene.add(luz);

    // Iluminacion de toda la escena
    let luzAmbiental = new THREE.AmbientLight(0xffccaa, 0.2);
    scene.add(luzAmbiental);


  //Nuevo objeto de Three.js vacio como referencia del sistema solar
    sistemaSolar = new THREE.Object3D;

    createPlanets();

    let sun = createSun();
    sistemaSolar.add(sun);

    // cambiamos la orientacion del sistema solar
    sistemaSolar.rotation.x = Math.PI / 5;
    sistemaSolar.rotation.y = Math.PI / 5;
  
    scene.add(sistemaSolar);
    addMouseHandler(canvas, sistemaSolar, distance);
}

//Creamos al son con su geometría y propiedades
function createSun() {
  let solGeo = new THREE.SphereGeometry(10.9, 32, 32);
  texturaSol = new THREE.TextureLoader().load('./Textures/Sol.jpg');
  materialSol = new THREE.MeshPhongMaterial({map: texturaSol});
  let FiguraSol = new THREE.Mesh(solGeo, materialSol);
  
  return FiguraSol;
}

function createPlanets() {
  //Creamos cada planeta asi como sus propiedades
  for (let i = 0; i < PLANET_DATA.length; i++) {
    let planetaGeo = new THREE.SphereGeometry(PLANET_DATA[i].radius, 32, 32);
    let materialPlaneta;
    if (PLANET_DATA[i].normalMap != null) {
      // El planeta tiene un plano normal
      materialPlaneta = new THREE.MeshPhongMaterial({map: PLANET_DATA[i].textureMap, bumpMap: PLANET_DATA[i].bumpMap, bumpScale: 0.06, normalMap: PLANET_DATA[i].normalMap});
    } else if (PLANET_DATA[i].bumpMap != null) {
      // El planeta tiene un plano Bump
      materialPlaneta = new THREE.MeshPhongMaterial({map: PLANET_DATA[i].textureMap, bumpMap: PLANET_DATA[i].bumpMap, bumpScale: 0.06});
    } else {
      // El planeta solo tiene textura
      materialPlaneta = new THREE.MeshPhongMaterial({map: PLANET_DATA[i].textureMap});
    }

    //Hacemos el mesh de los planetas y sus rotaciones en su posicion respecto a z
    let figuraPlaneta = new THREE.Mesh(planetaGeo, materialPlaneta);
    figuraPlaneta.position.set(0.0, 0.0, PLANET_DATA[i].orbitRadius * 7);
    planetas.push(figuraPlaneta);

    planetOffsetGroup = new THREE.Object3D;
    planetOffsetGroup.add(figuraPlaneta);
    planetOffsetGroup.position.set(0.0, 0.0, 0.0);
    orbitaPlanetas.push(planetOffsetGroup);

    // Creamos el anillo de cada planeta dentro del sistema solar
    const anilloGeo = new THREE.RingGeometry( PLANET_DATA[i].orbitRadius* 7-.025, PLANET_DATA[i].orbitRadius* 7 +.025, 45 );
    const anilloMaterial = new THREE.MeshBasicMaterial( { color: 0xffffff, side: THREE.DoubleSide } );
    const anillo = new THREE.Mesh( anilloGeo, anilloMaterial );
    scene.add( anillo );
    anillo.rotation.x = Math.PI / 2;


    if (PLANET_DATA[i].moonCount > 0) {
      let moonCount = PLANET_DATA[i].moonCount;
      console.log(moonCount);
      for (let i = 0; i < moonCount; i++) {
        let figuraLuna = createMoonFigure();
        figuraLuna.position.set(randVal(-1, 1),randVal(-1, 1), PLANET_DATA[i].radius + 0.5);
        
        moonOffsetGroup = new THREE.Object3D;
        moonOffsetGroup.add(figuraLuna);
        moonOffsetGroup.position.set(figuraPlaneta.position.x, 0.0, figuraPlaneta.position.z);
        orbitaLunas.push(moonOffsetGroup);
        
        planetOffsetGroup.add(moonOffsetGroup);
      }
    }

    sistemaSolar.add(planetOffsetGroup);
    sistemaSolar.add(anillo);
    
  }
}


function randVal(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function createMoonFigure() {
  let lunaGEO = new THREE.SphereGeometry(.5, 32, 32);
  let figuraLuna = new THREE.Mesh(lunaGEO, MOON_MATERIAL);
  
  // Modificamos la escala
  figuraLuna.scale.set(0.35, 0.35, 0.35);
  
  // Vamos añadiendo cada luna al planeta correspondiente
  lunas.push(figuraLuna);
  return figuraLuna;
}