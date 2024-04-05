/*
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
~~~~~~~~~~~~~~~~~~~~~~~~~~~    UNIVERSIDAD TECNOLOGIA DE PANAMÁ   ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
~~~~~~~     Proyecto n°2 - Herramientas de Computaión Gráfica                         ~~~~~~~~~
~~~~~~~     Integrantes:                                                              ~~~~~~~~~
~~~~~~~         ~Alberto Somoza (8-983-606)                                           ~~~~~~~~~
~~~~~~~         ~Diego Rangel (8-985-2348)                                            ~~~~~~~~~
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
*/

import * as THREE from 'three';
import { OrbitControls } from './jsm/controls/OrbitControls.js'
import Stats from './jsm/libs/stats.module.js'
import { RenderPass } from './jsm/postprocessing/RenderPass.js'
import { UnrealBloomPass } from './jsm/postprocessing/UnrealBloomPass.js'
import { EffectComposer } from './jsm/postprocessing/EffectComposer.js'

//Coeficiete de velocidad para los planetas
let velCoef = 1

const scene = new THREE.Scene()

const camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.1, 50000)
camera.position.set(870 ,2700 ,1500)
camera.lookAt(scene.position)

const renderer = new THREE.WebGLRenderer({antialias: true})
renderer.autoClear = false
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)

const controls = new OrbitControls(camera, renderer.domElement)

const skyBoxGeo = new THREE.SphereGeometry(15000, 1000, 1000);
const skyBoxText = new THREE.TextureLoader().load('/img/milkyway.jpg')
const skyBoxMat = new THREE.MeshBasicMaterial({
    map: skyBoxText,
    side: THREE.BackSide,
    color: 0xffffff,
    transparent: true
});

const skyBox = new THREE.Mesh(skyBoxGeo, skyBoxMat)
skyBox.castShadow = true
skyBox.receiveShadow = true
skyBox.layers.set(1)
scene.add(skyBox)

//Luces
const light = new THREE.PointLight(0xffffff, 2);
light.position.set(0, 0, 0)
scene.add(light);

const ambientLight = new THREE.AmbientLight(0xffffff, 0.15)
scene.add(ambientLight)
//Sol
const sunText = new THREE.TextureLoader().load('/img/sun2.jpg')

const sunLightGeo = new THREE.SphereGeometry(520, 64, 64)
const sunLightMat = new THREE.MeshBasicMaterial({
    color: 0xfd8813,
    map: sunText
})
const sunLightMesh = new THREE.Mesh(sunLightGeo, sunLightMat);
sunLightMesh.castShadow = true;
sunLightMesh.receiveShadow = false;
sunLightMesh.position.set(0, 0, 0)
sunLightMesh.layers.set(1)
scene.add(sunLightMesh)

const sunGeo = new THREE.SphereGeometry(568, 64, 64)
const sunMat = new THREE.MeshBasicMaterial({
    map:sunText,
    color: 0xfd8813
})

const sun = new THREE.Mesh(sunGeo, sunMat);
sun.rotation.x = Math.PI / 24;
scene.add(sun)

//Mercurio
const mercuryText = new THREE.TextureLoader().load('/img/mercury.webp')
const mercury = createPlanet(70, mercuryText, [1800, 0, 0])
scene.add(mercury)

//Venus
const venusText = new THREE.TextureLoader().load('/img/venus.jpg')
const venus = createPlanet(100, venusText, [-2500, 0, -1800])
scene.add(venus)

//Tierra
const earthText = new THREE.TextureLoader().load('/img/earth.webp')
const earth = createPlanet(180, earthText, [3600, 0, -2900])
scene.add(earth)

//Marte
const marsText = new THREE.TextureLoader().load('/img/mars.jpg')
const mars = createPlanet(160, marsText, [-4700, 0, 3600])
scene.add(mars)

//Jupiter
const jupyterText = new THREE.TextureLoader().load('/img/jupiter.jpg')
const jupyter = createPlanet(480, jupyterText, [-8900, 0, 0])
scene.add(jupyter)

//Saturno
const saturnText = new THREE.TextureLoader().load('/img/saturno.jpg')
const saturn = createPlanet(400, saturnText, [9900, 0, 0], true)
scene.add(saturn)

//Uranus
const uranusText = new THREE.TextureLoader().load('/img/urano.jpg')
const uranus = createPlanet(300, uranusText, [0, 0, -10500])
scene.add(uranus)  

