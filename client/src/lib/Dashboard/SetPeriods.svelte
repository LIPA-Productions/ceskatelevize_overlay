<script lang="ts">
    let socket = new WebSocket("ws://localhost:8810");
    
    function setPeriod(value) {
        socket.send(
            JSON.stringify({
                target: "CT_SPORT_TIMER",
                period: value,
            })
        );
    }
</script>

<fieldset class="p-4 border border-neutral-600 text-white w-full">
    <legend>Manuální nastavení hrací části</legend>
    <div class="flex gap-2">
        <button class="w-12 h-12 bg-neutral-800" on:click={() => setPeriod(1)}>
            1
        </button>
        <button class="w-12 h-12 bg-neutral-800" on:click={() => setPeriod(2)}>
            2
        </button>
        <button class="w-12 h-12 bg-neutral-800" on:click={() => setPeriod(3)}>
            3
        </button>
        <button
            class="w-12 h-12 bg-neutral-800"
            on:click={() => setPeriod("Prodloužení")}
        >
            p
        </button>
        <button
            class="w-12 h-12 bg-neutral-800"
            on:click={() => setPeriod("Nájezdy")}
        >
            n
        </button>
    </div>
</fieldset>
