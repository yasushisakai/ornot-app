import { writable,derived } from "svelte/store";

export const api_prefix = "http://localhost:8080/api/v1";
export const base_url = "http://localhost:5000";

// export const base_url = "https://ornot.vote"
// export const api_prefix = `${base_url}/api/v1`;

export const access_token = localStorage.getItem("access_token");

const params = new URLSearchParams(window.location.search);
export let topic_id = params.get("topic");
export const user_id = localStorage.getItem("user_id");
export const nickname = writable("user");
export const topic_data = writable({});
export const plans = writable({});

export const is_topic_loaded = derived(topic_data, ($topic_data)=>{
	return Object.keys($topic_data).length != 0
});

export const influence_ranking = derived(topic_data, ($topic_data)=>{
	if (!$topic_data.result) {
		return []
	}
	return Object.entries($topic_data.result.influence).sort((a,b)=>a[1]<b[1])
});

export const plan_ranking = derived([topic_data, plans], ([$topic_data, $plans])=>{

	if(!$topic_data.result) {
		return []
	}

	let votes = Object.entries($topic_data.result.votes).sort((a,b)=>a[1]<b[1]);
	
	let result = [];
	for (const ballot of votes) {
		// let plan = $plans[ballot[0]] ? $plans[ballot[0]].data : ballot[0];
		let plan; 

		if ($plans[ballot[0]]) {
			switch ($plans[ballot[0]].type){
				case 'image':
					const path = $plans[ballot[0]].data;
					plan = path.replace(/^.*[\\\/]/, '');
					break;
				case 'simple':
					plan = $plans[ballot[0]].data;
					break;
				case 'url':
					plan = $plans[ballot[0]].data[1];
					break;
				case 'long':
					plan = $plans[ballot[0]].data[0];
					break;
			}
		} else {
			plan = ballot[0]
		}

		let value = ballot[1];

		result.push([plan,value])
	}

	return result

});

export const look_up = writable({});
