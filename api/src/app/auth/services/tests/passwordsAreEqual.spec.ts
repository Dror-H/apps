import { passwordsAreEqual } from '../passwordsAreEqual';

describe('AuthService test suite', () => {
  it('passwordsAreEqual - should return true', async () => {
    // Arrange
    const plainPassword = 'strongpassword';
    const hashedPassword = '$2a$10$FVlq2aPr8ELVoiefO3dbYuadle0nOxSTTgr33dxHGXnNov/4b0SIa';
    // Act
    const result = await passwordsAreEqual({ hashedPassword, plainPassword });
    // Assert
    expect(result).toEqual(true);
  });

  it('passwordsAreEqual - should return false', async () => {
    // Arrange
    const plainPassword = 'strongpassword123';
    const hashedPassword = '$2a$10$FVlq2aPr8ELVoiefO3dbYuadle0nOxSTTgr33dxHGXnNov/4b0SIa';
    // Act
    const result = await passwordsAreEqual({ hashedPassword, plainPassword });
    // Assert
    expect(result).toEqual(false);
  });
});
