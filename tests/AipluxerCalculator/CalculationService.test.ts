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


    const mockCategoryItems = (code:string,Qty:number)=> 
      [{ code:code.substring(0,2), items: Array.from({ length: Qty }, (_, i) => `${code}${(i + 1).toString().padStart(2, '0')}`) }]
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
    const result = await target.handleAllPriceDetail('basic', mockCategoryItems('01',2), false)
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
      const result = await target.handleAllPriceDetail('basic', mockCategoryItems('01',21), false)
      //assert
      expect(result).toEqual(expected)
      })
      it('一般方案，有超項(3519類 6 項)', async () => {
        //arrange
        const expected = {
          planFee: 4600,
          excessFee: 500,
          subtotal: 5100,
          total: 5100,
          detail: [
            {
              code: '35',
              codeQty: 6,
              excessQty: 1,
              excessFee: 500,
              planFee: 4600
            }
          ] 
        }
    
        //act
        const result = await target.handleAllPriceDetail('basic', mockCategoryItems('3519',6), false)
        //assert
        expect(result).toEqual(expected)
        })
  })
})
