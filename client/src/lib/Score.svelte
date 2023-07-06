<script lang="ts">
    import { score } from "../stores/score";
    import Goal from "./Dashboard/Goal.svelte";
    import Penalty from "./Dashboard/Penalty.svelte";

    export let home = false;
    let key = home ? "home" : "away";
    let socket = new WebSocket("ws://localhost:8810");

    async function setScores() {
        if (!socket.readyState) return;

        socket.send(
            JSON.stringify({
                target: "CT_SPORT_TIMER",
                score: $score,
            })
        );

        socket.send(
            JSON.stringify({
                target: "CT_SPORT_LOWER_THIRD",
                score: $score,
            })
        );
    }

    $: $score, setScores();
</script>

<span class="flex flex-col items-center gap-4">
    <input
        type="number"
        name=""
        id=""
        placeholder="Skóre hosté"
        class="bg-transparent text-white flex-shrink placeholder:text-white text-center text-2xl w-full border border-neutral-800 focus:outline-none"
        bind:value={$score[key]}
    />
    <span class="grid grid-cols-2 gap-4 text-white w-full">

        <Goal {key}/>
        <Penalty {key}/>

    </span>
</span>