//Neptuno
const neptuneText = new THREE.TextureLoader().load('/img/neptuno.jpg')
const neptune = createPlanet(290, neptuneText, [-11300, 0, 0])
scene.add(neptune)

//Pluton mi libro luna de pluton ya esta disponible en roda latinoamerica
const plutonText = new THREE.TextureLoader().load('/img/pluton.jpg')
const pluton = createPlanet(50, plutonText, [14800, 0, 0])
scene.add(pluton)

//Post-Procesado
const renderScene = new RenderPass( scene, camera )
	
const bloomPass = new UnrealBloomPass( new THREE.Vector2( window.innerWidth, window.innerHeight ), 1.5, 0.4, 0.85 )
bloomPass.threshold = 0.21
bloomPass.strength = 2.6
bloomPass.radius = 0.025
bloomPass.renderToScreen = true
	
const composer = new EffectComposer( renderer )
composer.setSize( window.innerWidth, window.innerHeight )
composer.addPass( renderScene )
composer.addPass( bloomPass )

window.addEventListener(
    'resize',
    () => {
        camera.aspect = window.innerWidth / window.innerHeight
        camera.updateProjectionMatrix()
        renderer.setSize(window.innerWidth, window.innerHeight)
        composer.setSize(window.innerWidth, window.innerHeight)
        render()
    },
    false
)

const stats = Stats()
document.body.appendChild(stats.dom)

function animate() {
    requestAnimationFrame(animate)

    rotatePlanets()
    createOrbit(mercury, 1.8)
    createOrbit(venus, 0.4)
    createOrbit(earth, 0.17)
    createOrbit(mars, 0.053)
    createOrbit(jupyter, 0.01)
    createOrbit(saturn, 0.006)
    createOrbit(uranus, 0.002)
    createOrbit(neptune, 0.0006)
    createOrbit(pluton, 0.0001)

    renderer.clear()
    camera.layers.set(1)
    controls.update()
    composer.render()
    renderer.clearDepth()
    camera.layers.set(0)

    controls.update()
    render()
    stats.update()
}

function render() {
    renderer.render(scene, camera)
}

function createPlanet(diameter, texture, position = [0, 0, 0], ring = false){
    const sphereGeo = new THREE.SphereGeometry(diameter, 64, 64)
    const planetMat = new THREE.MeshStandardMaterial({
        map:texture,
        color: 0xfd8813
    })

    let ringMesh

    const planetMesh = new THREE.Mesh(sphereGeo, planetMat);
    planetMesh.rotation.x = Math.PI / 24;

    if(ring){
        const insDiam = diameter + (2 * diameter / 9);
        const outDiam = insDiam + (2 * insDiam / 3)
        const ringGeo = new THREE.RingGeometry(insDiam, outDiam, 128);
        //https://firebasestorage.googleapis.com/v0/b/farpoint-js.appspot.com/o/saturn%2Fsaturn-ring.webp?alt=media&token=76117245-5be7-4c23-aee1-f33696f0d256
        const ringText = new THREE.TextureLoader().load("https://firebasestorage.googleapis.com/v0/b/farpoint-js.appspot.com/o/saturn%2Fsaturn-ring.webp?alt=media&token=76117245-5be7-4c23-aee1-f33696f0d256")
        const ringMat = new THREE.MeshStandardMaterial({
            map: ringText,
            side: THREE.DoubleSide,
            transparent: true
        });

        const rings = new THREE.Mesh(ringGeo, ringMat);
        rings.rotation.x = Math.PI / 2;
        rings.rotation.y = Math.PI / 12;

        ringMesh = rings
    }

    const planet = new THREE.Group();
    planet.position.set(position[0], position[1], position[2])
    planet.add(planetMesh)
    if(ring){
        planet.add(ringMesh);
    }

    return planet;
}

function rotatePlanets(){
    sun.rotation.y += 0.0005

    mercury.rotation.y += 0.001

    venus.rotation.y += 0.0008

    earth.rotation.y += 0.001

    mars.rotation.y += 0.0008
    
    jupyter.rotation.y += 0.001

    saturn.rotation.y += 0.0002

    uranus.rotation.y += 0.005

    neptune.rotation.y += 0.005

    pluton.rotation.y += 0.0008
}

function createOrbit(planet, velCoef){
    const date = Date.now() * 0.0001

    const orbitRadius = Math.sqrt(Math.pow(planet.position.x, 2) + Math.pow(planet.position.z, 2))

    planet.position.set(
        Math.cos(date * velCoef) * orbitRadius,
        0,
        Math.sin(date * velCoef) * orbitRadius
    )
}

animate()