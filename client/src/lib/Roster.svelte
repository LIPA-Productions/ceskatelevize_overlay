<script lang="ts">
    import { onMount } from "svelte";
    import Person from "./Person.svelte";

    let players = [];
    let team = "Družstvo";
    let bg = "#000000";
    let fg = "#ffffff";
    let logo = "";
    let division = "";


    let active = false;
    let socket: WebSocket;
    onMount(() => {
        socket = new WebSocket("ws://localhost:8810");
        socket.addEventListener("open", () => {
            console.log("Opened");
        });

        socket.addEventListener("message", (event) => {
            const data = JSON.parse(event.data);
            if (data.target != "CT_SPORT_ROSTER") return;
            if (data.toggle != undefined) active = !active;
            if (data.set != undefined) active = data.set;
            if (data.data != undefined) {
                bg = data.data.bg;
                fg = data.data.fg;
                team = data.data.name;
                logo = data.data.logo;
                
                division = data.division
                players = Object.values(data.data.players[division])
            }

        });
    });
</script>

<section id="roster" class="flex flex-col bg-gray-950/70 items-center" class:opened={active} style="min-width: 82%">
    <div class="p-8 overflow-hidden w-full">
        <h1 class="font-mono text-6xl text-white pb-2 uppercase">{ division }</h1>
        <div 
            class="flex gap-4 justify-center"
            class:opened={active}
            id="person_list"
        >
            {#each players as player}
                <Person {...player} {bg} {fg} />
            {/each}
        </div>
    </div>

    <div 
        class="p-4 flex items-center gap-4 w-full"
        style={`background: ${bg}; color: ${fg}`}
    >
        <img src={logo} alt="" class="h-8"/>
        <h1 class="font-mono text-white text-6xl uppercase">
            { team }
        </h1>
    </div>
</section>
