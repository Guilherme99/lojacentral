const roles = {
  admin: ["ERG_ADMIN"],
};

const rolesPath = [
  {
    path: "/home",
    role: roles.admin,
  },
  {
    path: "/files",
    role: roles.admin,
  },
  {
    path: "/solicitations",
    role: roles.admin,
  },
];

export default rolesPath;
