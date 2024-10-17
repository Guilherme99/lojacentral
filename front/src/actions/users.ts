export function setUser(payload: any) {
  return {
    type: "SET_USER",
    payload,
  };
}

export function userActive(payload: any) {
  return {
    type: "USER_ACTIVE",
    payload,
  };
}
