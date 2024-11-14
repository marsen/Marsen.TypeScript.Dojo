import { expect } from 'chai';
import C from '../../src/Calculator/Calculator';

describe('calculate', function() {
  it('add', function() {
    const result = C.Sum(5, 2);
    expect(result).equal(7);
  });

  it('substract', function() {
    const result = C.Difference(5, 2);
    expect(result).equal(3);
  });
});