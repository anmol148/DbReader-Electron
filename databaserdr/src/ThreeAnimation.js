import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';


const ThreeAnimation = () => {
    const containerRef = useRef(null);
  
    useEffect(() => {
      let scene, camera, renderer;
  
      // Create the scene
      scene = new THREE.Scene();
  
      // Create the camera
      camera = new THREE.PerspectiveCamera(
        75,
        containerRef.current.clientWidth / containerRef.current.clientHeight,
        0.1,
        1000
      );
      camera.position.z = 5;
  
      // Create the renderer
      renderer = new THREE.WebGLRenderer({ antialias: true });
      renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
      containerRef.current.appendChild(renderer.domElement);
  
      // Define your animation logic here
  
      // Render function
      const render = () => {
        renderer.render(scene, camera);
      };
  
      // Animation loop
      const animate = () => {
        requestAnimationFrame(animate);
        render();
      };
  
      animate();
  
      // Clean up
      return () => {
        if (containerRef.current) {
            // Remove all child objects from the scene
            scene.remove(...scene.children);
        
            // Dispose of geometries, materials, and textures
            scene.traverse((object) => {
              if (object.geometry) {
                object.geometry.dispose();
              }
              if (object.material) {
                if (Array.isArray(object.material)) {
                  object.material.forEach((material) => material.dispose());
                } else {
                  object.material.dispose();
                }
              }
              if (object.texture) {
                object.texture.dispose();
              }
            });
        
            const rendererElement = renderer.domElement;
            containerRef.current.removeChild(rendererElement);
        
            // Dispose of the renderer
            renderer.dispose();
          }
      };
    }, []);
  
    return <div ref={containerRef} />;
  };
  
  export default ThreeAnimation;
  