<script>
import { onMount } from 'svelte';
import { writable } from 'svelte/store';
import { api_prefix, base_url } from './store';
import { is_auth } from './auth'
import { query_selector_all } from 'svelte/internal';

let topic_title;
let topic_description;
let list = writable([]);

onMount (async () => {
	await fetch_topic_list();
	});

async function fetch_topic_list(){
	let topics = await fetch(`${api_prefix}/topics`).then(x=>x.json())
	let temp_list = [];
	if(!Array.isArray(topics)){
		temp_list.push(topics)
	} else {
		temp_list = topics
	}
	list.set(temp_list);
}

async function add_topic(){
	if(topic_title==''){
		console.error("empty");
		return
	}	
	
	console.log(topic_title, topic_description);

	let partial_topic = {title:topic_title, description:topic_description};
	console.log(partial_topic);
	
	let response = await fetch(`${api_prefix}/topic`,{
		method:'PUT',
		body: JSON.stringify(partial_topic),
		headers: {"Content-Type":"application/json"}
	});
	
	if(response.ok){
		await fetch_topic_list();
		let title = query_selector_all('input#title');
		title.value = '';
		let desc = query_selector_all('textarea#description');
		desc.value = '';
		topic_title='';
		topic_description='';

	}

}
</script>

<h3>topics</h3>
<ul>
{#each $list as topic}
	<li><a href="{base_url}/?topic={topic[0]}">{topic[1]}</a></li>
{/each}
</ul>

{#if $is_auth}
<!-- ADD TOPIC -->
<h3> add a topic </h3>
<div>
	<input bind:value={topic_title} id="title" size="20" placeholder="topic title"/>
</div>
<div>
	<textarea bind:value={topic_description} id="description" placeholder="description"/>
</div>
<div>
	<button on:click={add_topic} disabled={!$is_auth}>add topic</button>
</div>
{/if}



