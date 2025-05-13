/* // raw-headers.decorator.spec.ts
import { ExecutionContext } from '@nestjs/common';
import { RawHeaders } from './raw-headers.decorator';

describe('RawHeaders Decorator', () => {
  const rawHeadersMock = ['Host', 'localhost:3000', 'User-Agent', 'Jest'];

  const createMockContext = (req: any): ExecutionContext => {
    return {
      switchToHttp: () => ({
        getRequest: () => req,
      }),
    } as unknown as ExecutionContext;
  };

  it('should return rawHeaders from the request object', () => {
    const mockContext = createMockContext({ rawHeaders: rawHeadersMock });

    const result = RawHeaders(undefined, mockContext); // simulate how Nest would call it
    expect(result).toEqual(rawHeadersMock);
  });

  it('should return undefined if rawHeaders are missing', () => {
    const mockContext = createMockContext({});
    const result = RawHeaders(undefined, mockContext);
    expect(result).toBeUndefined();
  });
});
 */