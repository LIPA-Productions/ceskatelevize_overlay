<script lang="ts">
    import { onMount } from "svelte";
    import Time from "./Timer/Time.svelte";
    
    let active = true;
    let socket: WebSocket;

    export let content = "Countdown";
    export let fg = "#FFFFFF";
    export let bg = "#000000"
    export let home = true;
    export let time = 0;
    
    let style = "";

    $ : style = `background: ${bg}; color: ${fg}; margin-left: ${home ? "0" : "auto"}; margin-right: ${home ? "auto" : "0"}`;

    onMount(() => {
        socket = new WebSocket("ws://localhost:8810");
        socket.addEventListener("open", () => {
            console.log("Opened");
        });


    });
</script>

<div
    class="uppercase font-semibold absolute flex text-xl w-full z-10"
    class:opened={active}
    id="timer__countdown"
>
    <h1 class="font-mono font-thin select-none w-1/3 text-xl flex justify-between text-inherit px-4 " {style}>
        <span>{content}:</span>
        <Time milliseconds={(time * 1000 * 60 + 1000)} downwards/>
    </h1>
</div>
