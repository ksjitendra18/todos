<script lang="ts">
	import { Timestamp, doc, updateDoc } from 'firebase/firestore';
	import { modalIsVisible } from '../store/modalStore';
	import { todoData, todoId } from '../store/todoUpdateStore';
	import X from './icons/x.svelte';
	import { db } from '../utils/firebase';
	import { userId } from '../store/authStore';

	// export let isActive = true;

	// let todoVal = $todoData || '';
	let todoVal: string;
	$: todoVal = $todoData || '';
	async function handleSubmit(e: Event) {
		e.preventDefault();
		const docRef = await doc(db, $userId!, $todoId);
		await updateDoc(docRef, {
			todo: todoVal
		});
		// createdAt: Timestamp.now()

		$modalIsVisible = false;
	}

	function handleClick() {
		console.log('click');
	}
</script>

<!-- <div
	on:keypress={handleClick}
	on:click={handleClick}
	class={`${$modalIsVisible ? 'block' : 'hidden'}
    overlay
	w-[100%]
	h-[100%]
	flex
	items-center
	justify-between
	fixed
	bg-[rgba(0,0,0,0.9)]
top-0 right-0 left-0 bottom-0
	transition-all
	duration-1000`}
/> -->

<!-- <div
	class={` ${
		$modalIsVisible ? 'block' : 'hidden'
	} modal  flex items-center justify-between  fixed inset-0 `}
> -->
<div
	class={`overlay ${
		$modalIsVisible ? 'block' : 'hidden'
	} w-[100%] h-[100%] z-10 flex items-center justify-between fixed bg-[rgba(0,0,0,0.30)] inset-0 transition-all duration-1000`}
>
	<div class="content w-[50%] mx-auto bg-white opacity-100 px-5 py-4 rounded-xl relative">
		<div
			class="absolute right-0 pr-5 cursor-pointer hover:scale-95 duration-75 ease-in transition-all"
			on:click={() => ($modalIsVisible = false)}
		>
			<X />
		</div>
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
