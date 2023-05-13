<script lang="ts">
	// export let fetchTodos: () => void;
	import { Timestamp, doc, setDoc } from 'firebase/firestore';
	import { userId, isCheckingAuthStatus } from '../../store/authStore';
	import { db } from '../../utils/firebase';
	import { nanoid } from 'nanoid';

	let todoVal = '';

	const handleSubmit = async (e: Event) => {
		e.preventDefault();
		try {
			console.log(todoVal);

			await setDoc(doc(db, $userId!, nanoid()), {
				todo: todoVal,
				isCompleted: false,
				createdAt: Timestamp.now()
			});
			todoVal = '';
			// fetchTodos();
		} catch (err) {
			console.log('Error', err);
		}
	};
</script>

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
	<button
		type="submit"
		class="text-black bg-transparent border-solid border-2 border-mainbg rounded-full px-8 py-2 hover:scale-95 duration-100 transition-all ease-out focus:scale-105 focus:border-4"
		>Add todo</button
	>
</form>
