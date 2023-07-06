<script lang="ts">
    import { score } from "../../stores/score";
    let socket = new WebSocket("ws://localhost:8810");

    let labels = [
        "Po 1. třetině",
        "Po 2. třetině",
        "Po 3. třetině",
        "Po prodloužení",
        "Po nájezdech",
    ];

    async function endOfPeriod(value) {
        let period = value;

        let events = [
            {
                target: "CT_SPORT_TIMER",
                set: false,
                time: 0,
                period,
            },
            {
                target: "CT_SPORT_LOWER_THIRD",
                set: true,
                score: $score,
                label: labels[value - 1] ?? "",
            },
        ];

        events.forEach((event) => socket.send(JSON.stringify(event)));

        await new Promise((r) => setTimeout(r, 5000));

        socket.send(
            JSON.stringify({
                target: "CT_SPORT_LOWER_THIRD",
                set: false
            })
        );
    }
</script>

<fieldset class="p-4 border border-neutral-600 text-white w-full">
    <legend>Ukončení hrací části</legend>
    <div class="flex gap-2">
        <button
            class="w-12 h-12 bg-neutral-800"
            on:click={() => endOfPeriod(1)}
        >
            1
        </button>
        <button
            class="w-12 h-12 bg-neutral-800"
            on:click={() => endOfPeriod(2)}
        >
            2
        </button>
        <button
            class="w-12 h-12 bg-neutral-800"
            on:click={() => endOfPeriod(3)}
        >
            3
        </button>
        <button
            class="w-12 h-12 bg-neutral-800"
            on:click={() => endOfPeriod(4)}
        >
            pp
        </button>
        <button
            class="w-12 h-12 bg-neutral-800"
            on:click={() => endOfPeriod(5)}
        >
            pn
        </button>
    </div>
</fieldset>
