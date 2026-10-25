import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';

/* ======================================================================
   Geometry helpers
   ====================================================================== */
const UP = new THREE.Vector3(0, 1, 0);

function strut(a: THREE.Vector3, b: THREE.Vector3, r: number, sides = 5) {
  const dir = new THREE.Vector3().subVectors(b, a);
  const len = dir.length();
  const g = new THREE.CylinderGeometry(r, r, len, sides, 1, true);
  const q = new THREE.Quaternion().setFromUnitVectors(UP, dir.normalize());
  g.applyQuaternion(q);
  const mid = new THREE.Vector3().addVectors(a, b).multiplyScalar(0.5);
  g.translate(mid.x, mid.y, mid.z);
  g.deleteAttribute('uv');
  return g;
}

/** Four-legged tapered lattice tower with X-bracing, merged into one geometry. */
function latticeTower(height: number, base: number, top: number, segments: number, detail: 'high' | 'low') {
  const parts: THREE.BufferGeometry[] = [];
  const legR = detail === 'high' ? 0.055 : 0.07;
  const braceR = detail === 'high' ? 0.018 : 0.028;
  const corner = (y: number, i: number) => {
    const t = y / height;
    const h = base + (top - base) * t;
    const sx = i === 0 || i === 3 ? -1 : 1;
    const sz = i < 2 ? -1 : 1;
    return new THREE.Vector3(sx * h, y, sz * h);
  };
  for (let i = 0; i < 4; i++) parts.push(strut(corner(0, i), corner(height, i), legR, 6));
  for (let s = 0; s < segments; s++) {
    const y0 = (height / segments) * s;
    const y1 = (height / segments) * (s + 1);
    for (let i = 0; i < 4; i++) {
      const j = (i + 1) % 4;
      parts.push(strut(corner(y1, i), corner(y1, j), braceR));
      parts.push(strut(corner(y0, i), corner(y1, j), braceR));
      if (detail === 'high') parts.push(strut(corner(y0, j), corner(y1, i), braceR));
    }
  }
  // Top platform ring + antenna mounting pipes
  for (let i = 0; i < 4; i++) {
    const a = corner(height, i).multiplyScalar(1).setY(height);
    const b = corner(height, (i + 1) % 4).setY(height);
    parts.push(strut(a.clone().multiplyScalar(1.6).setY(height - 0.05), b.clone().multiplyScalar(1.6).setY(height - 0.05), 0.03));
  }
  const geo = mergeGeometries(parts, false)!;
  parts.forEach((p) => p.dispose());
  return geo;
}

/** Parabolic reflector opening toward +Z (vertex at origin). */
function dishGeometry(R: number, f: number, seg: number) {
  const pts: THREE.Vector2[] = [];
  const n = 18;
  for (let i = 0; i <= n; i++) {
    const r = (R * i) / n;
    pts.push(new THREE.Vector2(r, (r * r) / (4 * f)));
  }
  const g = new THREE.LatheGeometry(pts, seg);
  g.rotateX(Math.PI / 2);
  return g;
}

/* ======================================================================
   Materials
   ====================================================================== */
const beamVertex = /* glsl */ `
  varying vec2 vUv;
  varying vec3 vN;
  varying vec3 vView;
  void main() {
    vUv = uv;
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    vView = normalize(-mv.xyz);
    vN = normalize(normalMatrix * normal);
    gl_Position = projectionMatrix * mv;
  }
`;
const beamFragment = /* glsl */ `
  uniform float uTime;
  uniform float uIntensity;
  uniform vec3 uColor;
  varying vec2 vUv;
  varying vec3 vN;
  varying vec3 vView;
  void main() {
    float along = vUv.y;               // 0 at receiver end, 1 at emitter
    float rim = pow(1.0 - abs(dot(vN, vView)), 1.4);
    float core = 1.0 - rim;
    float pulses = smoothstep(0.82, 1.0, sin((along * 26.0) + uTime * 5.0) * 0.5 + 0.5);
    float fadeEnds = smoothstep(0.0, 0.06, along) * smoothstep(1.0, 0.94, along);
    float a = (0.16 + core * 0.38 + pulses * 0.6 * core) * fadeEnds * uIntensity;
    gl_FragColor = vec4(uColor * (0.9 + pulses * 0.8), a);
  }
`;

