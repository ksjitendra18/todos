<script lang="ts">
	import { goto } from '$app/navigation';
	import { browser } from '$app/environment';
	import {
		Timestamp,
		doc,
		setDoc,
		collection,
		query,
		orderBy,
		getDocs,
		onSnapshot
	} from 'firebase/firestore';
	import { getDoc } from 'firebase/firestore';
	import { userId, isCheckingAuthStatus } from '../../store/authStore';
	import { db } from '../../utils/firebase';
	import { nanoid } from 'nanoid';
	import Loader from '../../components/icons/loader.svelte';
	import AddTodos from '../../components/todos/addTodos.svelte';
	import SingleTodo from '../../components/todos/singleTodo.svelte';

	interface Todo {
		id: string;
		createdAt: string;
		isCompleted: boolean;
		todo: string;
	}

	import { writable } from 'svelte/store';

	let todosArray: any[] = [];
	let completedTodosArray: any[] = [];

	let loading = true;

	const fetchTodos = async () => {
		console.log('fetch called', new Date().getTime());
		const q = query(collection(db, $userId!), orderBy('createdAt', 'desc'));

		onSnapshot(q, (querySnapshot) => {
			todosArray = [];
			// completedTodosArray = [];
			querySnapshot.forEach((doc) => {
				// console.log({...doc.data()});
				todosArray.push({ ...doc.data(), id: doc.id, createdAt: '' });
				todosArray = todosArray;
			});
		});

		loading = false;
	};

	let addTodos = false;

	$: if ($userId) {
		fetchTodos();
	}

	$: if (!$isCheckingAuthStatus && !$userId && browser) {
		goto('/login');
	}

	$: console.log('user', $userId, $isCheckingAuthStatus);

	// let completedTodosArray: any[] = [];

	$: {
		console.log('mapping...');
		completedTodosArray = [];
		todosArray.map((todo) => (todo.isCompleted ? completedTodosArray.push(todo) : ''));
	}

	$: console.log('array', todosArray, completedTodosArray);
</script>

<svelte:head>
	<title>Todos</title>
</svelte:head>

<div class="flex flex-col md:flex-row gap-3 items-center">
	<h2 class="font-bold text-3xl">Your Todos</h2>

	<button
		class="bg-mainbg rounded-full px-7 py-2 ml-3 text-white"
		on:click={() => (addTodos = !addTodos)}
	>
		{#if addTodos}
			Cancel Add
		{:else}
			Add Todo
		{/if}
	</button>
</div>

{#if addTodos}
	<AddTodos />
{/if}

{#if loading}
	<div class="h-50vh w-full flex flex-col items-center justify-center">
		<div class="sr-only">Loding todos...</div>
		<Loader style={'animate-spin mr-1'} />
	</div>
{/if}

{#if !loading && todosArray.length > 0}
	<div class="flex mt-5 gap-5 flex-col">
		{#if todosArray.length !== completedTodosArray.length}
			<h3 class="text-2xl font-medium">Active Todos</h3>
			{#each todosArray as todo}
				{#if !todo.isCompleted}
					<SingleTodo {todo} userId={$userId} {fetchTodos} />
				{/if}
			{/each}
		{/if}

		{#if completedTodosArray.length > 0}
			<h3 class="text-2xl font-medium">Completed Todos</h3>
			{#each completedTodosArray as todo}
				{#if todo.isCompleted}
					<SingleTodo {todo} userId={$userId} {fetchTodos} />
				{/if}
			{/each}
		{/if}
	</div>
{:else}
	<div class="text-2xl font-medium text-center mt-20">
		Start adding your todos! It will appear here.
	</div>
{/if}
