<script lang="ts">
    import { onMount } from "svelte";
    import leagueLogo from "/logo.png";
    import HomeTeam from "../lib/HomeTeam.svelte";
    import AwayTeam from "../lib/AwayTeam.svelte";

    import homeLogo from "/home.png";
    import awayLogo from "/away.png";

    let score = {
        home: 0,
        away: 0
    }

    let label = "Začátek";

    let active = false;
    let socket: WebSocket;
    onMount(() => {
        socket = new WebSocket("ws://localhost:8810");
        socket.addEventListener("open", () => {
            console.log("Opened");
        });

        socket.addEventListener("message", (event) => {
            const data = JSON.parse(event.data);
            if (data.target != "CT_SPORT_LOWER_THIRD") return;
            if (data.toggle) active = !active;
            if (data.set != undefined) active = data.set;
            if (data.label) label = data.label;
            if (data.score) score = data.score;
        });
    });
</script>

<div id="lower_third_wrapper">
    <section id="lower_third" class="flex flex-col" class:opened={active}>
        <div
            class="uppercase px-4 font-semibold flex mx-auto text-primary bg-secondary"
        >
            <h1>{label}</h1>
        </div>
        <div class="flex w-full">
            <HomeTeam
                name="FBC Junky Česká Lípa"
                logo={homeLogo}
                bg="#16174D"
                fg="#FFFFFF"
                score={score.home}
            />
            <AwayTeam
                name="FBC Dáme Piko Česká Lípa"
                logo={awayLogo}
                bg="#000000"
                fg="#FFFFFF"
                score={score.away}
            />
        </div>
        <div
            class="flex justify-between items-center uppercase p-2 px-4 font-semibold text-primary bg-secondary"
        >
            <div class="flex-1">
                <img src={leagueLogo} alt="League Logo" class="h-12" />
            </div>
            <div class="flex-1 text-center">
                <h3>Livesport Pralesliga - 3. kolo</h3>
            </div>
            <div class="flex-1 text-end">
                <h3>Nová sportovní hala česká Lípa</h3>
            </div>
        </div>
    </section>
</div>
