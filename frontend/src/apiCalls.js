import axios from "axios";
import io from "socket.io-client";

var BASE_URL = "";
if (process.env.NODE_ENV === "development") {
  BASE_URL = "http://localhost:8080";
}

export const socket = io(BASE_URL);

export function getAllAdventures() {
  return axios.get(`${BASE_URL}/api/explore`).then(res => res.data);
}

export function setAllAdventures(advs) {
  return axios.post(`${BASE_URL}/api/setAdvs`, {
    body: advs
  });
}

export function getAllTasksInAdventure(advId) {
  return axios
    .get(`${BASE_URL}/api/adv`, {
      params: {
        advId: advId
      }
    })
    .then(res => res.data);
}

export function fly(prog, mac, req) {
  return axios.post(`${BASE_URL}/api/fly`, {
    body: {
      program: prog,
      address: mac,
      requirements: req
    }
  });
}

export function simulate(prog) {
  return axios.post(`${BASE_URL}/api/simulate`, {
    body: {
      program: prog
    }
  });
}

export function validate(prog, bounds) {
  return axios.post(`${BASE_URL}/api/validate`, {
    body: {
      program: prog,
      bounds: bounds
    }
  });
}
