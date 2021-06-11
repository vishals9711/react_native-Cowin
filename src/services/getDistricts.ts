import axios, { AxiosResponse } from 'axios';
import { API_BASE } from '../constants/paths';
import { DISTRICT_RESPONSE } from '../models/districts';

// export async function getDistrictByState(
//   stateId: number
// ) {
//   const url = API_BASE + `/v2/admin/location/districts/${stateId}`;
//   console.log(url);
//   try {
//     const response = await fetch(url);
//     const json = await response.json();
//     return json;
//   } catch (error) {

//   }

// }

export const getDistrictByState = (stateId: number) => {
  const url = API_BASE + `/v2/admin/location/districts/${stateId}`;
  return fetch(url)
    .then((response) => response.json())
    .then((json) => {
      console.log(json);
      return json;
    })
    .catch((error) => {
      console.error(error);
    });
};