const timeInMinutes = 30;
const seconds = 60;
const ms = 1000;

export const AccessToken = {
  expirationInMs: timeInMinutes * seconds * ms,
};
// export class AccessToken {
//   constructor(readonly value: string) {}

//   static get expirationInMs(): number {
//     const timeInMinutes = 30;
//     const seconds = 60;
//     const ms = 1000;

//     return timeInMinutes * seconds * ms;
//   }
// }
