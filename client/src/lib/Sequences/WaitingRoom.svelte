<script lang="ts">
    let socket = new WebSocket("ws://localhost:8810");

    async function sequence() {
        const toBeClosed = [
            "CT_SPORT_TIMER",
            "CT_SPORT_REFEREE",
        ];

        const toBeOpened = [
            "CT_SPORT_LOWER_THIRD",
            "CT_SPORT_BACKGROUND"
        ];

        for (const part of toBeClosed) {
            socket.send(
                JSON.stringify({
                    target: part,
                    set: false,
                })
            );
        }

        for (const part of toBeOpened) {
            socket.send(
                JSON.stringify({
                    target: part,
                    set: true,
                })
            );            
        }
    }
</script>

<button class="px-4 py-2 text-white bg-blue-700" on:click={sequence}>
    Čekací obrazovka
</button>
