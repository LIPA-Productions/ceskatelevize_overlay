import { readable } from 'svelte/store';

export const data = readable(null, function start(set) {
    // implementation goes here
    fetch("data.json")
    .then(res => res.json())
    .then (res => set(res));

    return function stop() {}
});