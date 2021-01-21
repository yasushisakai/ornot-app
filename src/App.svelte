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
</main>

<style>
</style>
