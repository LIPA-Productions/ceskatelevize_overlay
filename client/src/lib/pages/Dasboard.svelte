<script lang="ts">
    import Score from "../Score.svelte";
    import TimeInput from "../Dashboard/TimeInput.svelte";
    import SetPeriods from "../Dashboard/SetPeriods.svelte";
    import EndPeriods from "../Dashboard/EndPeriods.svelte";

    import TwoStateControls from "../Controls/TwoStateControls.svelte";
    import SequenceControls from "../Controls/RosterControls.svelte";
    import WaitingRoom from "../Sequences/WaitingRoom.svelte";

    import { data } from "../../stores/data";

    let fetchJson;
    fetch("data.json")
        .then((res) => res.json())
        .then((res) => (fetchJson = res));

    let socket = new WebSocket("ws://localhost:8810");
    let isTimeRunning = false;

    const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

    function toggleTime() {
        isTimeRunning = !isTimeRunning;

        socket.send(
            JSON.stringify({
                target: "CT_SPORT_TIMER",
                set: true,
                running: isTimeRunning,
            })
        );
    }

    function showRoster(key, home) {
        if (!fetchJson) return;

        socket.send(
            JSON.stringify({
                target: "CT_SPORT_BACKGROUND",
                set: true,
            })
        );

        socket.send(
            JSON.stringify({
                target: "CT_SPORT_ROSTER",
                data: home ? fetchJson.home : fetchJson.away,
                division: key,
                toggle: true,
            })
        );
    }

    async function sequenceRoster(home) {
        // Zapnutí pozadí
        socket.send(
            JSON.stringify({
                target: "CT_SPORT_BACKGROUND",
                set: true,
            })
        );

        const players = (home ? fetchJson.home : fetchJson.away).players;
        const parts = Object.keys(players);

        for (const part of parts) {
            let numberOfPlayersInDivision = Object.values(players[part]).length;
            let duration = Math.max(2500, numberOfPlayersInDivision * 1100);

            socket.send(
                JSON.stringify({
                    target: "CT_SPORT_ROSTER",
                    data: home ? fetchJson.home : fetchJson.away,
                    division: part,
                    toggle: true,
                })
            );

            await sleep(duration);

            socket.send(
                JSON.stringify({
                    target: "CT_SPORT_ROSTER",
                    data: home ? fetchJson.home : fetchJson.away,
                    division: part,
                    toggle: true,
                })
            );

            await sleep(150);
        }

        // Vypnutí pozadí
        socket.send(
            JSON.stringify({
                target: "CT_SPORT_BACKGROUND",
                set: false,
            })
        );
    }

    function handleKeydown(event) {
        if (event.code.toLowerCase() != "space") return;
        if (document.activeElement.tagName.toLowerCase() != "body") return;
        event.preventDefault();

        toggleTime();
    }
</script>

<svelte:head>
    <title>Ovládací panel pro grafiku</title>
    <meta name="robots" content="noindex nofollow" />
    <html lang="en" />
</svelte:head>

<svelte:window on:keydown={handleKeydown} />

