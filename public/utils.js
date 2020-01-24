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

const getDistance = () => {
    camera.updateMatrixWorld();
    var point1 = camera.position.clone();
    var point2 = new THREE.Vector3(0, 1000, 0);
    return point1.distanceTo(point2);
}

const modify = ratio => {
    var modifier = new SimplifyModifier();
    let shirtGeometry = scene.children[2].children[2].children[0].geometry;
    console.log(shirtGeometry);
    shirtGeometry = modifier.modify(shirtGeometry, shirtGeometry.attributes.position.count * ratio);
    console.log(shirtGeometry)
    scene.children[2].children[2].children[0].geometry = shirtGeometry;
    /*
    let collarGeometry = scene.children[2].children[2].children[1].geometry;
    collarGeometry = modifier.modify(collarGeometry, collarGeometry.attributes.position.length * ratio);
    scene.children[2].children[2].children[1].geometry = collarGeometry;
    let bodyGeometry = scene.children[2].children[3].geometry;
    bodyGeometry = modifier.modify(bodyGeometry, bodyGeometry.attributes.position.length * ratio);
    scene.children[2].children[3].geometry = bodyGeometry;
    */
}
