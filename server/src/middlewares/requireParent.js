// set by authJwt to be an authenticated parent, use after authJwt.

export function requireParent(req, res, next) {
  const parentId = req.user?.parentId;
  const role = req.user?.role;

  if (!parentId) {
    return res.status(401).json({ ok: false, error: { code: "NO_AUTH", message: "Not authenticated" } });
  }
  if (role !== "PARENT") {
    return res.status(403).json({ ok: false, error: { code: "FORBIDDEN", message: "Parents only" } });
  }
  next();
}
