import { writable } from 'svelte/store';

export const isAuthLoading = writable(false);
export const isCheckingAuthStatus = writable(true);

export const userId = writable<string | null>(null);
