const Joi = require("joi");
const { createError } = require("../configs/errorConfig.js");

const pick = (object, keys) => {
  return keys.reduce((obj, key) => {
    if (object && Object.prototype.hasOwnProperty.call(object, key)) {
      // eslint-disable-next-line no-param-reassign
      obj[key] = object[key];
    }
    return obj;
  }, {});
};

const validate = (schema) => (req, res, next) => {
  const validSchema = pick(schema, ["params", "query", "body"]);
  const object = pick(req, Object.keys(validSchema));
  const { value, error } = Joi.compile(validSchema)
    .prefs({ errors: { label: "key" }, abortEarly: false })
    .validate(object);

  if (error) {
    const errorMessage = error.details
      .map((details) => details.message)
      .join(", ");
    return next(createError(412, errorMessage));
  }
  Object.assign(req, value);
  return next();
};

const USER_ROLES = {
  SUPER_ADMIN: "Super Admin",
  ADMIN: "Admin",
  BRANCH_MANAGER: "Branch Manager",
  STAFF: "Staff",
};

const ROUTES = {
  ORDER: "/admin/orders",
  BRANCH: "/admin/branch",
  STAFF: "/admin/user/create-staff",
  USER: "/admin/user",
};

// Define route + method combinations per role
const ROUTE_PERMISSIONS = {
  [USER_ROLES.SUPER_ADMIN]: [
    { path: ROUTES.ORDER, methods: ["GET", "POST", "PUT", "DELETE"] },
    { path: ROUTES.BRANCH, methods: ["GET", "POST", "PUT", "DELETE"] },
    { path: ROUTES.STAFF, methods: ["POST"] },
    { path: ROUTES.USER, methods: ["GET", "PUT", "DELETE", "POST"] },
  ],
  [USER_ROLES.STAFF]: [
    { path: ROUTES.ORDER, methods: ["GET", "POST", "PUT"] },
    { path: ROUTES.STAFF, methods: ["PUT"] },
  ],
};

const roleValidation = (req, res, next) => {
  const role = req.user.role;
  const route = req.originalUrl.split("?")[0] || req.baseUrl; // safer in case of query params
  const method = req.method;

  const permissions = ROUTE_PERMISSIONS[role] || [];

  const isAllowed = permissions.some(({ path, methods }) => {
    return route.startsWith(path) && methods.includes(method);
  });

  if (isAllowed) {
    next();
  } else {
    res.status(403).json({ data: { message: "Forbidden access" } });
  }
};

module.exports = { validate, pick, roleValidation };
