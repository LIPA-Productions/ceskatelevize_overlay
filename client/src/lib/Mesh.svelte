<script lang="ts">
    import { onMount } from "svelte";
    import * as THREE from "three";
    import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer";
    import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass";
    import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass";

    export let colour;
    export let scale = 5;
    export let position = 0.5;
    export let speed = 0.1;
    export let zoom = 4;

    let container;

    function getDistortionShaderDefinition() {
        return {
            uniforms: {
                tDiffuse: { type: "t", value: null },
                strength: { type: "f", value: 0 },
                height: { type: "f", value: 1 },
                aspectRatio: { type: "f", value: 1 },
                cylindricalRatio: { type: "f", value: 1 },
            },

            vertexShader: [
                "uniform float strength;", // s: 0 = perspective, 1 = stereographic
                "uniform float height;", // h: tan(verticalFOVInRadians / 2)
                "uniform float aspectRatio;", // a: screenWidth / screenHeight
                "uniform float cylindricalRatio;", // c: cylindrical distortion ratio. 1 = spherical

                "varying vec3 vUV;", // output to interpolate over screen
                "varying vec2 vUVDot;", // output to interpolate over screen

                "void main() {",
                "gl_Position = projectionMatrix * (modelViewMatrix * vec4(position, 1.0));",

                "float scaledHeight = strength * height;",
                "float cylAspectRatio = aspectRatio * cylindricalRatio;",
                "float aspectDiagSq = aspectRatio * aspectRatio + 1.0;",
                "float diagSq = scaledHeight * scaledHeight * aspectDiagSq;",
                "vec2 signedUV = (2.0 * uv + vec2(-1.0, -1.0));",

                "float z = 0.5 * sqrt(diagSq + 1.0) + 0.5;",
                "float ny = (z - 1.0) / (cylAspectRatio * cylAspectRatio + 1.0);",

                "vUVDot = sqrt(ny) * vec2(cylAspectRatio, 1.0) * signedUV;",
                "vUV = vec3(0.5, 0.5, 1.0) * z + vec3(-0.5, -0.5, 0.0);",
                "vUV.xy += uv;",
                "}",
            ].join("\n"),

            fragmentShader: [
                "uniform sampler2D tDiffuse;", // sampler of rendered scene?s render target
                "varying vec3 vUV;", // interpolated vertex output data
                "varying vec2 vUVDot;", // interpolated vertex output data

                "void main() {",
                "vec3 uv = dot(vUVDot, vUVDot) * vec3(-0.5, -0.5, -1.0) + vUV;",
                "gl_FragColor = texture2DProj(tDiffuse, uv);",
                "}",
            ].join("\n"),
        };
    }

    onMount(() => {
        const scene = new THREE.Scene();

        const camera = new THREE.PerspectiveCamera(
            45,
            window.innerWidth / window.innerHeight,
            1,
            1000
        );
        camera.position.z = zoom;
        camera.position.y = position;
        camera.position.x = -0;
        camera.rotation.z = -0.20;
        camera.rotation.x = 3;

        const renderer = new THREE.WebGLRenderer({ alpha: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        container.appendChild(renderer.domElement);

        const geometry = new THREE.SphereGeometry(
            7,
            256,
            32,
            0,
            Math.PI * 2,
            0,
            Math.PI / 2
        );
        const texture = new THREE.TextureLoader().load("Subtract2.png");
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        texture.repeat.set(scale, scale);

        const material = new THREE.MeshBasicMaterial({
            map: texture,
            color: colour,
            transparent: true,
        });

        const sphere = new THREE.Mesh(geometry, material);
        sphere.material.side = THREE.BackSide;
        scene.add(sphere);

        // Create effect composer
        const composer = new EffectComposer(renderer);
        composer.addPass(new RenderPass(scene, camera));

        // Add distortion effect to effect composer
        var effect = new ShaderPass(getDistortionShaderDefinition());
        composer.addPass(effect);
        effect.renderToScreen = true;

        // Setup distortion effect
        var horizontalFOV = 120;
        var strength = 0.9;
        var cylindricalRatio = 2;
        var height =
            Math.tan(THREE.MathUtils.degToRad(horizontalFOV) / 2) / camera.aspect;

        camera.fov = (Math.atan(height) * 1.3 * 180) / Math.PI;
        camera.updateProjectionMatrix();

        effect.uniforms["strength"].value = strength;
        effect.uniforms["height"].value = height;
        effect.uniforms["aspectRatio"].value = camera.aspect;
        effect.uniforms["cylindricalRatio"].value = cylindricalRatio;

        function animate() {
            requestAnimationFrame(animate);
            sphere.rotation.y -= (scale * speed) / 2000;

            renderer.render(scene, camera);
        }

        animate();
    });
</script>

<section class="absolute w-full h-full" bind:this={container} />
