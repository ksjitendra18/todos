<script>
	import { auth } from '../utils/firebase';
	import GoogleIcon from './icons/googleIcon.svelte';
	import { isAuthLoading } from '../store/authStore';
	import { GoogleAuthProvider, signInWithRedirect } from 'firebase/auth';
	import Loader from './icons/loader.svelte';

	export let isDisabled = false;

	const provider = new GoogleAuthProvider();

	async function handleLogin() {
		$isAuthLoading = true;
		signInWithRedirect(auth, provider);
	}
</script>

<button
	type="button"
	disabled={isDisabled}
	class={` ${
		$isAuthLoading ? 'scale-95 bg-gray-50' : 'hover:scale-95 duration-100 ease-in'
	} flex mt-10 w-[100%] md:w-[400px] border-2 border-solid shadow-sm border-slate-400 py-2 px-10 md:px-16 rounded-md items-center justify-center `}
	on:click={handleLogin}
>
	{#if $isAuthLoading}
		<div class="flex items-center justify-center gap-2">
			<Loader style={'animate-spin mr-1'} />
		</div>
	{:else}
		<GoogleIcon />
	{/if}
	<p>Sign in with Google</p>
</button>
