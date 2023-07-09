<script lang="ts">
    import { onMount, onDestroy } from "svelte";
    export let downwards = false;
    export let milliseconds = 0;
    
    let frame;
    let socket: WebSocket;
    let isRunning = false;
    let last_time = window.performance.now();

    $: seconds = (Math.floor(milliseconds / 1000) % 60)
        .toString()
        .padStart(2, "0");
    $: minutes = (Math.floor(milliseconds / 1000 / 60) % 60)
        .toString()
        .padStart(2, "0");

    onMount(() => {
        socket = new WebSocket("ws://localhost:8810");

        socket.addEventListener("message", (event) => {
            const data = JSON.parse(event.data);

            if (data.target != "CT_SPORT_TIMER") return;
            if (data.time != undefined) milliseconds = data.time;
            if (data.running != undefined) {
                isRunning = data.running;
                last_time = window.performance.now();
            }
        });
    });

    (function update() {
        if (Number(minutes) >= 20) return;

        frame = requestAnimationFrame(update);

        if (!isRunning) return;

        const time = window.performance.now();

        if (downwards) {
            milliseconds -= time - last_time;
        }
        else {
            milliseconds += time - last_time;
        }

        last_time = time;
    })();

    onDestroy(() => {
        cancelAnimationFrame(frame);
    });
</script>

<span class="font-mono">
    {minutes}:{seconds}
</span>