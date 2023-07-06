<script lang="ts">
    import { onMount, onDestroy } from "svelte";

    let active = false;
    let socket: WebSocket;
    let name = "Rozhodčí 1";
    let info = "Rozhodčí utkání";

    onMount(() => {
        socket = new WebSocket("ws://localhost:8810");
        socket.addEventListener("open", () => {
            console.log("Opened");
        });

        socket.addEventListener("message", (event) => {
            const data = JSON.parse(event.data);
            if (data.target != "CT_SPORT_REFEREE") return;
            if (data.toggle != undefined) active = !active;
            if (data.set != undefined) active = data.set;
            if (data.name != undefined) name = data.name;
            if (data.info != undefined) info = data.info ?? "";
        });
    });

    onDestroy(() => {
		socket.close()
	});
</script>

<div id="referee_wrapper">
    <section id="referee" class="flex flex-col" class:opened={active} style="min-width: 20vw;">
        <div
            class="uppercase px-2 py-1 text-base font-semibold flex text-white bg-teal-500"
        >
            Rozhodčí
        </div>
        <div class="bg-secondary text-white grid p-2 uppercase">
            <span class="font-mono text-4xl">{name}</span>
            {#if info }
                <span class="text-teal-700 font-semibold text-lg">{info}</span>
            {/if}
        </div>
    </section>
</div>