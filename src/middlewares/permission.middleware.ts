import { Request, Response, NextFunction, RequestHandler } from 'express';
import { mapPermission } from '../config/map.config';
import { UserModel } from '../models';
import PositionModel from '../models/position.model';
import { QueryTypes } from 'sequelize';
import { AuthUser } from '../types';

function getRequiredPermission(req: Request): string | undefined {
  const keys = [
    `${req.method} ${req.baseUrl}${req.route?.path || ''}`,
    `${req.method} ${req.baseUrl}`,
    `${req.method} ${req.path}`,
    `${req.method} ${req.originalUrl}`
  ];
  for (const key of keys) {
    const permission = (mapPermission as Record<string, string>)[key];
    if (permission) {
      return permission;
    }
  }
  return undefined;
}

async function getUserPermissionIds(positionId: number): Promise<number[]> {
  const permissions = await PositionModel.sequelize!.query(
    `SELECT permission_id FROM position_permissions WHERE position_id = :positionId`,
    { replacements: { positionId }, type: QueryTypes.SELECT }
  );
  return Array.isArray(permissions) ? permissions.map(p => (p as any).permission_id) : [];
}

async function getPermissionIdByName(name: string): Promise<number | undefined> {
  const permissionRows = await PositionModel.sequelize!.query(
    `SELECT id FROM permission WHERE name = :name`,
    { replacements: { name }, type: QueryTypes.SELECT }
  );
  const permissionRow = Array.isArray(permissionRows) ? permissionRows[0] : undefined;
  return permissionRow ? (permissionRow as any).id : undefined;
}

async function checkLevel(user: AuthUser, targetUserId: string): Promise<string | null> {
  const targetUser = await UserModel.findByPk(targetUserId, {
    include: [{ model: PositionModel, as: 'position' }],
  });
  if (!targetUser || !targetUser.position) {
    return 'Target user does not exist or has no position!';
  }
  const myPosition = await PositionModel.findByPk(user.positionId);
  if (!myPosition || typeof (myPosition as any).level !== 'number') {
    return 'Unable to determine your level!';
  }
  if ((myPosition as any).level <= (targetUser.position as any).level) {
    return 'You do not have sufficient level to perform operations on this user!';
  }
  return null;
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
      const requiredPermission = permissionName || getRequiredPermission(req);
      if (!requiredPermission) {
        return res.status(403).json({ message: 'You do not have permission to perform this function!' });
      }
      if (!user.positionId) {
        return res.status(403).json({ message: 'User has no position!' });
      }
      const userPermissionIds = await getUserPermissionIds(user.positionId);
      const requiredPermissionId = await getPermissionIdByName(requiredPermission);
      if (!requiredPermissionId) {
        return res.status(403).json({ message: 'Permission does not exist!' });
      }
      if (!userPermissionIds.includes(requiredPermissionId)) {
        return res.status(403).json({ message: 'You do not have permission to perform this function!' });
      }
      if (
        ['update_user', 'delete_user'].includes(requiredPermission) &&
        req.params.id &&
        req.params.id !== user.id
      ) {
        const levelError = await checkLevel(user, req.params.id);
        if (levelError) {
          return res.status(requiredPermission === 'delete_user' ? 404 : 403).json({ message: levelError });
        }
      }
      return next();
    } catch (err) {
      return next(err);
    }
  };
};