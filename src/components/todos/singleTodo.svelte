<script lang="ts">
	import { deleteDoc, doc, updateDoc } from 'firebase/firestore';
	import Check from '../icons/check.svelte';
	import Delete from '../icons/delete.svelte';
	import Edit from '../icons/edit.svelte';
	import X from '../icons/x.svelte';
	import { db } from '../../utils/firebase';
	import Revert from '../icons/revert.svelte';
	import Modal from '../modal.svelte';
	import { modalIsVisible } from '../../store/modalStore';
	import { todoData, todoId } from '../../store/todoUpdateStore';
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
		try {
			const docRef = doc(db, userId!, todoId);
			await updateDoc(docRef, {
				isCompleted: false
			});
		} catch (err) {
			throw new Error('Error while updating!');
		}

		await fetchTodos();
	};

	const handleEdit = async (todoId: string, todo: string) => {
		try {
			$modalIsVisible = true;
			$todoId = todoId;
			$todoData = todo;
		} catch (error) {}
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
			<div on:click={() => handleEdit(id, todo.todo)}>
				<Edit style={'cursor-pointer'} />
			</div>
		{/if}

		<div on:click={() => handleDelete(id)}>
			<Delete style={'cursor-pointer'} />
		</div>
	</div>
</div>
