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
    describe('一般方案', () => {
      it('無超項(01類 2 項)', async () => {
        //arrange
        const expected = {
          planFee: 4600,
          excessFee: 0,
          subtotal: 4600,
          total: 4600,
          detail: [{
              code: '01',
              codeQty: 2,
              excessQty: 0,
              excessFee: 200,
              planFee: 4600
            }]
        }
  
        //act
        const result = await target.handleAllPriceDetail('basic', mockCategoryItems('01',2), false)
        //assert
        expect(result).toEqual(expected)
      })
      it('有超項(01類 23 項，超 3 項', async () => {
        //arrange
        const expected = {
          planFee: 4600,
          excessFee: 600,
          subtotal: 5200,
          total: 5200,
          detail: [
            {
              code: '01',
              codeQty: 23,
              excessQty: 3,
              excessFee: 200,
              planFee: 4600
            }
          ] 
        }
    
        //act
        const result = await target.handleAllPriceDetail('basic', mockCategoryItems('01',23), false)
        //assert
        expect(result).toEqual(expected)
        })
      it('有超項(3519類 7 項，超 2 項)', async () => {
          //arrange
          const expected = {
            planFee: 4600,
            excessFee: 1000,
            subtotal: 5600,
            total: 5600,
            detail: [
              {
                code: '35',
                codeQty: 7,
                excessQty: 2,
                excessFee: 500,
                planFee: 4600
              }
            ] 
          }
      
          //act
          const result = await target.handleAllPriceDetail('basic', mockCategoryItems('3519',7), false)
          //assert
          expect(result).toEqual(expected)
      })
      it('無超項(01類 2 項)，有手續費', async () => {
        //arrange
        const expected = {
          planFee: 4600,
          excessFee: 0,
          subtotal: 4600,
          total: 4738,
          detail: [{
              code: '01',
              codeQty: 2,
              excessQty: 0,
              excessFee: 200,
              planFee: 4600
            }]
        }
  
        //act
        const result = await target.handleAllPriceDetail('basic', mockCategoryItems('01',2), true)
        //assert
        expect(result).toEqual(expected)
      })
    })
    describe('進階方案', () => {
      it('無超項(01類 2 項)', async () => {
        //arrange
        const expected = {
          planFee: 10000,
          excessFee: 0,
          subtotal: 10000,
          total: 10000,
          detail: [{
              code: '01',
              codeQty: 2,
              excessQty: 0,
              excessFee: 200,
              planFee: 10000
            }]
        }

        //act
        const result = await target.handleAllPriceDetail('advanced', mockCategoryItems('01',2), false)
        //assert
        expect(result).toEqual(expected)
      })
      it('有超項(3519類 7 項)', async () => {
        //arrange
        const expected = {
          planFee: 10000,
          excessFee: 1000,
          subtotal: 11000,
          total: 11000,
          detail: [{
              code: '35',
              codeQty: 7,
              excessQty: 2,
              excessFee: 500,
              planFee: 10000
            }]
        }

        //act
        const result = await target.handleAllPriceDetail('advanced', mockCategoryItems('3519',7), false)
        //assert
        expect(result).toEqual(expected)
      })
      it('無超項(3519類 4 項)', async () => {
        //arrange
        const expected = {
          planFee: 10000,
          excessFee: 0,
          subtotal: 10000,
          total: 10000,
          detail: [{
              code: '35',
              codeQty: 4,
              excessQty: 0,
              excessFee: 500,
              planFee: 10000
            }]
        }

        //act
        const result = await target.handleAllPriceDetail('advanced', mockCategoryItems('3519',4), false)
        //assert
        expect(result).toEqual(expected)
      })
    })
  })
})
