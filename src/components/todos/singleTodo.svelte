<script lang="ts">
	import { deleteDoc, doc, updateDoc } from 'firebase/firestore';
	import { modalIsVisible } from '../../store/modalStore';
	import { todoData, editTodoId } from '../../store/todoUpdateStore';
	import { db } from '../../utils/firebase';
	import Check from '../icons/check.svelte';
	import Delete from '../icons/delete.svelte';
	import Edit from '../icons/edit.svelte';
	import Revert from '../icons/revert.svelte';

	interface Todo {
		id: string;
		createdAt: string;
		isCompleted: boolean;
		todo: string;
	}
	export let todo: Todo;
	export let userId: string;

	const { isCompleted, id } = todo;

	const handleDelete = async (todoId: string) => {
		await deleteDoc(doc(db, userId, todoId));
	};

	const handleComplete = async (todoId: string) => {
		const docRef = doc(db, userId, todoId);
		await updateDoc(docRef, {
			isCompleted: true
		});
	};

	const handleUndo = async (todoId: string) => {
		const docRef = doc(db, userId, todoId);
		await updateDoc(docRef, {
			isCompleted: false
		});
	};

	const handleEdit = async (todoId: string, todo: string) => {
		try {
			$modalIsVisible = true;
			$editTodoId = todoId;
			$todoData = todo;
		} catch (error) {
			throw new Error('Error while editing');
		}
	};
</script>

<div
	class={` ${
		isCompleted ? 'bg-green-800' : 'bg-mainbg '
	} flex px-5 py-2 rounded-lg text-white justify-between items-center`}
>
	<p>{todo.todo} {todo.id}</p>

	<div class="actions flex gap-5">
		{#if isCompleted}
			<button on:click={() => handleUndo(id)}>
				<Revert style="cursor-pointer" />
			</button>
		{:else}
			<button on:click={() => handleComplete(id)}>
				<Check style={'cursor-pointer'} />
			</button>
			<button on:click={() => handleEdit(id, todo.todo)}>
				<Edit style={'cursor-pointer'} />
			</button>
		{/if}

		<button on:click={() => handleDelete(id)}>
			<Delete style={'cursor-pointer'} />
		</button>
	</div>
</div>
