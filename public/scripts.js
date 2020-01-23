const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 10000 );
const renderer = new THREE.WebGLRenderer();
const controls = new THREE.OrbitControls(camera, renderer.domElement);

renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

scene.add(new THREE.AmbientLight());

camera.position.set(500, 1000, 3000);
controls.target = new THREE.Vector3(500, 1000, 0);
controls.update();

const loader = new THREE.GLTFLoader();
const dracoLoader = new THREE.DRACOLoader();
dracoLoader.setDecoderPath( '/libs/decoder/draco_decoder.js' );

loader.setDRACOLoader( dracoLoader );

// loader.load('https://cors-anywhere.herokuapp.com/https://drive.google.com/u/0/uc?id=1eX0fMaxfNP5hVaftnZngREdFfF8dhONI&export=download',
loader.load('assets/compare.gltf',
	gltf => {
		scene.add(gltf.scene);
		renderer.render(scene, camera);
	},
	xhr => {},
	error => console.log(error));

let prevZDis = Math.abs(camera.position.z);
const animate = () => {
	requestAnimationFrame(animate);
	controls.update();
	const zDis = Math.abs(camera.position.z);
	if (zDis < 50 && prevZDis > 50) {
		prevZDis = zDis;
		// TODO: decompress accordingly
	} else if (zDis < 100 && prevZDis > 100) {
		prevZDis = zDis;
		// TODO: decompress accordingly
	}
	renderer.render(scene, camera);
};
	
animate();
