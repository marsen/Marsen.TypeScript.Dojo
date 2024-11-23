import 'reflect-metadata'
import { CalculationServiceDomain } from '../../src/AipluxerCalculator/calculationServiceDomain'
import { CalculationService } from '../../src/AipluxerCalculator/calculationService'

describe('CalculationServiceDomain', () => {
  let target: CalculationServiceDomain

  beforeEach(() => {
    const service = new CalculationService()
    target = new CalculationServiceDomain(service)
  })
  
  describe('handleAllPriceDetail', () => {

    it('一般方案，無超項(01類 2 項)', async () => {
    //arrange
    const expected = {
      planFee: 4600,
      excessFee: 0,
      subtotal: 4600,
      total: 4600,
      detail: [
        {
          code: '01',
          codeQty: 2,
          excessQty: 0,
          excessFee: 200,
          planFee: 4600
        }
      ] 
    }

    //act
    const result = await target.handleAllPriceDetail('basic', [{ code: '01', items: ['0101', '0102'] }], false)
    //assert
    expect(result).toEqual(expected)
    })
    it('一般方案，有超項(01類 21 項)', async () => {
      //arrange
      const expected = {
        planFee: 4600,
        excessFee: 200,
        subtotal: 4800,
        total: 4800,
        detail: [
          {
            code: '01',
            codeQty: 21,
            excessQty: 1,
            excessFee: 200,
            planFee: 4600
          }
        ] 
      }
  
      //act
      const result = await target.handleAllPriceDetail('basic', [{ code: '01', items: [
        '0101', '0102','0103','0104','0105','0106','0107','0108','0109','0110',
        '0111','0112','0113','0114','0115','0116','0117','0118','0119','0120','0121'
      ] }], false)
      //assert
      expect(result).toEqual(expected)
      })
  })
})
