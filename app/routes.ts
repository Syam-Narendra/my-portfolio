import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("books", "routes/books.tsx"),
  route("projects", "routes/projects.tsx"),
  route("blogs", "routes/blogs.tsx"),
  route("admin/login", "routes/admin-login.tsx"),
  route("admin", "routes/admin.tsx"),
] satisfies RouteConfig;