const groundVertex = /* glsl */ `
  varying vec3 vW;
  void main() {
    vec4 w = modelMatrix * vec4(position, 1.0);
    vW = w.xyz;
    gl_Position = projectionMatrix * viewMatrix * w;
  }
`;
const groundFragment = /* glsl */ `
  uniform float uTime;
  varying vec3 vW;
  float gridLine(vec2 p, float size, float width) {
    vec2 g = abs(fract(p / size - 0.5) - 0.5) / fwidth(p / size);
    return 1.0 - min(min(g.x, g.y) / width, 1.0);
  }
  void main() {
    float d = length(vW.xz - vec2(0.0, -6.0));
    float fine = gridLine(vW.xz, 1.0, 1.0) * 0.35;
    float major = gridLine(vW.xz, 5.0, 1.2) * 0.7;
    float fade = exp(-d * 0.055);
    float sweep = smoothstep(0.0, 1.0, 1.0 - abs(fract(d * 0.04 - uTime * 0.05) - 0.5) * 8.0) * 0.25;
    vec3 col = vec3(0.31, 0.85, 0.92) * (fine + major) * fade + vec3(0.31, 0.85, 0.92) * sweep * fade * major;
    vec3 base = vec3(0.012, 0.02, 0.035);
    gl_FragColor = vec4(base + col, 1.0);
  }
`;

/* ======================================================================
   Scene objects
   ====================================================================== */
type Detail = 'high' | 'low';

function Tower({ position, height, detail }: { position: [number, number, number]; height: number; detail: Detail }) {
  const geo = useMemo(() => latticeTower(height, 0.75, 0.22, detail === 'high' ? 11 : 7, detail), [height, detail]);
  useEffect(() => () => geo.dispose(), [geo]);
  return (
    <group position={position}>
      <mesh geometry={geo} castShadow={false}>
        <meshStandardMaterial color="#8b9bb0" metalness={0.85} roughness={0.38} />
      </mesh>
      {/* Aviation light */}
      <mesh position={[0, height + 0.35, 0]}>
        <sphereGeometry args={[0.07, 12, 12]} />
        <meshBasicMaterial color="#ff5a5a" toneMapped={false} />
      </mesh>
      <mesh position={[0, height, 0]}>
        <cylinderGeometry args={[0.03, 0.03, 0.7, 6]} />
        <meshStandardMaterial color="#9aa8ba" metalness={0.8} roughness={0.4} />
      </mesh>
      {/* Sector antennas near the top */}
      {[0, (2 * Math.PI) / 3, (4 * Math.PI) / 3].map((a, i) => (
        <mesh key={i} position={[Math.sin(a) * 0.55, height - 0.55, Math.cos(a) * 0.55]} rotation={[0, a, 0]}>
          <boxGeometry args={[0.22, 1.1, 0.08]} />
          <meshStandardMaterial color="#c9d3df" metalness={0.2} roughness={0.6} />
        </mesh>
      ))}
    </group>
  );
}

