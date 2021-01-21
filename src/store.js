import { writable } from "svelte/store";

// export const api_prefix = "http://localhost:8080/api/v1";
// export const base_url = "http://localhost:5000";

export const base_url = "https://ornot.vote"
export const api_prefix = `${base_url}/api/v1`;

export const access_token = localStorage.getItem("access_token");

const params = new URLSearchParams(window.location.search);

export let topic_id = params.get("topic");

export const nickname = writable("user");

export const topic_data = writable({});

export const look_up = writable({});

export const user_id = localStorage.getItem("user_id");
