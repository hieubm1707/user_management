import { Request, Response, NextFunction, RequestHandler } from 'express';
import { mapPermission } from '../config/map.config';
import { UserModel } from '../models';
import PositionModel from '../models/position.model';
import { QueryTypes } from 'sequelize';
import { AuthUser } from '../types';

function getRequiredPermission(req: Request): string | undefined {
  const key = `${req.method} ${req.baseUrl}${req.route?.path || ''}`;
  console.log('KEY:', key);
  return (mapPermission as Record<string, string>)[key];
}

export const checkPermission = (permissionName?: string): RequestHandler => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = req.auth as AuthUser;
      
      // Debug: Log ra req.auth
      console.log('=== PERMISSION MIDDLEWARE DEBUG ===');
      console.log('req.auth:', JSON.stringify(req.auth, null, 2));
      console.log('user.positionId:', user?.positionId);
      console.log('user.role:', user?.role);
      console.log('==================================');
      
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

      const permissions = await PositionModel.sequelize!.query(
        `SELECT permission_id FROM position_permissions WHERE position_id = :positionId`,
        { replacements: { positionId: user.positionId }, type: QueryTypes.SELECT }
      );
      const userPermissionIds = Array.isArray(permissions) ? permissions.map(p => (p as any).permission_id) : [];

      const permissionRows = await PositionModel.sequelize!.query(
        `SELECT id FROM permission WHERE name = :name`,
        { replacements: { name: requiredPermission }, type: QueryTypes.SELECT }
      );
      const permissionRow = Array.isArray(permissionRows) ? permissionRows[0] : undefined;
      if (!permissionRow) {
        return res.status(403).json({ message: 'Permission does not exist!' });
      }
      const requiredPermissionId = (permissionRow as any).id;

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