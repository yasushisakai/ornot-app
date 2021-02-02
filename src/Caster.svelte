<script>
	import { topic_data, api_prefix, topic_id, user_id, plans } from "./store";
	import NewPlanMaker from "./NewPlanMaker.svelte";
	import { query_selector_all } from "svelte/internal";

	async function get_topic_plans() {
		let result = "";
		// let plans = {}

		const my_votes = $topic_data.setting.votes[user_id];

		let current = my_votes ? my_votes : {};

		let new_plans = {};
		for (const id of $topic_data.setting.plans) {
			let plan;

			if (id in $plans) {
				plan = $plans[id];
			} else {
				const url = `${api_prefix}/plan/${id}`;
				const response = await fetch(url);
				plan = await response.json();
				new_plans[id] = plan;
			}

			plans.set(new_plans);

			let current_value = current[id] != undefined ? current[id] : 0.0;

			let plan_render='';

			console.log(plan.type);

			switch (plan.type){
				case 'simple':
					plan_render=plan.data
					break;
				case 'long':
					plan_render=`${plan.data[0]}<details>${plan.data[1]}</details>`
					break;
				case 'image':
					plan_render=`<img src=${plan.data} style="width:80%">`
					break;
				case 'url':
					plan_render=`<a href=${plan.data[1]} target="_blank" rel="noopener noreferrer">${plan.data[0]}</a>`
					break;
				default:
					plan_render=plan.data
			}

			result += `<li>
				<label for=${id}>${plan_render}</label>
				<input name=${id} class="vote" size="4" placeholder=${current_value} />
				</li>`;
		}

		return result;
	}

	async function get_topic_voters() {
		const namelist = await fetch(`${api_prefix}/users`, {
			method: "POST",
			body: JSON.stringify($topic_data.setting.voters),
			headers: { "Content-Type": "application/json" },
		}).then((x) => x.json());

		let users = {};

		namelist.map((li) => (users[li[0]] = li[1]));

		const my_votes = $topic_data.setting.votes[user_id];
		let current = my_votes != undefined ? my_votes : {};

		let result = "";

		for (const uid of $topic_data.setting.voters) {
			let nickname;
			let current_value = 0.0;
			if (uid !== user_id) {
				nickname = users[uid];
				current_value = current[uid] ? current[uid] : 0.0;
				result += `<li>
				<label for=${uid}>${nickname}</label>
				<input name=${uid} class="vote" size="4" placeholder=${current_value} />
				</li>`;
			}
		}

		return result;
	}

	async function update_vote() {
		const my_votes = $topic_data.setting.votes[user_id];
		let current = my_votes != undefined ? my_votes : {};
		let new_casts = {};
		const nodes = query_selector_all("input.vote");
		const left = nodes.filter(
			(v) => v.value != "" && parseFloat(v.value) > 0.0
		);
		let sum = left.reduce((acc, v) => acc + parseFloat(v.value), 0.0);
		left.map((v) => (new_casts[v.name] = v.value / sum)); // first normalization
		const updated_votes = Object.assign(current, new_casts);
		sum = Object.values(updated_votes).reduce((ac, v) => ac + v, 0.0);
		Object.keys(updated_votes).map(
			(v) => (updated_votes[v] = updated_votes[v] / sum)
		);

		await fetch(
			`${api_prefix}/topic/${topic_id}/vote/${user_id}`,
			{
				method: "PUT",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(updated_votes),
			}
		).then((x) => x.json());
		nodes.map((input) => {
			input.value = "";
			const ph = updated_votes[input.name] ? updated_votes[input.name] : 0.0;
			input.placeholder = ph;
		});
		
		let new_topic = await fetch(`${api_prefix}/topic/${topic_id}`).then(x=>x.json());

		topic_data.set(new_topic);
		// update placeholders
	}

	async function add_myself() {
		await fetch(`${api_prefix}/topic/${topic_id}/user/${user_id}`,{
			method: 'POST'
		});
		const new_topic = await fetch(
			`${api_prefix}/topic/${topic_id}`
		).then((x) => x.json());
		topic_data.set(new_topic);
	}

	let topic_plans = get_topic_plans();
	let topic_voters = get_topic_voters();

	let participating;

	$: {
		participating = $topic_data.setting.voters.includes(user_id)
		topic_plans = get_topic_plans();
		topic_voters = get_topic_voters();
	}

</script>

<style>
	div#caster {
		width: 700px;
	}
	div#participants {
		width: 50%;
		float: left;
	}
	div#plans {
		width: 50%;
		float: right;
	}
	div#update-button {
		clear: both;
	}
</style>

<div id="caster">
	<div id="participants">
		{#await topic_voters}
			loading
		{:then result}
			<ul>
				{@html result}
				{#if !participating}
					<li><button on:click={add_myself}>add myself</button></li>
				{/if}
			</ul>
		{/await}
	</div>
	<div id="plans">
		{#await topic_plans}
			loading
		{:then result}
			<ul>
				{@html result}
				<li>
					<NewPlanMaker />
				</li>
			</ul>
		{/await}
	</div>
	<div id="update-button">
		{#if $topic_data.setting.voters.length > 0 || $topic_data.setting.plans.length > 0}
			<button on:click={update_vote}>update vote</button>
		{/if}
	</div>
</div>
