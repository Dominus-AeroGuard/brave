import { ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtAuthGuard } from '../auth.guard';
import { IS_PUBLIC_KEY } from '../auth.decorators';

describe('JwtAuthGuard', () => {
  let jwtAuthGuard: JwtAuthGuard;
  let reflector: Reflector;
  let mockExecutionContext: Partial<ExecutionContext>;

  beforeEach(() => {
    reflector = new Reflector();
    jwtAuthGuard = new JwtAuthGuard(reflector);

    mockExecutionContext = {
      getClass: jest.fn(),
      getHandler: jest.fn(),
    };
  });

  it('should allow access to public routes', () => {
    jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(true);

    const canActivate = jwtAuthGuard.canActivate(
      mockExecutionContext as ExecutionContext,
    );

    expect(canActivate).toBe(true);
    expect(reflector.getAllAndOverride).toHaveBeenCalledWith(IS_PUBLIC_KEY, [
      undefined,
      undefined,
    ]);
  });
});
