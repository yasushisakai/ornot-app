<script>
import {is_auth} from './auth';
import {derived} from 'svelte/store';
import {topic_data, look_up, user_id, api_prefix, topic_id} from './store';
import {load_topic_data} from './load_data';
import { query_selector_all } from 'svelte/internal';

let option;

const my_votes = derived(
	topic_data,
	($topic_data) => {
		if($topic_data.setting){
			return $topic_data.setting.votes[user_id] || {}
		}else{
			return {};
		}
	}
);

const is_participant = derived(
	topic_data,
	($topic_data) => {
		if($topic_data.setting){
			return $topic_data.setting.voters.some(v=>v==user_id)
		} else {
			return false;
		}
	}
);

const participants = derived(
	[is_participant, look_up, topic_data, my_votes],
	([$is_participant, $look_up, $topic_data, $my_votes]) => {
		if($is_participant){
			return $topic_data.setting.voters
				.filter(v=>v!=user_id)
				.map(v=>[$look_up[v],v])
				.reduce((fold, v)=>{
					let ph = $my_votes[v[1]] ? $my_votes[v[1]] : 0.0;
					return `${fold}<li>
				<label for="${v[0]}">${v[0]}:</label>
				<input name="${v[0]}" class="votes" id="${v[1]}" placeholder="${ph}" size="4"/></li>`},'');
		}else{
			return '';
		}	
	}
);

const plans = derived(
	[is_participant, topic_data, my_votes],
	([$is_participant, $topic_data, $my_votes]) => {
		if($is_participant){
			return $topic_data.setting.plans
				.reduce((fold, v)=>{
					let ph = $my_votes[v.title] ? $my_votes[v.title] : 0.0;
					return `${fold}<li>
				<label for="${v.title}">${v.title}:</label>
				<input name="${v.title}" class="votes" id="${v.title}" placeholder="${ph}" size="4"/></li>`
				},'')
		}else{
			return '';
		}	
	}
)

async function add_me(){
	await fetch(`${api_prefix}/topic/${topic_id}/user/${user_id}`,{
		method:'POST'
	}).then(async ()=>{
		await load_topic_data();	
	});
}

async function add_plan(){
	if(option == '') {
		console.error("empty")
	}
	await fetch(`${api_prefix}/topic/${topic_id}/plan/${option}`,{
		method:'POST'
	}).then(async ()=>{
		await load_topic_data();
		option = '';
	});
}

async function update_vote(){
	// collect all inputs
	let casts = query_selector_all('input.votes')
		.filter(i=>{
			let value = parseFloat(i.value);
			return !isNaN(value)
		});

	let new_values = {};
	casts.map((i)=>{
		new_values[i.id]=Math.max(parseFloat(i.value), 0.0)});

	let new_votes = Object.assign($my_votes,new_values);

	let total = Object.values(new_votes).reduce((total,v)=>total+v, 0.0);

	Object.keys(new_votes).map(k=>{
		new_votes[k] /= total;
	});

	let new_topic_data = await fetch(`${api_prefix}/topic/${topic_id}/vote/${user_id}`,{
		method:'PUT',
		headers:{'Content-Type':'application/json'},
		body: JSON.stringify(new_votes)
	}).then(x=>x.json());

	if (new_topic_data.setting){
		topic_data.set(new_topic_data)
	}else{
		casts.map(i=>i.value='')
	}
}

</script>

<style>
div#voter{
	width:700px;
}
div#participants {
	width: 50%;
	float: left;
}
div#plans {
	width: 50%;
	float: right;
}
div#update-button{
	clear: both;
}

</style>

<h3>Votes</h3>

{#if $is_participant}
<div id="voter">
<div id="participants">
	<h4>participants:</h4>
	<ul>
	{@html $participants}
	</ul>
</div>

<div id="plans">
	<h4>plans:</h4>
	<ul>
	{@html $plans}
	<li>
	<input bind:value="{option}" size=15 placeholder="new plan" >
	<button on:click="{add_plan}">+</button>
 	</li>
	</ul>
</div>
<div id="update-button">
	<button on:click="{update_vote}">update vote</button>
</div>
</div>
{:else}
	<button on:click={add_me} disabled={!$is_auth}>add me</button>
	{#if !$is_auth}
	<p>register to participate this poll.</p>
	{/if}
{/if}



