<script lang="ts">
    export let bg = "#FFFFFF";
    export let fg = "#000000";
    export let name = "Domácí";
    export let score = 0;
    export let logo;
    export let compact = false;

    let style = `background: ${bg}; color: ${fg}`;
</script>

{#if compact}
    <div
        class="flex w-full justify-between items-center gap-3 py-1 px-4 font-mono text-4xl uppercase"
        {style}
    >
        <img src={logo} alt="Logo" class="h-9" />
        <div class="flex flex-1 items-baseline gap-12">
            <h2 class="flex-1 text-start">{name}</h2>
            <h2 class="w-8 text-right">{score}</h2>
        </div>
    </div>
{:else}
    <div
        class="flex w-full justify-between items-center py-1 px-4 font-mono text-8xl uppercase"
        {style}
    >
        <img src={logo} alt="Logo" class="h-20" />
        <div class="flex flex-1 items-baseline gap-3">
            <h2 class="flex-1 text-5xl text-end">{name}</h2>
            <h2 class="w-32 text-right">{score}</h2>
        </div>
    </div>
{/if}
