<script lang="ts">
    export let name = "Hráč";
    export let post = "Post";
    export let number = "##";
    export let image = "";
    export let bg = "#000000";
    export let fg = "#FFFFFF";
    export let captain = false;

    let style = "";
    $ : style = `background: ${bg}; color: ${fg};`;

    console.log(name, style)
</script>

<div class="player w-72" style={style}>
    <header class="flex px-4 py-2 text-5xl overflow-hidden relative">
        <span class="font-mono text-inherit">
        {#if number}
            { number }
        {:else}
            <span class="opacity-0">0</span>
        {/if}
        </span>
        {#if captain}
            <span class="font-mono bg-white text-black w-16 h-16 top-0 absolute grid place-items-center right-0 ml-auto">C</span>
        {/if}
    </header>

    <img src={image} class="w-full h-96 object-cover" alt="" style="image-rendering: crisp-edges;">

    <div class="p-4">
        <h1 class="text-4xl font-mono uppercase">{name}</h1>
        <h2 class="lowercase text-xl">{post}</h2>
    </div>

</div>