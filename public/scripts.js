const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 10000);
const renderer = new THREE.WebGLRenderer();
const controls = new THREE.OrbitControls(camera, renderer.domElement);

const loader = new THREE.GLTFLoader();
const draco = new THREE.DRACOLoader();
draco.decoderPath = 'libs/draco/';
loader.setDRACOLoader(draco);

renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

scene.add(new THREE.AmbientLight(0xffffff, 0.2));
camera.add(new THREE.PointLight(0xffffff, 0.8));
scene.add(camera);
controls.target = new THREE.Vector3(0, 0, 0);
controls.update();

let originalScene;
let sceneName = 'impScene';

loader.load('https://cors-anywhere.herokuapp.com/https://drive.google.com/u/0/uc?id=1eX0fMaxfNP5hVaftnZngREdFfF8dhONI&export=download',
// loader.load('assets/compare.gltf',
	({ scene: importedScene }) => {
		importedScene.name = sceneName;
		center(importedScene);
		originalScene = importedScene.clone();
		scene.add(importedScene);
		// console.log(dumpObject(scene).join('\n'));
		// console.log(scene);
		renderer.render(scene, camera);
		animate();
	},
	xhr => {},
	error => console.log(error));

const animate = () => {
	requestAnimationFrame(animate);
	controls.update();
	const currDis = getDistance();
	// console.log(currDis, qDistance, quality)
	if (currDis <= qDistance && quality !== 1) {
		quality = 1;
		debounce(() => swapWithOriginal());
	} else if (currDis > qDistance) {
		let currQuality = Math.floor(10 * ((currDis - qDistance) / (initCamDistance - qDistance))) / 10;
		if (currQuality < .1) currQuality = .1;
		if (currQuality > .9) currQuality = .9;
		if (quality != currQuality) {
			quality = currQuality;
			debounce(() => {
				swapWithOriginal();
				modify(scene);
			});
		}
	}
	renderer.render(scene, camera);
};

window.addEventListener('resize', () => {
		camera.aspect = window.innerWidth / window.innerHeight;
		camera.updateProjectionMatrix();
		renderer.setSize(window.innerWidth, window.innerHeight);
  	}, false);
