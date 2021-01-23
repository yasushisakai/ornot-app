<script>
	import UserBar from './UserBar.svelte';
	import TopicList from './TopicList.svelte';
	import TopicInfo from './TopicInfo.svelte';
	import { topic_id } from './store.js';
</script>

<main>
	<UserBar/>
	{#if topic_id == undefined}
	<TopicList/>
	{:else}
	<TopicInfo/>
	{/if}
	<div id="bottom-info">
	<p class="warning">please note that this is a very early version for experimentation and demo-ing purposes.</p>
	</div>
</main>

<style>
	div#bottom-info{
		clear:both;
	}
	p.warning {
		color: #ff0000;
	}

</style>
