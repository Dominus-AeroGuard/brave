import { RolesGuard } from '../roles.guard';
import { Reflector } from '@nestjs/core';
import { ForbiddenException } from '@nestjs/common';

function createMockContext(requestData: Partial<{ user: any }>) {
  return {
    switchToHttp: jest.fn().mockReturnValue({
      getRequest: jest.fn().mockReturnValue({
        ...requestData,
      }),
    }),
    getHandler: jest.fn().mockReturnValue(jest.fn()),
  } as any;
}

describe('RolesGuard', () => {
  let guard: RolesGuard;
  let reflectorMock: Partial<Reflector>;

  beforeEach(() => {
    reflectorMock = {
      get: jest.fn(),
    };
    guard = new RolesGuard(reflectorMock as Reflector);
  });

  it('should allow access when no roles or permissions are required', () => {
    const contextMock = createMockContext({
      user: { roles: [], permissions: [] },
    });
    (reflectorMock.get as jest.Mock).mockReturnValue(null);

    expect(guard.canActivate(contextMock)).toBe(true);
  });

  it('should allow access when user has the required role', () => {
    const contextMock = createMockContext({
      user: { roles: ['admin'], permissions: [] },
    });
    (reflectorMock.get as jest.Mock).mockImplementation((key) => {
      if (key === 'roles') return ['admin'];
    });

    expect(guard.canActivate(contextMock)).toBe(true);
  });

  it('should deny access when user does not the required role or permission', () => {
    const contextMock = createMockContext({
      user: { roles: ['user'], permissions: [] },
    });
    (reflectorMock.get as jest.Mock).mockImplementation((key) => {
      if (key === 'roles') return ['admin'];
    });

    expect(() => guard.canActivate(contextMock)).toThrow(ForbiddenException);
  });

  it('should allow access when user has required permission', () => {
    const contextMock = createMockContext({
      user: { roles: [], permissions: ['resource:read'] },
    });
    (reflectorMock.get as jest.Mock).mockImplementation((key) => {
      if (key === 'permissions') return ['resource:read'];
    });

    expect(guard.canActivate(contextMock)).toBe(true);
  });

  it('should deny acess when user does not the required pemission', () => {
    const contextMock = createMockContext({
      user: { roles: [], permissions: [] },
    });
    (reflectorMock.get as jest.Mock).mockImplementation((key) => {
      if (key === 'permissions') return ['resource:read'];
    });

    expect(() => guard.canActivate(contextMock)).toThrow(ForbiddenException);
  });

  it('should throw an exception when user is not authenticated', () => {
    const contextMock = createMockContext({ user: null });
    (reflectorMock.get as jest.Mock).mockReturnValue(['admin']);

    expect(() => guard.canActivate(contextMock)).toThrow(ForbiddenException);
  });
});
