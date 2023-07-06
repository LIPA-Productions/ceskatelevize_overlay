import { writable } from 'svelte/store';

export const score = writable({
    home: 0,
    away: 0
});