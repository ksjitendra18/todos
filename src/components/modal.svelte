<script lang="ts">
	import { browser } from '$app/environment';
	import { doc, updateDoc } from 'firebase/firestore';
	import { onDestroy, onMount } from 'svelte';
	import { userId } from '../store/authStore';
	import { modalIsVisible } from '../store/modalStore';
	import { editTodoId, todoData } from '../store/todoUpdateStore';
	import { db } from '../utils/firebase';
	import X from './icons/x.svelte';
	import { goto } from '$app/navigation';

	let todoVal: string;
	$: todoVal = $todoData || '';
	async function handleSubmit(e: Event) {
		e.preventDefault();

		if (!$userId) {
			return goto('/login');
		}
		const docRef = doc(db, $userId, $editTodoId);
		await updateDoc(docRef, {
			todo: todoVal
		});

		$modalIsVisible = false;
	}

	function handleClick(event: MouseEvent) {
		if (
			(event.target as HTMLElement).classList.contains('overlay') ||
			!(event.target as HTMLElement).closest('.content')
		) {
			$modalIsVisible = false;
		}
	}

	function handleKeyDown(event: KeyboardEvent) {
		// Check if the "Escape" key is pressed
		if (event.key === 'Escape') {
			$modalIsVisible = false;
		}
	}

	$: {
		if (browser) {
			if ($modalIsVisible) {
				document.body.classList.add('overflow-hidden');
			} else {
				document.body.classList.remove('overflow-hidden');
			}
		}
	}

	onMount(() => {
		document.addEventListener('keydown', handleKeyDown);
	});

	onDestroy(() => {
		if (browser) {
			document.removeEventListener('keydown', handleKeyDown);
		}
	});
</script>

<div
	aria-hidden={$modalIsVisible ? undefined : 'true'}
	role={$modalIsVisible ? 'dialog' : undefined}
	aria-modal={$modalIsVisible ? 'true' : undefined}
	on:click={handleClick}
	class={`overlay ${
		$modalIsVisible ? 'block' : 'hidden'
	} w-[100%] h-[100%] z-10 flex items-center justify-between fixed bg-[rgba(0,0,0,0.30)] inset-0 transition-all duration-1000`}
>
	<div
		class="content md:w-[50%] w-full mx-4 md:mx-auto bg-white opacity-100 px-5 py-4 rounded-xl relative"
	>
		<button
			class="absolute right-0 pr-5 cursor-pointer hover:scale-95 duration-75 ease-in transition-all"
			on:click={() => ($modalIsVisible = false)}
		>
			<X />
		</button>
		<h2 class=" text-2xl font-medium">Edit Todo</h2>

		<div class="model-body">
			<form class=" mt-3 transition-all duration-1000 ease-in" on:submit={handleSubmit}>
				<div class="mb-6">
					<input
						type="textarea"
						name="todos"
						id="todos"
						class=" border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 bg-gray-300"
						placeholder="Enter your todo"
						required
						bind:value={todoVal}
					/>
				</div>
				<div class="flex gap-3">
					<button
						type="button"
						on:click={() => ($modalIsVisible = false)}
						class="text-red-500 bg-transparent border-solid border-2 border-red-400 rounded-full px-6 text-sm py-2 hover:scale-95 duration-100 transition-all ease-out focus:scale-105 focus:border-4"
						>Cancel</button
					>
					<!-- class="text-red-500 bg-transparent border-solid border-2 border-red-400 rounded-full px-6 text-sm py-2 hover:scale-95 duration-100 transition-all ease-out focus:scale-105 focus:border-4" -->
					<button
						type="submit"
						class="text-white bg-mainbg border-solid border-2 border-green rounded-full px-6 text-sm py-2 hover:scale-95 duration-100 transition-all ease-out focus:scale-105 focus:border-4"
						>Confirm Edit</button
					>
				</div>
			</form>
		</div>
	</div>
</div>

<!-- <div
	class={`overlay ${
		$modalIsVisible ? 'block' : 'hidden'
	} w-[100%] h-[100%] z-10 flex items-center justify-between fixed bg-[rgba(0,0,0,0.18)] inset-0 transition-all duration-1000`}
> -->
<!-- <style>
	.overlay {
		pointer-events: all;
	}

	.modal {
		pointer-events: none;
	}
</style> -->
