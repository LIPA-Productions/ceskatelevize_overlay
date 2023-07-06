<script lang="ts">
    let value = "";

    let socket = new WebSocket("ws://localhost:8810");

    function setTime() {
        if (!value) return;
        let minutes, seconds;

        let length = value.length;
        let missingNumbers = 4 - length;

        minutes = missingNumbers > 1 ? 0 : Number(value.slice(0, 2 - missingNumbers)); 
        seconds = Number(value.slice(Math.max(0, 2 - missingNumbers), Math.max(0, 4 - missingNumbers)))

        socket.send(
            JSON.stringify({
                target: "CT_SPORT_TIMER",
                time: (seconds * 1000) + (minutes * 60 * 1000)
            })
        );
    }

</script>

<div class="flex w-full">
    <input
        class="h-full w-full text-black px-2"
        type="text"
        placeholder="MMSS"
        maxlength="4"
        bind:value
    />
    <button
        on:click={setTime}
        class="px-4 py-2 text-sm uppercase bg-blue-600 text-white"
        >Nastavit</button
    >
</div>
