import * as bcrypt from 'bcryptjs';

export function passwordsAreEqual(options: { hashedPassword: string; plainPassword: string }): Promise<boolean> {
  return bcrypt.compare(options.plainPassword, options.hashedPassword);
}