function MicrowaveAntenna({
  position,
  target,
  radius,
  detail,
}: {
  position: THREE.Vector3;
  target: THREE.Vector3;
  radius: number;
  detail: Detail;
}) {
  const ref = useRef<THREE.Group>(null);
  const seg = detail === 'high' ? 48 : 24;
  const f = radius * 0.62; // f/D ≈ 0.31, typical for MW reflectors
  const dish = useMemo(() => dishGeometry(radius, f, seg), [radius, f, seg]);
  const depth = (radius * radius) / (4 * f);
  useEffect(() => () => dish.dispose(), [dish]);
  useEffect(() => {
    ref.current?.lookAt(target);
  }, [target]);

  return (
    <group position={position} ref={ref}>
      {/* Reflector */}
      <mesh geometry={dish}>
        <meshStandardMaterial color="#cfd8e3" metalness={0.45} roughness={0.38} side={THREE.DoubleSide} />
      </mesh>
      {/* Shroud */}
      <mesh position={[0, 0, depth + radius * 0.12]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[radius * 1.01, radius * 1.01, radius * 0.24, seg, 1, true]} />
        <meshStandardMaterial color="#d7dee7" metalness={0.3} roughness={0.45} side={THREE.DoubleSide} />
      </mesh>
      {/* Rim ring */}
      <mesh position={[0, 0, depth + radius * 0.24]}>
        <torusGeometry args={[radius * 1.01, radius * 0.025, 8, seg]} />
        <meshStandardMaterial color="#f3f6fa" metalness={0.2} roughness={0.4} />
      </mesh>
      {/* Radome (semi-transparent) */}
      <mesh position={[0, 0, depth + radius * 0.24]}>
        <circleGeometry args={[radius * 1.01, seg]} />
        <meshStandardMaterial color="#f3f6fa" transparent opacity={0.08} roughness={0.9} side={THREE.DoubleSide} depthWrite={false} />
      </mesh>
      {/* Feed */}
      <mesh position={[0, 0, f * 0.5]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[radius * 0.06, radius * 0.08, f, 12]} />
        <meshStandardMaterial color="#9aa7b7" metalness={0.8} roughness={0.3} />
      </mesh>
      {/* ODU radio unit behind the dish */}
      <group position={[0, 0, -radius * 0.32]}>
        <mesh>
          <boxGeometry args={[radius * 0.78, radius * 0.78, radius * 0.38]} />
          <meshStandardMaterial color="#58677a" metalness={0.65} roughness={0.42} />
        </mesh>
        {Array.from({ length: detail === 'high' ? 7 : 4 }).map((_, i, arr) => (
          <mesh key={i} position={[(i - (arr.length - 1) / 2) * radius * 0.1, 0, -radius * 0.22]}>
            <boxGeometry args={[radius * 0.025, radius * 0.7, radius * 0.08]} />
            <meshStandardMaterial color="#465466" metalness={0.7} roughness={0.4} />
          </mesh>
        ))}
        {/* Status LED */}
        <mesh position={[radius * 0.28, radius * 0.28, -radius * 0.195]}>
          <sphereGeometry args={[radius * 0.03, 8, 8]} />
          <meshBasicMaterial color="#4fd8eb" toneMapped={false} />
        </mesh>
      </group>
      {/* Mount bracket */}
      <mesh position={[0, -radius * 0.2, -radius * 0.65]}>
        <boxGeometry args={[radius * 0.12, radius * 0.9, radius * 0.12]} />
        <meshStandardMaterial color="#7a889a" metalness={0.8} roughness={0.35} />
      </mesh>
    </group>
  );
}

function Beam({ from, to, reduced }: { from: THREE.Vector3; to: THREE.Vector3; reduced: boolean }) {
  const mat = useRef<THREE.ShaderMaterial>(null);
  const { geo, fresnel, len, quat, mid } = useMemo(() => {
    const dir = new THREE.Vector3().subVectors(from, to);
    const len = dir.length();
    const g = new THREE.CylinderGeometry(0.12, 0.42, len, 32, 1, true); // top (emitter) → bottom (receiver)
    const quat = new THREE.Quaternion().setFromUnitVectors(UP, dir.clone().normalize());
    const mid = new THREE.Vector3().addVectors(from, to).multiplyScalar(0.5);
    const fresnel = new THREE.SphereGeometry(1, 28, 10);
    return { geo: g, fresnel, len, quat, mid };
  }, [from, to]);
  useEffect(() => () => {
    geo.dispose();
    fresnel.dispose();
  }, [geo, fresnel]);

  const uniforms = useMemo(
    () => ({ uTime: { value: 0 }, uIntensity: { value: 0 }, uColor: { value: new THREE.Color('#4fd8eb') } }),
    [],
  );

  useFrame((_, dt) => {
    if (!mat.current) return;
    uniforms.uTime.value += reduced ? 0 : dt;
    uniforms.uIntensity.value = THREE.MathUtils.damp(uniforms.uIntensity.value, 1, 1.4, dt);
  });

  return (
    <group position={mid} quaternion={quat}>
      <mesh geometry={geo}>
        <shaderMaterial
          ref={mat}
          vertexShader={beamVertex}
          fragmentShader={beamFragment}
          uniforms={uniforms}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          side={THREE.DoubleSide}
        />
      </mesh>
      {/* Bright core */}
      <mesh>
        <cylinderGeometry args={[0.018, 0.018, len, 6, 1, true]} />
        <meshBasicMaterial color="#9be8f3" transparent opacity={0.55} blending={THREE.AdditiveBlending} depthWrite={false} toneMapped={false} />
      </mesh>
      {/* First Fresnel zone envelope — illustrative proportions */}
      <mesh geometry={fresnel} scale={[0.9, len / 2, 0.9]}>
        <meshBasicMaterial color="#4fd8eb" wireframe transparent opacity={0.035} depthWrite={false} />
      </mesh>
    </group>
  );
}

