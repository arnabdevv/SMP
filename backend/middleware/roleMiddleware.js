// middleware/roleMiddleware.js

/**
 * Role-based access control middleware.
 * Usage: authorizeRole('admin'), authorizeRole('admin', 'teacher')
 */

exports.authorizeRole = (...allowedRoles) => {
  return (req, res, next) => {
    // Check if user is attached to the request (should be done in authMiddleware)
    if (!req.user || !req.user.role) {
      return res
        .status(401)
        .json({ message: "Unauthorized: User not authenticated" });
    }

    const userRole = req.user.role;

    // Check if user role is in the list of allowed roles
    if (!allowedRoles.includes(userRole)) {
      return res
        .status(403)
        .json({
          message: "Forbidden: You do not have access to this resource",
        });
    }

    next(); // User has permission
  };
};
