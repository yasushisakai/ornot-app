<script>
	import { onMount } from "svelte";
	import {
		api_prefix,
		base_url,
		topic_id as id,
		topic_data,
		is_topic_loaded,
	} from "./store";
	import Caster from "./Caster.svelte";
	import Results from "./Results.svelte";

	async function load_topic_data() {
		let topic = await fetch(`${api_prefix}/topic/${id}`).then(x=>x.json())
		console.log(topic)
		topic_data.set(topic);
	}

	onMount(() => load_topic_data());

	let results;
	$:{
		if($topic_data.result){
			results = Object.keys($topic_data.result.votes).length > 0
		}
	}

</script>

<style>
	#desc {
		width: 750px;
	}
</style>

<div>
	<a href={base_url}>back to list</a>
	{#if !$is_topic_loaded}
		<h1>loading...</h1>
	{:else}
		<h1>{$topic_data.title}</h1>
		<p id="desc">{$topic_data.description}</p>
		<Caster />
		{#if results}
			<Results />
		{:else}
			no results yet
		{/if}
	{/if}
</div>
