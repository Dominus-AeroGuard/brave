import { JwtStrategy } from '../jwt.strategy';

describe('JwtStrategy', () => {
  let jwtStrategy: JwtStrategy;

  beforeEach(() => {
    process.env.JWT_SECRET = 'test-secret';
    jwtStrategy = new JwtStrategy();
  });

  describe('validate', () => {
    it('should return the correct payload structure', async () => {
      const mockPayload = {
        sub: 1,
        orgId: 100,
        organizations: [{ id: 100, name: 'Test Org' }],
        roles: ['admin'],
        permissions: ['read:resource'],
      };

      const result = await jwtStrategy.validate(mockPayload);

      expect(result).toEqual({
        userId: 1,
        organizationId: 100,
        organizations: [{ id: 100, name: 'Test Org' }],
        roles: ['admin'],
        permissions: ['read:resource'],
      });
    });
  });
});
