import { TIMEOUT_SEC } from "./config";

const timeout = function (s) {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(new Error(`Request took too long! Timeout after ${s} second`));
    }, s * 1000);
  });
};


export const getJSON = async function(url) {
    try {
    console.log('Fetching data from:', url);
    const fetchPro = fetch(url);
    const res = await Promise.race([fetchPro, timeout(TIMEOUT_SEC)]);
    const data = await res.json();
    console.log('Received data:', data);


    if(!res.ok) throw new Error(`${res.status} - ${data.message} - ${data.error}`);
    return data;
    }catch (error) {
        console.error('Error in getJSON:', error);
        throw error;
    }
}