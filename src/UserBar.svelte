<script>
	import Register from './Register.svelte'
	import { nickname, user_id, base_url} from './store.js'
	import { is_auth } from './auth'
	
	function clear_cache(){
		localStorage.clear();
		window.location.href = base_url;
	}

</script>

<style>
span{
	font-size:small;
	color: #999;
}
</style>

this is <a href={base_url}>ornot.vote</a>. | 
{#if $is_auth}
	hi, {$nickname}(<span class="user_id">#{user_id.substring(0,6)}</span>)
	<button on:click={clear_cache}>clear cache</button>
{:else}
	hello, stranger
	<Register/>
{/if}

	
