import { topic_data, topic_id as id, api_prefix } from "./store";

export async function load_topic_data() {
  let temp_data = await fetch(`${api_prefix}/topic/${id}`).then((x) =>
    x.json()
  );
  topic_data.set(temp_data);
}	

export async function load_lookup(){
let namelist = await fetch(`${api_prefix}/users`, {
			method:'POST',
			body: JSON.stringify(voter_ids),
			headers: {'Content-Type':'application/json'}
		}).then(x=>x.json());
		let obj = {};
		namelist.map(user=>{obj[user[0]]=user[1]});
		look_up.set(obj);
}


