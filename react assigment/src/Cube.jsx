import { useEffect, useRef } from "react";
import * as THREE from "three";

function createNameTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 512;

  const ctx = canvas.getContext("2d");
  if (!ctx) return null;

  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "#000000";
  ctx.font = "bold 84px Arial";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("USMAN", canvas.width / 2, canvas.height / 2 - 50);
  ctx.fillText("119", canvas.width / 2, canvas.height / 2 + 70);

  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}

export default function Cube() {
  const mountRef = useRef(null);

  useEffect(() => {
    const mountNode = mountRef.current;
    if (!mountNode) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    mountNode.appendChild(renderer.domElement);

    const geometry = new THREE.BoxGeometry(2, 2, 2);
    const textTexture = createNameTexture();
    const materials = Array.from({ length: 6 }, () =>
      new THREE.MeshBasicMaterial({
        color: 0x00ff00,
        map: textTexture || null,
      })
    );

    const cube = new THREE.Mesh(geometry, materials);
    scene.add(cube);
    camera.position.z = 5;

    let animationFrameId;
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      cube.rotation.x += 0.01;
      cube.rotation.y += 0.01;
      renderer.render(scene, camera);
    };
    animate();

    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", onResize);

      geometry.dispose();
      materials.forEach((material) => {
        if (material.map) material.map.dispose();
        material.dispose();
      });

      renderer.dispose();
      if (mountNode.contains(renderer.domElement)) {
        mountNode.removeChild(renderer.domElement);
      }
    };
  }, []);

  return <div ref={mountRef} />;
}