<main class="bg-neutral-900 grid gap-4 min-h-screen p-8">
    <h1
        class="mb-4 text-4xl tracking-tight font-bold text-gray-900 dark:text-white font-mono uppercase"
    >
        Ovládací panel
    </h1>

    <div class="flex flex-col gap-4 items-start w-full text-neutral-400">
        <h2 class="text-2xl text-white font-mono">Skóre</h2>

        <div class="flex flex-col xl:flex-row justify-between w-full gap-16">
            <div>
                <h1>Skóre domácí</h1>
                <Score home />
            </div>

            <div class="flex flex-col gap-4">
                <div class="grid">
                    <button
                        class="text-white py-2 text-lg uppercase w-full relative"
                        class:bg-green-700={isTimeRunning}
                        class:bg-red-700={!isTimeRunning}
                        on:click={toggleTime}
                    >
                        {#if isTimeRunning}
                            ČAS Běží
                        {:else}
                            ČAS Neběží
                        {/if}

                        <kbd
                            class="absolute right-2 px-4 py-1.5 text-xs font-semibold border rounded-lg bg-gray-600 text-gray-100 border-gray-500"
                            >Spacebar</kbd
                        >
                    </button>

                    <TimeInput />
                </div>

                <div class="flex gap-4">
                    <SetPeriods />
                    <EndPeriods />
                </div>
            </div>

            <div>
                <h1>Skóre hosté</h1>
                <Score />
            </div>
        </div>
    </div>

    <div class="flex flex-col items-start w-full">
        <h2 class="text-2xl text-white font-mono">Fronta</h2>

        <div class="w-full flex flex-col gap-4">
            <fieldset class="p-4 border border-neutral-600 text-white w-full">
                <legend>Obecné</legend>
                <div class="flex gap-4">
                    <WaitingRoom />
                    <button
                        class="px-4 py-2 text-white bg-blue-700"
                        on:click={() =>
                            socket.send(
                                JSON.stringify({
                                    target: "CT_SPORT_LOWER_THIRD",
                                    toggle: true,
                                })
                            )}
                    >
                        Úvod
                    </button>
                    <button
                        class="px-4 py-2 text-white bg-blue-700"
                        on:click={() => sequenceRoster(true)}
                    >
                        Soupisky Domácí
                    </button>
                    <button
                        class="px-4 py-2 text-white bg-blue-700"
                        on:click={() => sequenceRoster(false)}
                    >
                        Soupisky Hosté
                    </button>
                </div>
            </fieldset>
        </div>
    </div>

    <div class="flex flex-col items-start w-full">
        <h2 class="text-2xl text-white font-mono">Danger Zone</h2>
        <div class="w-full grid grid-cols-1 2xl:grid-cols-3 gap-4">
            <fieldset class="p-4 border border-neutral-600 text-white w-full">
                <legend>Obecné</legend>
                <div class="flex flex-col gap-4">
                    <TwoStateControls
                        label="Časomíra"
                        config={{
                            target: "CT_SPORT_TIMER",
                        }}
                    />
                    <TwoStateControls
                        label="Banner se skóre"
                        config={{
                            target: "CT_SPORT_LOWER_THIRD",
                        }}
                    />

                    <TwoStateControls
                        label="Pozadí"
                        config={{
                            target: "CT_SPORT_BACKGROUND",
                        }}
                    />
                </div>
            </fieldset>

            <fieldset class="p-4 border border-neutral-600 text-white w-full">
                <legend>Rozhodčí</legend>

                <div class="flex flex-col gap-4">
                    {#if $data}
                        {#each $data.referees as referee}
                            <TwoStateControls
                                label={referee.name}
                                config={{
                                    target: "CT_SPORT_REFEREE",
                                    ...referee,
                                }}
                            />
                        {/each}
                    {/if}
                </div>
            </fieldset>

            <fieldset class="p-4 border border-neutral-600 text-white w-full">
                <legend>Soupisky</legend>

                <div class="flex flex-col gap-4">
                    <SequenceControls label="Domací" home/>
                    <SequenceControls label="Hosté"/>
                </div>
                <!-- <div class="grid grid-cols-6 gap-4">

                    <button
                        class="px-4 py-2 text-white bg-red-700"
                        on:click={() => showRoster("brankáři", true)}
                        >Brankáři domácí</button
                    >
                    <button
                        class="px-4 py-2 text-white bg-red-700"
                        on:click={() => showRoster("1. formace", true)}
                        >1. formace domácí</button
                    >
                    <button
                        class="px-4 py-2 text-white bg-red-700"
                        on:click={() => showRoster("2. formace", true)}
                        >2. formace domácí</button
                    >
                    <button
                        class="px-4 py-2 text-white bg-red-700"
                        on:click={() => showRoster("3. formace", true)}
                        >3. formace domácí</button
                    >
                    <button
                        class="px-4 py-2 text-white bg-red-700"
                        on:click={() => showRoster("náhradníci", true)}
                        >Náhradníci domácí</button
                    >
                    <button
                        class="px-4 py-2 text-white bg-red-700"
                        on:click={() => showRoster("realizační", true)}
                        >Realizační tým domácí</button
                    >

                    <button
                        class="px-4 py-2 text-white bg-red-700"
                        on:click={() => showRoster("brankáři", false)}
                        >Brankáři hosté</button
                    >
                    <button
                        class="px-4 py-2 text-white bg-red-700"
                        on:click={() => showRoster("1. formace", false)}
                        >1. formace hosté</button
                    >
                    <button
                        class="px-4 py-2 text-white bg-red-700"
                        on:click={() => showRoster("2. formace", false)}
                        >2. formace hosté</button
                    >
                    <button
                        class="px-4 py-2 text-white bg-red-700"
                        on:click={() => showRoster("3. formace", false)}
                        >3. formace hosté</button
                    >
                    <button
                        class="px-4 py-2 text-white bg-red-700"
                        on:click={() => showRoster("náhradníci", false)}
                        >Náhradníci hosté</button
                    >
                    <button
                        class="px-4 py-2 text-white bg-red-700"
                        on:click={() => showRoster("realizační", false)}
                        >Realizační tým hosté</button
                    >
                </div> -->
            </fieldset>
        </div>
    </div>
</main>
