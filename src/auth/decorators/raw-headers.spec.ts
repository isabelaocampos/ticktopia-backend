import { ExecutionContext } from '@nestjs/common';
import { RawHeaders } from './raw-headers.decorator';

describe('RawHeaders', () => {
  it('debe extraer los rawHeaders de la solicitud', () => {
    // Create a mock function for the header
    const mockFunction = jest.fn();
    
    // Mock de los headers que esperamos obtener
    const mockRawHeaders = [mockFunction];
    
    // Mock de getRequest
    const getRequestMock = jest.fn().mockReturnValue({
      rawHeaders: mockRawHeaders,
    });
    
    // Mock de switchToHttp
    const switchToHttpMock = jest.fn().mockReturnValue({
      getRequest: getRequestMock,
    });
    
    // Mock del contexto de ejecución con las funciones definidas
    const mockExecutionContext = {
      switchToHttp: switchToHttpMock,
      getHandler: jest.fn(),
      getClass: jest.fn(),
      getType: jest.fn(),
      getArgs: jest.fn(),
      getArgByIndex: jest.fn(),
      switchToRpc: jest.fn(),
      switchToWs: jest.fn(),
    } as unknown as ExecutionContext;
    
    // Ejecutamos el decorador directamente
    const result = RawHeaders(null, mockExecutionContext);
    
    // Verificamos que devuelva los headers correctos
    expect(result).toEqual(mockRawHeaders);
    expect(result[0]).toBeInstanceOf(Function);
    
    // Verificamos que se llamaron los métodos correctos
    expect(switchToHttpMock).toHaveBeenCalled();
    expect(getRequestMock).toHaveBeenCalled();
  });
});