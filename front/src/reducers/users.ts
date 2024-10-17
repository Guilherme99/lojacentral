export default function users(
  state = {
    name: "",
    email: "",
    token: "",
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
        roles: action.payload[0],
        name: action.payload[1],
        email: action.payload[2],
        token: action.payload[3],
        current_role: action.payload[4],
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
        token: "",
        roles: [],
        current_role: "",
        active: false,
      };
    default:
      return state;
  }
}
