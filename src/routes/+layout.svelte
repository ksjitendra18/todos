<script lang="ts">
	import '@fontsource/roboto/400.css';
	import '@fontsource/roboto/500.css';
	import '@fontsource/roboto/700.css';

	import '../app.css';
	import Navbar from '../components/navbar.svelte';

	import { page } from '$app/stores';

	import { userId, isCheckingAuthStatus } from '../store/authStore';
	import { getAuth, onAuthStateChanged } from 'firebase/auth';
	import { auth } from '../utils/firebase';

	if (!$userId) {
		onAuthStateChanged(auth, (userr) => {
			if (userr) {
				$userId = userr.uid;

				$isCheckingAuthStatus = false;

				return;
			} else {
				$userId = null;
				$isCheckingAuthStatus = false;

				return;
			}
			$isCheckingAuthStatus = false;
		});

		console.log('no user id');
	}
</script>

<Navbar />
<main class={$page.url.pathname === '/' ? '' : 'p-4 md:p-9'}>
	<slot />
</main>
