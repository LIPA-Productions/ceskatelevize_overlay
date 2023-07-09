<script lang="ts">
    import { onMount } from "svelte";

    let active = false;
    let socket: WebSocket;
    let content = "Oznámení";
    let fg = "#FFFFFF";
    let bg = "#000000";
    let style = "";
    let home = true;

    $: style = `background: ${bg}; color: ${fg}; text-align: ${
        home ? "left" : "right"
    }`;

    onMount(() => {
        socket = new WebSocket("ws://localhost:8810");
        socket.addEventListener("open", () => {
            console.log("Opened");
        });

        socket.addEventListener("message", (event) => {
            const data = JSON.parse(event.data);
            if (data.target != "CT_SPORT_TIMER_MESSAGE") return;
            if (data.toggle != undefined) active = !active;
            if (data.set != undefined) active = data.set;
            if (data.content != undefined) content = data.content;

            if (data.fg != undefined) fg = data.fg;
            if (data.bg != undefined) bg = data.bg;
            if (data.home != undefined) home = data.home;
        });
    });
</script>

<div
    class="uppercase px-4 font-semibold relative flex justify-between text-xl z-20"
    {style}
    class:opened={active}
    id="timer__messages"
>
    <h1 class="font-mono font-thin select-none w-full text-xl text-inherit">
        {content}
    </h1>
</div>
