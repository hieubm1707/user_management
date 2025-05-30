import { Request, Response } from 'express';
import { Container } from 'typedi';
import i18next from 'i18next';
import { UserModel } from '../../../models';
import { BadRequest } from 'http-errors';

export async function changePassword(req: Request, res: Response) {
  const i18n = Container.get<typeof i18next>('i18n');
  const { email, oldPassword, newPassword, confirmPassword } = req.body;

  // Validate required fields
  if (!email || !oldPassword || !newPassword || !confirmPassword) {
    throw new BadRequest(i18n.t('errors:missingFields'));
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    throw new BadRequest(i18n.t('errors:invalidEmail'));
  }

  // Validate password length
  if (newPassword.length < 8) {
    throw new BadRequest(i18n.t('errors:passwordTooShort'));
  }

  // Validate new password and confirm password match
  if (newPassword !== confirmPassword) {
    throw new BadRequest(i18n.t('errors:passwordsDoNotMatch'));
  }

  // Find user by email (always include password)
  const user = await UserModel.findOne({
    where: { email },
    attributes: { include: ['password'] },
  });

  if (!user) {
    throw new BadRequest(i18n.t('errors:userNotFound'));
  }

  // Verify old password
  const isPasswordValid = await user.comparePassword(oldPassword);
  if (!isPasswordValid) {
    throw new BadRequest(i18n.t('errors:invalidPassword'));
  }

  // Update password
  user.password = newPassword;
  await user.save();

  return res.json({
    message: i18n.t('success:passwordChanged'),
  });
} 