function Pulses({ from, to, reduced }: { from: THREE.Vector3; to: THREE.Vector3; reduced: boolean }) {
  const a = useRef<THREE.Mesh>(null);
  const b = useRef<THREE.Mesh>(null);
  const tmp = useMemo(() => new THREE.Vector3(), []);
  useFrame(({ clock }) => {
    const t = reduced ? 0.35 : clock.elapsedTime;
    const pa = (t * 0.32) % 1;
    const pb = ((t * 0.32 + 0.5) % 1);
    if (a.current) {
      a.current.position.copy(tmp.lerpVectors(from, to, pa));
      a.current.scale.setScalar(0.6 + Math.sin(pa * Math.PI) * 0.6);
    }
    if (b.current) {
      b.current.position.copy(tmp.lerpVectors(to, from, pb));
      b.current.scale.setScalar(0.4 + Math.sin(pb * Math.PI) * 0.4);
    }
  });
  return (
    <>
      <mesh ref={a}>
        <sphereGeometry args={[0.09, 16, 16]} />
        <meshBasicMaterial color="#c9f6fc" toneMapped={false} />
      </mesh>
      <mesh ref={b}>
        <sphereGeometry args={[0.07, 16, 16]} />
        <meshBasicMaterial color="#2bb8a6" toneMapped={false} />
      </mesh>
    </>
  );
}

function Ground({ reduced }: { reduced: boolean }) {
  const uniforms = useMemo(() => ({ uTime: { value: 0 } }), []);
  useFrame((_, dt) => {
    if (!reduced) uniforms.uTime.value += dt;
  });
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, -10]}>
      <planeGeometry args={[160, 160, 1, 1]} />
      <shaderMaterial vertexShader={groundVertex} fragmentShader={groundFragment} uniforms={uniforms} />
    </mesh>
  );
}

function Ridges() {
  // Low, distant terrain silhouettes for atmospheric depth.
  const ridges = useMemo(
    () =>
      [
        { x: -26, z: -55, s: [22, 6, 10] },
        { x: -4, z: -62, s: [30, 8.5, 10] },
        { x: 22, z: -58, s: [26, 5.5, 10] },
        { x: 40, z: -50, s: [18, 4, 10] },
      ] as const,
    [],
  );
  return (
    <>
      {ridges.map((r, i) => (
        <mesh key={i} position={[r.x, 0, r.z]} scale={r.s as unknown as [number, number, number]}>
          <coneGeometry args={[1, 1, 5]} />
          <meshStandardMaterial color="#0a1524" roughness={1} />
        </mesh>
      ))}
    </>
  );
}

/* ======================================================================
   Camera rig — restrained mouse parallax + scroll dolly
   ====================================================================== */
function Rig({ pointer, scroll, mobile, reduced }: { pointer: React.RefObject<{ x: number; y: number }>; scroll: React.RefObject<number>; mobile: boolean; reduced: boolean }) {
  const { camera } = useThree();
  const look = useMemo(() => new THREE.Vector3(), []);
  const base = useMemo(() => (mobile ? new THREE.Vector3(3.6, 8.5, 22) : new THREE.Vector3(0.6, 4.9, 17.5)), [mobile]);
  const target = useMemo(() => (mobile ? new THREE.Vector3(1.4, 0.5, -8) : new THREE.Vector3(-0.6, 5.0, -8)), [mobile]);

  useFrame(({ clock }, dt) => {
    const p = pointer.current ?? { x: 0, y: 0 };
    const s = scroll.current ?? 0;
    const t = reduced ? 0 : clock.elapsedTime;
    const px = reduced ? 0 : p.x;
    const py = reduced ? 0 : p.y;
    const goal = new THREE.Vector3(
      base.x + px * 0.9 + Math.sin(t * 0.12) * 0.35,
      base.y + py * 0.45 + s * 1.6,
      base.z - s * 3.5,
    );
    camera.position.x = THREE.MathUtils.damp(camera.position.x, goal.x, 2.4, dt);
    camera.position.y = THREE.MathUtils.damp(camera.position.y, goal.y, 2.4, dt);
    camera.position.z = THREE.MathUtils.damp(camera.position.z, goal.z, 2.4, dt);
    look.set(target.x + px * 0.4, target.y + py * 0.2, target.z);
    camera.lookAt(look);
  });
  return null;
}

