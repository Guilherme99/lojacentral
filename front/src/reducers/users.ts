export default function users(
  state = {
    name: "",
    email: "",
    access_token: "",
    refresh_token: "",
    roles: [],
    current_role: "",
    active: false,
  },
  action: { type: string; payload: any }
) {
  switch (action.type) {
    case "SET_USER":
      return {
        ...state,
        email: action.payload[0],
        name: action.payload[1],
        roles: action.payload[2],
        access_token: action.payload[3],
        refresh_token: action.payload[4],
        current_role: action.payload[5],
      };
    case "USER_ACTIVE":
      return {
        ...state,
        active: action.payload,
      };
    case "OFF":
      return {
        name: "",
        email: "",
        access_token: "",
        refresh_token: "",
        roles: [],
        current_role: "",
        active: false,
      };
    default:
      return state;
  }
}
