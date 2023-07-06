<script lang="ts">
    import { score } from "../../stores/score";
    import { data } from "../../stores/data";
    export let key;

    let socket = new WebSocket("ws://localhost:8810");
    let goal = "";
    let assistence = "";

    async function sequenceGoal() {
        if (!String(goal)) return;

        const home = key == "home";
        const team = $data[key];
        const players = Object.values(team.players).flat();

        const goalName =
            players.find((v) => Number(v.number) == goal)?.name ?? `Hráč č. ${goal}`;
        const assistName =
            players.find((v) => Number(v.number) == assistence)?.name ??
            `Hráč č. ${assistence}`;

        const messages = ["GÓL", `${goalName}`];

        if ((assistence ?? undefined) != undefined)
            messages.push(`A: ${assistName}`);

        $score[key] += 1;

        socket.send(
            JSON.stringify({
                target: "CT_SPORT_TIMER",
                set: true,
            })
        );

        socket.send(
            JSON.stringify({
                target: "CT_SPORT_TIMER_MESSAGE",
                set: true,
            })
        );

        for (const message of messages) {
            socket.send(
                JSON.stringify({
                    target: "CT_SPORT_TIMER_MESSAGE",
                    content: message,
                    fg: team.fg,
                    bg: team.bg,
                    home,
                })
            );

            await new Promise((r) => setTimeout(r, 3000));
        }

        socket.send(
            JSON.stringify({
                target: "CT_SPORT_TIMER_MESSAGE",
                set: false,
            })
        );

        goal = "";
        assistence = "";
    }
</script>

<div class="grid">
    <span class="grid gap-1">
        <p class="text-xs">Číslo hráče:</p>
        <input class="w-full text-black px-2" type="number" bind:value={goal} />
        <p class="text-xs">Asistence:</p>
        <input
            class="w-full text-black px-2"
            type="number"
            bind:value={assistence}
        />
        <p class="text-xs opacity-0">Trest:</p>
        <span class="h-12 opacity-0" />
    </span>
    <button class="bg-blue-600 w-full mt-auto p-2" on:click={sequenceGoal}
        >Gól</button
    >
</div>
