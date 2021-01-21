import { topic_data, topic_id as id, api_prefix } from "./store";

export async function load_topic_data() {
  let temp_data = await fetch(`${api_prefix}/topic/${id}`).then((x) =>
    x.json()
  );
  topic_data.set(temp_data);
}
