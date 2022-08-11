import { Calculator } from './calculator';

describe('Test for Calculator', () => {
  describe('Test for multiply', () => {
    it('should return a nine', () => {
      ///AAA
      // Arrange
      const calculator = new Calculator();
      // Act
      const rta = calculator.multiply(3, 3);
      // Assert
      expect(rta).toEqual(9);
    });
  });

  describe('Test for divide', () => {
    it('should return a some number', () => {
      const calculator = new Calculator();
      expect(calculator.divide(6, 3)).toEqual(2);
      expect(calculator.divide(5, 2)).toEqual(2.5);
    });

    it('should return a null if second parameter is 0', () => {
      const calculator = new Calculator();
      expect(calculator.divide(6, 0)).toBeNull();
    });
  });

  describe('Test for matchers', () => {
    it('test matchers', () => {
      let name = 'juanlu';
      let name2;

      expect(name).toBeDefined();
      expect(name2).toBeUndefined();

      expect(1 + 3 === 4).toBeTruthy();
      expect(1 + 1 === 3).toBeFalsy();

      expect(5).toBeLessThan(10);
      expect(20).toBeGreaterThan(10);

      expect('123456').toMatch(/123/);
      expect(['apples', 'oranges', 'pears']).toContain('oranges');
    });
  });
});