/* ======================================================================
   Exported scene
   ====================================================================== */
export interface HeroSceneProps {
  reduced: boolean;
  lowPower: boolean;
  mobile: boolean;
  onReady?: () => void;
}

export default function HeroScene({ reduced, lowPower, mobile, onReady }: HeroSceneProps) {
  const wrap = useRef<HTMLDivElement>(null);
  const pointer = useRef({ x: 0, y: 0 });
  const scroll = useRef(0);
  const [inView, setInView] = useState(true);
  const detail: Detail = lowPower || mobile ? 'low' : 'high';

  // Endpoints (world space)
  const towerA: [number, number, number] = [5.2, 0, 0];
  const towerB: [number, number, number] = [-7.5, 0, -30];
  const dishA = useMemo(() => new THREE.Vector3(4.5, 7.3, 0.15), []);
  const dishB = useMemo(() => new THREE.Vector3(-7.0, 7.0, -29.6), []);

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      pointer.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.current.y = -((e.clientY / window.innerHeight) * 2 - 1);
    };
    const onScroll = () => {
      scroll.current = Math.min(1, window.scrollY / Math.max(1, window.innerHeight));
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('scroll', onScroll, { passive: true });
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { threshold: 0 });
    if (wrap.current) io.observe(wrap.current);
    return () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('scroll', onScroll);
      io.disconnect();
    };
  }, []);

  return (
    <div ref={wrap} className="absolute inset-0">
      <Canvas
        frameloop={!inView ? 'never' : reduced ? 'demand' : 'always'}
        dpr={lowPower ? 1 : [1, 1.75]}
        gl={{ antialias: !lowPower, alpha: false, powerPreference: 'high-performance' }}
        camera={{ fov: mobile ? 50 : 36, near: 0.1, far: 200, position: [0.6, 4.9, 17.5] }}
        onCreated={({ gl, scene }) => {
          gl.setClearColor('#03050a');
          gl.toneMapping = THREE.ACESFilmicToneMapping;
          gl.outputColorSpace = THREE.SRGBColorSpace;
          scene.fog = new THREE.FogExp2('#050a13', 0.022);
          onReady?.();
        }}
        aria-hidden
      >
        <hemisphereLight args={['#6d8fb6', '#02050a', 0.9]} />
        <directionalLight position={[-12, 14, -20]} intensity={1.6} color="#9be8f3" />
        <directionalLight position={[10, 8, 12]} intensity={0.55} color="#c9d3df" />
        <directionalLight position={[-6, 9, 14]} intensity={1.1} color="#dfe6ef" />
        <pointLight position={[dishA.x - 0.8, dishA.y, dishA.z - 1]} intensity={6} distance={6} color="#4fd8eb" />

        <Ground reduced={reduced} />
        <Ridges />
        <Tower position={towerA} height={8.6} detail={detail} />
        <Tower position={towerB} height={8.2} detail="low" />
        {/* Antenna mounting pipe + arm on tower A */}
        <mesh position={[4.86, 7.3, 0.15]}>
          <cylinderGeometry args={[0.035, 0.035, 1.7, 8]} />
          <meshStandardMaterial color="#9aa8ba" metalness={0.85} roughness={0.35} />
        </mesh>
        <mesh position={[4.7, 7.3, 0.15]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.025, 0.025, 0.34, 6]} />
          <meshStandardMaterial color="#9aa8ba" metalness={0.85} roughness={0.35} />
        </mesh>
        <MicrowaveAntenna position={dishA} target={dishB} radius={0.55} detail={detail} />
        <MicrowaveAntenna position={dishB} target={dishA} radius={0.55} detail="low" />
        <Beam from={dishA} to={dishB} reduced={reduced} />
        <Pulses from={dishA} to={dishB} reduced={reduced} />
        <Rig pointer={pointer} scroll={scroll} mobile={mobile} reduced={reduced} />
      </Canvas>
    </div>
  );
}
