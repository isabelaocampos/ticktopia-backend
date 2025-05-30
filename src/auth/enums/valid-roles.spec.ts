import { ValidRoles } from "./valid-roles.enum";

describe('Valid roles Enum', () => {
    it('should have correct values', () => {
      expect(ValidRoles.admin).toBe('admin');
      expect(ValidRoles.eventManager).toBe('event-manager');
      expect(ValidRoles.client).toBe('client');
    });
  
    it('should contain all expected values', () => {
      const keyToHave = ['admin', 'event-manager', 'client'];
  
      expect(Object.values(ValidRoles)).toEqual(
        expect.arrayContaining(keyToHave),
      );
    });
  });