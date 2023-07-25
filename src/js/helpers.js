import { async } from 'regenerator-runtime';
import { TIMEOUT_SECONDS } from './config.js';
const timeout = function (s) {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(new Error(`Request took too long! Timeout after ${s} second`));
    }, s * 1000);
  });
};

export const AJAX = async function (url, uploadData = undefined) {
  try {
    const result = uploadData
      ? await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(uploadData),
        })
      : await fetch(url);
    const res = await Promise.race([result, timeout(TIMEOUT_SECONDS)]);
    const resultInfo = await res.json();
    return resultInfo;
  } catch (err) {
    throw err;
  }
};
/*
export const getJSON = async function (url) {
  try {
    const result = await fetch(url);
    const res = await Promise.race([result, timeout(TIMEOUT_SECONDS)]);
    const resultInfo = await res.json();
    return resultInfo;
  } catch (err) {
    alert(err);
  }
};

export const sendJSON = async function (url, uploadData) {
  try {
    const result = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(uploadData),
    });
    const res = await Promise.race([result, timeout(TIMEOUT_SECONDS)]);
    const resultInfo = await res.json();
    return resultInfo;
  } catch (err) {
    alert(err);
  }
};
*/
