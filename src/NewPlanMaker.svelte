<script>
	import { topic_id, api_prefix, topic_data } from "./store";
	import { query_selector_all } from "svelte/internal";

	let option1;
	let option2;
	let textarea;
	let inputs = "";
	let type = "";
	async function add_simple_plan() {
		// create simple plan
		let plan = {};
		plan.type = type;

		switch (type){
			case 'url':
				plan.data = [option2,option1];
				break;
			case 'long':
				plan.data = [option1,textarea];
				break;
			case 'simple':
			case 'image':
				plan.data= option1;
				break;
			default:
				plan.type= 'simple'
				plan.data = option1
		}

		let resp = await fetch(`${api_prefix}/topic/${topic_id}/new_plan`, {
			method: "POST",
			body: JSON.stringify(plan),
			headers: { "Content-Type": "application/json" },
		}).then(async () => {
			const new_topic = await fetch(
				`${api_prefix}/topic/${topic_id}`
			).then((x) => x.json());
			console.log(new_topic);
			topic_data.set(new_topic);
		});

		option1 = option2 = textarea = "";
	}

	$:{
		let op1 = query_selector_all("#option1")[0]
		switch(type){
			case "simple":
			case "long":
				op1.placeholder="new plan name";
				break;
			case "image":
			case "url":
				op1.placeholder="url link";
		}
	}

</script>

<label for="type">add new:</label>
<select bind:value={type} name="type" id="type">
	<option value="simple">simple</option>
	<option value="long">long text</option>
	<option value="image">image url</option>
	<option value="url">url link</option>
</select>
<input id="option1" bind:value={option1} placeholder="new plan name" />
{#if type==="url"}
<input id="option2" bind:value={option2} placeholder="link description" />	
{:else if type==="long"}
<textarea bind:value={textarea} placeholder="description" />	
<button on:click={add_simple_plan}>add plan</button>
{/if}

{#if type !== "long"}
<button on:click={add_simple_plan}>+</button>
{/if}
