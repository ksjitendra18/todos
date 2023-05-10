<script>
	import { signOut } from 'firebase/auth';
	import { userId, isCheckingAuthStatus } from '../store/authStore';
	import { auth } from '../utils/firebase';
	let navIsOpen = false;

	$: console.log($isCheckingAuthStatus, $userId);
</script>

<header class=" h-[80px] z-10 text-white bg-mainbg relative md:p-9 p-4">
	<div class="px-2 flex justify-between items-center w-full h-full">
		<h1 class="text-3xl font-headingFont font-bold mr-4 sm:text-4xl"><a href="/">Todos</a></h1>
		<nav class="hidden md:flex md:text-xl">
			<ul class="hidden md:flex md:mr-10 text-xl navbar-list">
				<li class="p-4"><a href="/">Home</a></li>

				{#if !$isCheckingAuthStatus}
					{#if !$userId}
						<div class=" md:flex md:pr-4 items-center">
							<div class="navbar-cta relative">
								<span class="flex items-center gap-5"><a href="/login">Login</a></span>
							</div>
						</div>
					{:else}
						<li class="p-4"><a href="/todos">Todos</a></li>
						<li class="p-4"><a href="/todos" on:click={() => signOut(auth)}>Logout</a></li>
					{/if}
				{/if}
			</ul>
		</nav>
		<button
			class="md:hidden cursor-pointer"
			on:click={() => (navIsOpen = !navIsOpen)}
			on:keypress={() => (navIsOpen = !navIsOpen)}
			aria-label="Mobile Menu"
		>
			{#if navIsOpen}
				<svg
					stroke="currentColor"
					fill="currentColor"
					stroke-width="0"
					viewBox="0 0 20 20"
					height="30"
					width="30"
					xmlns="http://www.w3.org/2000/svg"
					><path
						fill-rule="evenodd"
						d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
						clip-rule="evenodd"
					/></svg
				>
			{:else}
				<svg
					stroke="currentColor"
					fill="currentColor"
					stroke-width="0"
					viewBox="0 0 20 20"
					height="30"
					width="30"
					xmlns="http://www.w3.org/2000/svg"
					><path
						fill-rule="evenodd"
						d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
						clip-rule="evenodd"
					/>
				</svg>
			{/if}
		</button>
	</div>

	{#if navIsOpen}
		<ul
			class="md:hidden absolute left-0 text-xl bg-mainbg w-full h-[calc(100vh-80px)] flex justify-center flex-col align-middle px-8 py-10"
		>
			<li class="text-center py-2"><a href="/">Home</a></li>
			<li class="text-center py-2"><a href="/todos">Todos</a></li>
			<div class="flex flex-col items-center my-4">
				<div class="bg-transparent px-8 mb-4">
					<span class="flex flex-col gap-3 items-center"><a href="/account">Account</a></span>
				</div>
			</div>
		</ul>
	{/if}
</header>
