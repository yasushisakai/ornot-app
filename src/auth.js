import { access_token, user_id, api_prefix, nickname } from "./store";

import { readable } from "svelte/store";

export const is_auth = readable(false, async function start(set) {
  if (access_token == undefined || user_id == undefined) {
    set(false);
  } else {
    let req = await fetch(`${api_prefix}/user/${user_id}`, {
      method: "GET",
      headers: {
        Authorization: `bearer ${access_token}`,
      },
    });

    if (req.ok) {
      let user = await req.json();
      localStorage.setItem("nickname", user.nickname);
      nickname.set(user.nickname);
      set(true);
    } else {
      console.log(req.status);
      set(false);
    }
  }
  return function stop() {};
});
