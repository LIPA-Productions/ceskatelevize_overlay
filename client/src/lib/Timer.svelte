<script lang="ts">
    import { onMount } from "svelte";
    import Time from "./Timer/Time.svelte";
    import HomeTeam from "./HomeTeam.svelte";
    import AwayTeam from "./AwayTeam.svelte";

    import TimerMessage from "./TimerMessage.svelte";
    import TimerCountdown from "./TimerCountdown.svelte";
    import homeLogo from "/home.png";
    import awayLogo from "/away.png";

    let active = false;
    let socket: WebSocket;
    let period = 1;
    let penalties = [];

    let score = {
        home: 0,
        away: 0,
    };

    $: {
        penalties = penalties;
    }

    onMount(() => {
        socket = new WebSocket("ws://localhost:8810");
        socket.addEventListener("open", () => {
            console.log("Opened");
        });

        socket.addEventListener("message", (event) => {
            const data = JSON.parse(event.data);
            if (data.target != "CT_SPORT_TIMER") return;
            if (data.toggle) active = !active;
            if (data.set != undefined) active = data.set;
            if (data.period != undefined) period = data.period;
            if (data.score != undefined) score = data.score;
        });

        socket.addEventListener("message", (event) => {
            const data = JSON.parse(event.data);
            if (data.target != "CT_SPORT_ADD_PENALTY") return;

            penalties.push(data);
            penalties = penalties;
        });
    });
</script>

<div id="timer_wrapper">
    <section id="timer" class="flex flex-col" class:opened={active}>
        <div
            class="uppercase px-4 font-semibold relative flex justify-between text-white text-xl bg-secondary"
        >
            <span class="text-neutral-400">{period}.</span>
            <h1
                class="font-mono font-thin select-none absolute w-full left-0 text-center text-xl"
            >
                <Time />
            </h1>
            <span />
        </div>
        <div class="grid grid-cols-2" style="font-size:8px">
            <HomeTeam
                name="JUN"
                logo={homeLogo}
                bg="#16174D"
                fg="#FFFFFF"
                compact
                score={score.home}
            />
            <AwayTeam
                name="POŘ"
                logo={awayLogo}
                bg="#000000"
                fg="#FFFFFF"
                compact
                score={score.away}
            />
        </div>
        <div id="timer__bottom" class="relative">
            <!-- TODO: Rozdělit to na domácí a hostí penalty -->
            {#each penalties as penalty}
                <TimerCountdown {...penalty} />
            {/each}
            <TimerMessage />
        </div>
    </section>
</div>
