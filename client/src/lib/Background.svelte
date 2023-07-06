<script lang="ts">
    import { onMount } from "svelte";
    import Mesh from "./Mesh.svelte";

    let active = false;
    let socket: WebSocket;
    onMount(() => {
        socket = new WebSocket("ws://localhost:8810");
        socket.addEventListener("open", () => {
            console.log("Opened");
        });

        socket.addEventListener("message", (event) => {
            const data = JSON.parse(event.data);
            if (data.target != "CT_SPORT_BACKGROUND") return;
            if (data.toggle != undefined) active = !active;
            if (data.set != undefined) active = data.set;
        });
    });
</script>

<section
    class="w-screen h-screen fixed z-0 overflow-hidden"
    id="background_wrapper"
    class:opened={active}
>
    <Mesh colour={0x001446} scale={2.7} position={1.1} speed={0.3} />
    <Mesh colour={0x062981} scale={5} position={0} speed={0.08} zoom={5} />
</section>
