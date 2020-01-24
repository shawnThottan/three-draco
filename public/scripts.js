const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 10000);
const renderer = new THREE.WebGLRenderer();
const controls = new THREE.OrbitControls(camera, renderer.domElement);

renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

scene.add(new THREE.AmbientLight(0xffffff, 0.3));
camera.add(new THREE.PointLight(0xffffff, 0.7));
scene.add(camera);
camera.position.set(500, 1000, 3000);
controls.target = new THREE.Vector3(500, 1000, 0);
controls.update();

const loader = new THREE.GLTFLoader();
const draco = new THREE.DRACOLoader();
draco.decoderPath = 'libs/draco/';
loader.setDRACOLoader(draco);

// loader.load('https://cors-anywhere.herokuapp.com/https://drive.google.com/u/0/uc?id=1eX0fMaxfNP5hVaftnZngREdFfF8dhONI&export=download',
loader.load('assets/compare.gltf',
	({ scene: importedScene }) => {
		scene.add(importedScene);
		console.log(dumpObject(scene).join('\n'));
		renderer.render(scene, camera);
	},
	xhr => {},
	error => console.log(error));

let prevDis = 3000;
const animate = () => {
	requestAnimationFrame(animate);
	controls.update();
	const dis = getDistance();
	if (dis < 500 && prevDis >= 500) {
		prevDis = dis;
		modify(.5);
	} else if (prevDis <= 500 && dis > 500) {
		prevDis = dis;
		modify(2);
	}
	renderer.render(scene, camera);
};
	
animate();


window.addEventListener('resize', () => {
		camera.aspect = window.innerWidth / window.innerHeight;
		camera.updateProjectionMatrix();
		renderer.setSize(window.innerWidth, window.innerHeight);
  	},false);
