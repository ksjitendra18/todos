<script lang="ts">
	import { createUserWithEmailAndPassword } from 'firebase/auth';
	import GoogleAuth from '../../components/googleAuth.svelte';
	import AlertTriangle from '../../components/icons/alertTriangle.svelte';
	import Eye from '../../components/icons/eye.svelte';
	import EyeClose from '../../components/icons/eyeClose.svelte';
	import GoogleIcon from '../../components/icons/googleIcon.svelte';
	import Loader from '../../components/icons/loader.svelte';

	import { goto } from '$app/navigation';
	let showPassword = false;
	let isLoading = false;
	let authError = false;

	let errorState: {
		nameError: {
			isError: boolean;
			errorMsg: string;
		};
		emailError: {
			isError: boolean;
			errorMsg: string;
		};
		passwordError: {
			isError: boolean;
			errorMsg: string;
		};
	} = {
		nameError: {
			isError: false,
			errorMsg: ''
		},
		emailError: {
			isError: false,
			errorMsg: ''
		},
		passwordError: {
			isError: false,
			errorMsg: ''
		}
	};
	// let errorMsg = '';

	// import type { ActionData } from './$types';
	import { error, type ActionResult } from '@sveltejs/kit';
	import { auth, db } from '../../utils/firebase';
	import { doc, serverTimestamp, setDoc } from 'firebase/firestore';

	async function handleSubmit(event: Event) {
		isLoading = true;
		const form = event.target as HTMLFormElement;
		const data = new FormData(form);

		if (!data.get('email')) errorState.emailError.isError = true;
		if (!data.get('name')) errorState.nameError.isError = true;
		if (!data.get('password')) errorState.passwordError.isError = true;

		console.log('data', data.get('name'));

		try {
			const userCredential = await createUserWithEmailAndPassword(
				auth,
				data.get('email') as string,
				data.get('password') as string
			);

			await setDoc(doc(db, 'users', userCredential.user.uid), {
				name: data.get('name') as string,
				email: data.get('email') as string,
				timeStamp: serverTimestamp()
			});

			goto('/');
		} catch (e) {
			authError = true;
			throw new Error('Error in signup ' + e);
		} finally {
			isLoading = false;
		}
	}
</script>

<svelte:head>
	<title>Sign up | Todo App</title>
</svelte:head>

<h2 class="text-4xl font-medium mt-10 text-center">Sign up</h2>

<div class="auth-options w-full flex flex-col items-center justify-center">
	<GoogleAuth isDisabled={isLoading} />

	<div class="mt-5 mb-3 w-full md:w-[380px] flex items-center justify-center">
		<div class="before-or w-[100%] h-[2px] bg-gray-300 mr-2" />
		<p class=" text-gray-500 or">OR</p>
		<div class="after-or w-[100%] h-[2px] bg-gray-300 ml-2" />
	</div>

	<form method="post" class="w-[100%] mx-auto md:w-auto" on:submit|preventDefault={handleSubmit}>
		<label for="name" class=" mt-5 block text-gray-600">Name</label>
		<input
			type="text"
			name="name"
			id="name"
			class={`${
				errorState.nameError.isError ? 'border-red-600' : 'border-slate-400'
			} px-3 w-full md:w-[400px] py-2 rounded-md border-2 `}
		/>

		{#if errorState.nameError.isError}
			<div class="flex items-center gap-3 text-red-600 py-1 mt-2">
				<AlertTriangle />
				Name should contain 3 or more characters
			</div>
		{/if}
		<label for="email" class=" mt-5 block text-gray-600">Email</label>
		<input
			type="email"
			name="email"
			id="email"
			class={`${
				errorState.emailError.isError || authError ? 'border-red-600' : 'border-slate-400'
			} px-3 w-full md:w-[400px] py-2 rounded-md border-2 `}
		/>

		{#if errorState.emailError.isError}
			<div class="flex items-center gap-3 text-red-600 py-1 mt-2">
				<AlertTriangle />
				Please enter a valid email
			</div>
		{/if}

		<label for="password" class=" mt-5 block text-gray-600">Password</label>
		<div class="relative">
			<input
				type={showPassword ? 'text' : 'password'}
				name="password"
				id="password"
				class={`${
					errorState.passwordError.isError || authError ? 'border-red-600' : 'border-slate-400'
				} px-3 w-full md:w-[400px] py-2 rounded-md border-2 `}
			/>
			<button
				type="button"
				on:click={() => (showPassword = !showPassword)}
				on:keydown={() => (showPassword = !showPassword)}
				aria-label={showPassword ? 'Password Visible' : 'Password Invisible.'}
			>
				{#if showPassword}
					<Eye />
				{:else}
					<EyeClose />
				{/if}
			</button>

			{#if errorState.passwordError.isError}
				<div class="flex items-center gap-3 text-red-600 py-1 mt-1">
					<AlertTriangle />
					Please enter a valid password
				</div>
			{/if}
		</div>

		{#if authError}
			<div class="text-white flex items-center gap-3 rounded-md bg-red-600 px-3 py-2 mt-3">
				<AlertTriangle /> Please check email and password
			</div>
		{/if}

		<div class="flex justify-end">
			<button
				type="submit"
				disabled={isLoading}
				class={`${
					isLoading ? 'bg-[#262940] scale-95' : 'bg-mainbg'
				} mt-5 w-full px-10 py-2  border-2 border-solid border-mainbg rounded-md text-white hover:scale-95 duration-100 ease-in `}
			>
				{#if isLoading}
					<div class="flex items-center justify-center gap-2">
						<Loader style={'animate-spin'} />
						<p>Signing up...</p>
					</div>
				{:else}
					Sign up
				{/if}
			</button>
		</div>
	</form>

	<p class="mt-5 text-left">
		Already have an account? <a href="/login" class="font-medium">Log in</a>
	</p>
</div>

<style>
	/* .before-or{
        width: 100%;
        height: 5px;
        background: red;
    } */

	/* .after-or{
        width: 100%;
        height: 5px;
        background: red;
    } */
</style>
