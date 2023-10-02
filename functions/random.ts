export function randomName() {
  const randomNumber = Math.floor(Math.random() * 1000);
  return `TEST-${randomNumber}`;
}

export function randomID() {
  return Math.floor(Math.random() * (9999 - 1000 + 1) + 1000);
}

export function randomCode() {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "TEST-";
  for (let i = 0; i < 6; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}
