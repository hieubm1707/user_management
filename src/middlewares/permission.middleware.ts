import { Request, Response, NextFunction, RequestHandler } from 'express';
import { UserModel, PermissionModel, PositionPermissionModel, RoutePermissionModel } from '../models';
import PositionModel from '../models/position.model';
import { AuthUser } from '../types';
import { match } from 'path-to-regexp';

async function getRequiredPermission(req: Request): Promise<string | undefined> {
  // Get all active route permissions from the database
  const routePermissions = await RoutePermissionModel.findAll({
    where: { isActive: true }
  });
  // Iterate through each route and match static/dynamic routes
  for (const route of routePermissions) {
    // route.route example: 'GET /salary/:userId'
    const [method, ...pathParts] = route.route.split(' ');
    const routePath = pathParts.join(' ');
    if (method !== req.method) continue;
    // Match the actual request path with the static/dynamic route
    const matcher = match(routePath, { decode: decodeURIComponent, end: true });
    // req.baseUrl + req.path is the actual path, e.g., /salary/123
    if (matcher(req.baseUrl + req.path)) {
      return route.permissionName;
    }
  }
  return undefined;
}


export const checkPermission = (permissionName?: string): RequestHandler => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = req.auth as AuthUser;
      if (!user) {
        return res.status(401).json({ message: 'Not logged in!' });
      }

      if (user.role === 'admin') {
        return next();
      }

      const requiredPermission = permissionName || await getRequiredPermission(req);

      if (!requiredPermission) {
        return res.status(403).json({ message: 'This function is not configured for permissions.' });
      }

      if (!user.positionId) {
        return res.status(403).json({ message: 'User has no position!' });
      }

      const permissions = await PositionPermissionModel.findAll({
        where: { positionId: user.positionId },
        attributes: ['permissionId'],
      });
      const userPermissionIds = permissions.map((p: PositionPermissionModel) => p.permissionId);

      const permissionRow = await PermissionModel.findOne({ where: { name: requiredPermission } });
      if (!permissionRow) {
        return res.status(403).json({ message: 'Permission does not exist in the system!' });
      }
      const requiredPermissionId = permissionRow.id;

      if (!userPermissionIds.includes(requiredPermissionId)) {
        return res.status(403).json({ message: 'You do not have permission to perform this function!' });
      }

      if (
        ['update_user', 'delete_user'].includes(requiredPermission) &&
        req.params.id &&
        req.params.id !== user.id
      ) {
        const targetUser = await UserModel.findByPk(req.params.id, {
          include: [{ model: PositionModel, as: 'position' }],
        });
        if (!targetUser || !targetUser.position) {
          return res.status(404).json({ message: 'Target user does not exist or has no position!' });
        }
        const myPosition = await PositionModel.findByPk(user.positionId);
        if (!myPosition || typeof (myPosition as any).level !== 'number') {
          return res.status(403).json({ message: 'Unable to determine your level!' });
        }
        if ((myPosition as any).level <= (targetUser.position as any).level) {
          return res.status(403).json({ message: 'You do not have sufficient level to perform operations on this user!' });
        }
      }

      return next();
    } catch (err) {
      return next(err);
    }
  };
};