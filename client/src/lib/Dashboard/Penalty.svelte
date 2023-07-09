<script lang="ts">
    import { data } from "../../stores/data";
    export let key;

    let socket = new WebSocket("ws://localhost:8810");
    let offender = "";
    let penalisation = "";
    let offense = "";

    let penalties = {
        minor_penalty: {
            button: "2",
            message: "2 min",
            minutes: 2
        },
        major_penalty: {
            button: "2+2",
            message: "2+2 min",
            minutes: 4
        },
        personal_penalty: {
            button: "2+10",
            message: "2+10 min",
            minutes: 2
        },
        match_penalty: {
            button: "TDKU",
            message: "Červená karta",
            minutes: 4
        },
    };

    let offences = {
        "901": "Sekání",
        "902": "Blokování hole",
        "903": "Nadzvedávání hole",
        "904": "Vysoká hůl",
        "905": "Hra mezi nohama",
        "906": "Hákování",
        "907": "Nedovolené vrážení",
        "908": "Vrážení zády do soupeře",
        "909": "Hrubost",
        "910": "Držení",
        "911": "Bránění ve hře",
        "912": "Nesprávné kopnutí",
        "913": "Vysoký kop",
        "914": "Vstup do malého brankoviště",
        "915": "Nedovolená vzdálenost",
        "916": "Nedovolený výskok",
        "917": "Nesprávný výhoz",
        "918": "Špatně provedené rozehrání",
        "919": "Hra na zemi",
        "920": "Hra rukou",
        "921": "Hra hlavou",
        "922": "Špatné střídání",
        "923": "Opakované přestupky",
        "924": "Zdržování hry",
        "925": "Nesportovní chování",
        "926": "Nedovolené založení",
        "927": "Nedovolené flirtování",
        "928": "Nedovolené nadržení",
        "929": "Haklování",
        "930": "Nedovolená demence",
        "931": "Nedovolený ulman",
    };

    async function sequencePenalty() {
        if ([offender, penalisation, offense].some((value) => !String(value)))
            return;

        const team = $data[key];
        if (!team) return console.error(`Neznámý klíč "${key}"`);

        const players = Object.values(team.players).flat();
        const offenderName =
            players.find((v) => Number(v.number) == Number(offender))?.name ??
            offender;
        const messages = [
            `T: ${penalties[penalisation].message}`,
            offenderName,
            !Number.isNaN(offense) ? offences[offense] ?? offense : offense,
        ];

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
                fg: team.fg,
                bg: team.bg,
                home: key == "home"
            })
        );

        socket.send(
            JSON.stringify({
                target: "CT_SPORT_ADD_PENALTY",
                set: true,
                time: penalties[penalisation].minutes,
                content: offender,
                home: key == "home",
                fg: team.fg,
                bg: team.bg,
            })
        )

        for (const message of messages) {
            socket.send(
                JSON.stringify({
                    target: "CT_SPORT_TIMER_MESSAGE",
                    content: message,
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

        offender = "";
        offense = "";
        penalisation = "";
    }
</script>

<div class="grid gap-1">
    <span class="flex flex-col gap-1">
        <label for={`${key}_offender`} class="text-xs">Číslo hráče:</label>
        <input
            class="h-full w-full text-black px-2"
            type="number"
            id={`${key}_offender`}
            bind:value={offender}
        />
        <label for={`${key}_offender`} class="text-xs"
            >Přestupek (číslo nebo název):</label
        >
        <input
            class="h-full w-full text-black px-2"
            type="text"
            bind:value={offense}
        />
        <p class="text-xs">Trest:</p>
        <ul class="grid w-full gap-1 grid-cols-4">
            {#each Object.entries(penalties) as [penalty, penaltyInfo]}
                <li>
                    <input
                        type="radio"
                        id={`${key}_${penalty}`}
                        name={`${key}_penalty`}
                        value={penalty}
                        class="hidden peer"
                        required
                        bind:group={penalisation}
                    />
                    <label
                        for={`${key}_${penalty}`}
                        class="select-none inline-flex items-center justify-center w-12 h-12 p-2 border cursor-pointer border-neutral-800 peer-checked:border-blue-600 peer-checked:text-blue-600 hover:text-gray-200 text-gray-400 bg-neutral-800 hover:bg-neutral-700"
                    >
                        <div class="block">
                            <div class="w-full font-semibold">
                                {penaltyInfo.button}
                            </div>
                        </div>
                    </label>
                </li>
            {/each}
        </ul>
    </span>
    <button on:click={sequencePenalty} class="bg-red-600 w-full h-full p-2"
        >Spustit vyloučení</button
    >
</div>
