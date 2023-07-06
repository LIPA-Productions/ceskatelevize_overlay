<script lang="ts">
    import { onMount, onDestroy } from "svelte";
    import HomeTeam from "./HomeTeam.svelte";
    import AwayTeam from "./AwayTeam.svelte";
    import TimerMessage from "./TimerMessage.svelte";
    import homeLogo from "/home.png";
    import awayLogo from "/away.png";

    let frame;
    
    let active = false;
    let socket: WebSocket;
    let milliseconds = 0;
    let last_time = window.performance.now();
    let period = 1;
    let isRunning = false;
    let score = {
        home: 0,
        away: 0,
    };

    $: seconds = (Math.floor(milliseconds / 1000) % 60)
        .toString()
        .padStart(2, "0");
    $: minutes = (Math.floor(milliseconds / 1000 / 60) % 60)
        .toString()
        .padStart(2, "0");

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
            if (data.time != undefined) milliseconds = data.time;
            if (data.score != undefined) score = data.score;
            if (data.running != undefined) {
                isRunning = data.running;
                last_time = window.performance.now();
            }

            if (data.message) {

            }
        });
    });

    (function update() {
        if (Number(minutes) >= 20) return;

        frame = requestAnimationFrame(update);

        if (!isRunning) return;

        const time = window.performance.now();
        milliseconds += time - last_time;
        last_time = time;
    })();

    onDestroy(() => {
        cancelAnimationFrame(frame);
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
                {minutes}:{seconds}
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
        <TimerMessage/>
    </section>
</div>
