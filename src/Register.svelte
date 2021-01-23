<script>
	import {writable} from 'svelte/store';
	import {api_prefix} from './store';
	let nickname;
	let email;
	const message=writable('');
	let did_send=writable(false);
	async function register() {
		await fetch(`${api_prefix}/user/signup`, {
			method: 'POST',
			body: JSON.stringify({nickname, email}),
			headers: {
				"Content-Type": "application/json"
			}
		});	
		message.set("<p>email sent for validation, check your inbox :)</p>");
		did_send.set(true);		
	}
</script>

<style>
	div#register{
		margin-top: 1em;
	}
</style>

<div id=register>
register to participate
<label for="nickname">nickname</label>
<input bind:value="{nickname}"  name="nickname" type="text" size="20" placeholder="nickname">
<label for="email">email</label>
<input bind:value="{email}" name="email" type="email" size="20" placeholder="you@example.com">
<button on:click="{register}" disabled={$did_send}>register</button>
<p>ornot.vote will use your email address *only* to validating that you own it. Developers or maintainers will not be able to retreive the original address.</p>
{@html $message}
</div>

