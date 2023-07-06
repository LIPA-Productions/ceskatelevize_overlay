<script lang="ts">
    import { Router, Route } from "svelte-routing";
    import LowerThird from "../LowerThird.svelte";
    import Timer from "../Timer.svelte";
    import Referee from "../Referee.svelte";
    import Background from "../Background.svelte";

    import Roster from "../Roster.svelte";
</script>

<main class="flex flex-col w-full h-screen overflow-hidden relative p-0 m-0">
    <span class="absolute m-12 bottom-12 z-20 ">
        <Referee />
    </span>

    <span class="absolute m-12 z-20 ">
        <Timer />
    </span>
    <span class="absolute inset-x-0 bottom-12 mx-12 z-20">
        <LowerThird />
    </span>

    <Background />

    <span class="absolute grid place-items-center w-full h-full z-10">
        <Roster/>
    </span>
</main>
