// logs the structure of the file
const dumpObject = (obj, lines = [], isLast = true, prefix = '') => {
    const localPrefix = isLast ? '└─' : '├─';
    lines.push(`${prefix}${prefix ? localPrefix : ''}${obj.name || '*no-name*'} [${obj.type}]`);
    const newPrefix = prefix + (isLast ? '  ' : '│ ');
    const lastNdx = obj.children.length - 1;
    obj.children.forEach((child, ndx) => {
        const isLast = ndx === lastNdx;
        dumpObject(child, lines, isLast, newPrefix);
    });
    return lines;
}

// places the object at the center.
let bbox;
let initCamDistance;
let qDistance
const center = (scene) => {
    bbox = new THREE.Box3().setFromObject(scene);
    const xd = Math.abs(bbox.max.x - bbox.min.x);
    scene.translateX(xd/2 - bbox.max.x);
    const yd = Math.abs(bbox.max.y - bbox.min.y);
    scene.translateY(yd/2 - bbox.max.y);
    const zd = Math.abs(bbox.max.z - bbox.min.z);
    scene.translateZ(zd/2 - bbox.max.z);
    qDistance = zd;
    initCamDistance = zd * 10;
    camera.position.set(0, 0, initCamDistance);
}

// returns the distance from the bounding box to the camera.
const getDistance = () => {
    camera.updateMatrixWorld();
    return bbox.distanceToPoint(camera.position.clone());
}

// converts the high quality object to a simpler mesh based on the distance from the camera.
const modifier = new SimplifyModifier();
const simplify = (scene, ratio) => scene.traverse(child => {
    if (child.type == 'Mesh') {
        const { geometry, material } = child;
        material.flatShading = true;
        child.material = material.clone();
        try {
            const geo = modifier.modify(geometry, Math.floor(geometry.attributes.position.count * 2.5 * ratio));
            child.geometry = geo;
        } catch(err) {
            console.log(err);
        }
    }
});

// converts the low quality object to a more polygon rich mesh based on the distance from the camera.
const unSimplify = (scene, ratio) => {
    const unModifier = new SubdivisionModifier(ratio);
    scene.traverse(child => {
        if (child.type == 'Mesh') {
            try {
                geometry = unModifier.modify(child.geometry);
                child.geometry = new THREE.BufferGeometry().fromGeometry(geometry);
                console.log(child)
            } catch(err) {
                console.log(err);
            }
        }
    });
}

// adds a debounce to delay the simplification process.
let debounceTimer;
const debounce = func => {
    clearTimeout(debounceTimer) 
    debounceTimer = setTimeout(() => func(), 300);
}  
