<script lang="ts">
	import { deleteDoc, doc, updateDoc } from 'firebase/firestore';
	import Check from '../icons/check.svelte';
	import Delete from '../icons/delete.svelte';
	import Edit from '../icons/edit.svelte';
	import X from '../icons/x.svelte';
	import { db } from '../../utils/firebase';
	import Revert from '../icons/revert.svelte';

	interface Todo {
		id: string;
		createdAt: string;
		isCompleted: boolean;
		todo: string;
	}
	export let todo: Todo;
	export let userId: string | null;
	export let fetchTodos: any;
	const { isCompleted, id } = todo;

	const handleDelete = async (todoId: string) => {
		await deleteDoc(doc(db, userId!, todoId));
	};

	const handleComplete = async (todoId: string) => {
		const docRef = doc(db, userId!, todoId);
		await updateDoc(docRef, {
			isCompleted: true
		});
		fetchTodos();
	};
	const handleUndo = async (todoId: string) => {
		const docRef = doc(db, userId!, todoId);
		await updateDoc(docRef, {
			isCompleted: false
		});
		fetchTodos();
	};
</script>

<div
	class={` ${
		isCompleted ? 'bg-green-800' : 'bg-mainbg '
	} flex px-5 py-2 rounded-lg text-white justify-between items-center`}
>
	<p>{todo.todo}</p>

	<div class="actions flex gap-5">
		{#if isCompleted}
			<div on:click={() => handleUndo(id)}>
				<Revert style="cursor-pointer" />
			</div>
		{:else}
			<div on:click={() => handleComplete(id)}>
				<Check style={'cursor-pointer'} />
			</div>
			<Edit style={'cursor-pointer'} />
		{/if}

		<div on:click={() => handleDelete(id)}>
			<Delete style={'cursor-pointer'} />
		</div>
	</div>
</div>
