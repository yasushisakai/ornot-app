<script>
	import {onMount} from 'svelte';
	import {api_prefix, base_url, topic_id as id, topic_data, look_up} from './store';
	import {load_topic_data} from './load_data';
	import Voter from './Voter.svelte';
	import Results from './Results.svelte';
	
	onMount(async ()=>{
		await load_topic_data();
		console.log($topic_data);
		let voter_ids = $topic_data.setting.voters;
		let namelist = await fetch(`${api_prefix}/users`, {
			method:'POST',
			body: JSON.stringify(voter_ids),
			headers: {'Content-Type':'application/json'}
		}).then(x=>x.json());
		let obj = {};
		namelist.map(user=>{obj[user[0]]=user[1]});
		look_up.set(obj);
	});

</script>

<style>
	#desc{
		width: 750px;
	}
</style>

<div>
<a href="{base_url}">back to list</a>
{#if !$topic_data}
<h1>loading...</h1>
{:else}
<h1>{$topic_data.title}</h1>
<p id="desc">
{$topic_data.description}
</p>
<Voter/>
<Results/>
{/if}
</div>


