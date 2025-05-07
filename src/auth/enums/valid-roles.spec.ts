import { ValidRoles } from "./valid-roles.enum";

describe('Valid roles Enum', () => {
    it('should have correct values', () => {
      expect(ValidRoles.admin).toBe('admin');
      expect(ValidRoles.superUser).toBe('event-manager');
      expect(ValidRoles.teacher).toBe('client');
    });
  
    it('should contain all expected values', () => {
      const keyToHave = ['admin', 'event-manager', 'client'];
  
      expect(Object.values(ValidRoles)).toEqual(
        expect.arrayContaining(keyToHave),
      );
    });
  });