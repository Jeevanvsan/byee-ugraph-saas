import * as THREE from 'three';

declare module '@react-three/fiber' {
  // Extend JSX Intrinsic Elements
  export interface ThreeElements extends JSX.IntrinsicElements {
    // Core
    group: THREE.Group;
    mesh: THREE.Mesh;
    line: THREE.Line;
    points: THREE.Points;
    sprite: THREE.Sprite;
    portal: any;

    // Geometries
    boxGeometry: THREE.BoxGeometry;
    sphereGeometry: THREE.SphereGeometry;
    planeGeometry: THREE.PlaneGeometry;
    torusGeometry: THREE.TorusGeometry;
    circleGeometry: THREE.CircleGeometry;
    cylinderGeometry: THREE.CylinderGeometry;
    coneGeometry: THREE.ConeGeometry;
    extrudeGeometry: THREE.ExtrudeGeometry;
    latheGeometry: THREE.LatheGeometry;
    parametricGeometry: THREE.ParametricGeometry;
    polyhedronGeometry: THREE.PolyhedronGeometry;
    ringGeometry: THREE.RingGeometry;
    shapeGeometry: THREE.ShapeGeometry;
    textGeometry: THREE.TextGeometry;
    tubeGeometry: THREE.TubeGeometry;
    wireframeGeometry: THREE.WireframeGeometry;

    // Materials
    meshBasicMaterial: THREE.MeshBasicMaterial;
    meshDepthMaterial: THREE.MeshDepthMaterial;
    meshDistanceMaterial: THREE.MeshDistanceMaterial;
    meshLambertMaterial: THREE.MeshLambertMaterial;
    meshNormalMaterial: THREE.MeshNormalMaterial;
    meshPhongMaterial: THREE.MeshPhongMaterial;
    meshPhysicalMaterial: THREE.MeshPhysicalMaterial;
    meshStandardMaterial: THREE.MeshStandardMaterial;
    meshToonMaterial: THREE.MeshToonMaterial;
    pointsMaterial: THREE.PointsMaterial;
    rawShaderMaterial: THREE.RawShaderMaterial;
    shaderMaterial: THREE.ShaderMaterial;
    shadowMaterial: THREE.ShadowMaterial;
    spriteMaterial: THREE.SpriteMaterial;
    lineBasicMaterial: THREE.LineBasicMaterial;
    lineDashedMaterial: THREE.LineDashedMaterial;

    // Lights
    ambientLight: THREE.AmbientLight;
    directionalLight: THREE.DirectionalLight;
    pointLight: THREE.PointLight;
    spotLight: THREE.SpotLight;
    rectAreaLight: THREE.RectAreaLight;
    hemisphereLight: THREE.HemisphereLight;
    light: THREE.Light;
  }
}