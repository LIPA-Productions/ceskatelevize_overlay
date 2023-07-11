<script>
    import { data } from "../../stores/data";
    export let label = "Label";
    export let home = false;

    let socket = new WebSocket("ws://localhost:8810");
    let steps = new Map();
    
    steps.set("B", "brankáři");
    steps.set("1", "1. formace");
    steps.set("2", "2. formace");
    steps.set("3", "3. formace");
    steps.set("N", "náhradníci");
    steps.set("R", "realizační");

    function onFormationClick(key) {
        socket.send(
            JSON.stringify({
                target: "CT_SPORT_BACKGROUND",
                set: true,
            })
        );

        socket.send(
            JSON.stringify({
                target: "CT_SPORT_ROSTER",
                data: home ? $data.home : $data.away,
                division: key,
                toggle: true,
            })
        );
    }
</script>

<div class="flex items-center justify-between w-full">
    <h1>{label}</h1>

    <div class="w-full flex gap-4 justify-end">
        {#each [...steps.keys()] as step}
            <div class="flex flex-col gap-2">
                <button class="w-12 h-12 bg-neutral-800" on:click={() => onFormationClick(steps.get(step))}>
                    {step}
                </button>
            </div>
        {/each}
        <button class="w-12 h-12 bg-red-800 grid place-items-center">
            <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                class="w-6 h-6"
            >
                <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                />
            </svg>
        </button>
    </div>
</div>
