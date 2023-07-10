<script lang="ts">
    export let label = "Label";
    export let duration = 5;
    export let config = {};

    let socket = new WebSocket("ws://localhost:8810");

    /**
     * Funkce pro otevření grafiky
     */
    function onOpenClick() {
        socket.send(
            JSON.stringify({
                ...config,
                set: true,
            })
        );
    }

    /**
     * Funkce pro otevření grafiky
     */
    function onCloseClick() {
        socket.send(
            JSON.stringify({
                ...config,
                set: false,
            })
        );
    }

    /**
     * Funkce pro přehrání grafiky, tj. otevření na určitý čas a opětovné zavření.
     */
    async function onPlayClick() {
        if (Number.isNaN(Number(duration))) return;
        
        onOpenClick();
        await new Promise((resolve) => setTimeout(resolve, Math.abs(duration) * 1000));
        onCloseClick();
    }
</script>

<div class="flex w-full items-center justify-between">
    <h1>{label}</h1>

    <div class="w-2/3 grid grid-cols-4 gap-4">
        <button
            class="px-4 py-2 text-white bg-neutral-700"
            on:click={onOpenClick}
        >
            Otevřít
        </button>
        <button
            class="px-4 py-2 text-white bg-neutral-700"
            on:click={onCloseClick}
        >
            Zavřít
        </button>
        <button
            class="px-4 py-2 text-white bg-green-700"
            on:click={onPlayClick}
        >
            Přehrát
        </button>
        <input
            type="number"
            name=""
            placeholder="sekundy"
            bind:value={duration}
            min="1"
            step="1"
            class="text-center text-black"
        />
    </div>
</div>
