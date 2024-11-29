import 'reflect-metadata'
import { CalculationDomain } from '../../src/AipluxerCalculator/calculationDomain'
import { CalculationService } from '../../src/AipluxerCalculator/calculationService'

describe('CalculationDomain', () => {
  let target: CalculationDomain

  beforeEach(() => {
    const service = new CalculationService()
    target = new CalculationDomain(service)
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

      it('無超項(01~05 類各 2 項)', async () => {
        //arrange
        const mock  = mockCategoryItems('01',2).
        concat(mockCategoryItems('02',2)).
        concat(mockCategoryItems('03',2)).
        concat(mockCategoryItems('04',2)).
        concat(mockCategoryItems('05',2))
        const expected = {
          planFee: 4600,
          excessFee: 0,
          subtotal: 23000,
          total: 23000,
          detail: [{
              code: '01',
              codeQty: 2,
              excessQty: 0,
              excessFee: 200,
              planFee: 4600
            },{
              code: '02',
              codeQty: 2,
              excessQty: 0,
              excessFee: 200,
              planFee: 4600
            },{
              code: '03',
              codeQty: 2,
              excessQty: 0,
              excessFee: 200,
              planFee: 4600
            },{
              code: '04',
              codeQty: 2,
              excessQty: 0,
              excessFee: 200,
              planFee: 4600
            },{
              code: '05',
              codeQty: 2,
              excessQty: 0,
              excessFee: 200,
              planFee: 4600
            }]
        }
  
        //act
        const result = await target.handleAllPriceDetail('basic', mock, false)
        //assert
        expect(result).toEqual(expected)
      })
      it('無超項(06~10 類各 2 項)', async () => {
        //arrange
        const mock  = mockCategoryItems('06',2).
        concat(mockCategoryItems('07',2)).
        concat(mockCategoryItems('08',2)).
        concat(mockCategoryItems('09',2)).
        concat(mockCategoryItems('10',2))
        const expected = {
          planFee: 4600,
          excessFee: 0,
          subtotal: 23000,
          total: 23000,
          detail: [{
              code: '06',
              codeQty: 2,
              excessQty: 0,
              excessFee: 200,
              planFee: 4600
            },{
              code: '07',
              codeQty: 2,
              excessQty: 0,
              excessFee: 200,
              planFee: 4600
            },{
              code: '08',
              codeQty: 2,
              excessQty: 0,
              excessFee: 200,
              planFee: 4600
            },{
              code: '09',
              codeQty: 2,
              excessQty: 0,
              excessFee: 200,
              planFee: 4600
            },{
              code: '10',
              codeQty: 2,
              excessQty: 0,
              excessFee: 200,
              planFee: 4600
            }]
        }
  
        //act
        const result = await target.handleAllPriceDetail('basic', mock, false)
        //assert
        expect(result).toEqual(expected)
      })
      it('無超項(11~15 類各 2 項)', async () => {
        //arrange
        const mock  = mockCategoryItems('11',2).
        concat(mockCategoryItems('12',2)).
        concat(mockCategoryItems('13',2)).
        concat(mockCategoryItems('14',2)).
        concat(mockCategoryItems('15',2))
        const expected = {
          planFee: 4600,
          excessFee: 0,
          subtotal: 23000,
          total: 23000,
          detail: [{ code: '11', codeQty: 2, excessQty: 0, excessFee: 200, planFee: 4600 },
            {code: '12', codeQty: 2, excessQty: 0, excessFee: 200, planFee: 4600 },
            {code: '13', codeQty: 2, excessQty: 0, excessFee: 200, planFee: 4600 },
            {code: '14', codeQty: 2, excessQty: 0, excessFee: 200, planFee: 4600 },
            {code: '15', codeQty: 2, excessQty: 0, excessFee: 200, planFee: 4600 }]
        }
  
        //act
        const result = await target.handleAllPriceDetail('basic', mock, false)
        //assert
        expect(result).toEqual(expected)
      })
      it('無超項(16~20 類各 2 項)', async () => {
        //arrange
        const mock  = mockCategoryItems('16',2).
        concat(mockCategoryItems('17',2)).
        concat(mockCategoryItems('18',2)).
        concat(mockCategoryItems('19',2)).
        concat(mockCategoryItems('20',2))
        const expected = {
          planFee: 4600,
          excessFee: 0,
          subtotal: 23000,
          total: 23000,
          detail: [{ code: '16', codeQty: 2, excessQty: 0, excessFee: 200, planFee: 4600 },
            {code: '17', codeQty: 2, excessQty: 0, excessFee: 200, planFee: 4600 },
            {code: '18', codeQty: 2, excessQty: 0, excessFee: 200, planFee: 4600 },
            {code: '19', codeQty: 2, excessQty: 0, excessFee: 200, planFee: 4600 },
            {code: '20', codeQty: 2, excessQty: 0, excessFee: 200, planFee: 4600 }]
        }
        //act
        const result = await target.handleAllPriceDetail('basic', mock, false)
        //assert
        expect(result).toEqual(expected)
      })
      it('無超項(21~25 類各 2 項)', async () => {
        //arrange
        const mock  = mockCategoryItems('21',2).
        concat(mockCategoryItems('22',2)).
        concat(mockCategoryItems('23',2)).
        concat(mockCategoryItems('24',2)).
        concat(mockCategoryItems('25',2))
        const expected = {
          planFee: 4600,
          excessFee: 0,
          subtotal: 23000,
          total: 23000,
          detail: [{ code: '21', codeQty: 2, excessQty: 0, excessFee: 200, planFee: 4600 },
            {code: '22', codeQty: 2, excessQty: 0, excessFee: 200, planFee: 4600 },
            {code: '23', codeQty: 2, excessQty: 0, excessFee: 200, planFee: 4600 },
            {code: '24', codeQty: 2, excessQty: 0, excessFee: 200, planFee: 4600 },
            {code: '25', codeQty: 2, excessQty: 0, excessFee: 200, planFee: 4600 }]
        }
        //act
        const result = await target.handleAllPriceDetail('basic', mock, false)
        //assert
        expect(result).toEqual(expected)
      })
      it('無超項(26~34 類各 2 項)', async () => {
        //arrange
        const mock  = mockCategoryItems('26',2).
          concat(mockCategoryItems('27',2)).
          concat(mockCategoryItems('28',2)).
          concat(mockCategoryItems('29',2)).
          concat(mockCategoryItems('30',2)).
          concat(mockCategoryItems('31',2)).
          concat(mockCategoryItems('32',2)).
          concat(mockCategoryItems('33',2)).
          concat(mockCategoryItems('34',2))

        const expected = {
          planFee: 4600,
          excessFee: 0,
          subtotal: 41400,
          total: 41400,
          detail: [{ code: '26', codeQty: 2, excessQty: 0, excessFee: 200, planFee: 4600 },
            {code: '27', codeQty: 2, excessQty: 0, excessFee: 200, planFee: 4600 },
            {code: '28', codeQty: 2, excessQty: 0, excessFee: 200, planFee: 4600 },
            {code: '29', codeQty: 2, excessQty: 0, excessFee: 200, planFee: 4600 },
            {code: '30', codeQty: 2, excessQty: 0, excessFee: 200, planFee: 4600 },
            {code: '31', codeQty: 2, excessQty: 0, excessFee: 200, planFee: 4600 },
            {code: '32', codeQty: 2, excessQty: 0, excessFee: 200, planFee: 4600 },
            {code: '33', codeQty: 2, excessQty: 0, excessFee: 200, planFee: 4600 },
            {code: '34', codeQty: 2, excessQty: 0, excessFee: 200, planFee: 4600 }]
        }
        //act
        const result = await target.handleAllPriceDetail('basic', mock, false)
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
        
      it('無超項(39類 100 項)', async () => {
          //arrange
          const expected = {
            planFee: 4600,
            excessFee: 0,
            subtotal: 4600,
            total: 4600,
            detail: [{
                code: '39',
                codeQty: 100,
                excessQty: 0,
                excessFee: 0,
                planFee: 4600
              }]
          }
      
          //act
          const result = await target.handleAllPriceDetail('basic', mockCategoryItems('39',100), false)
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

      it('有超項(3519類 7 項，超 2 項，02類 24 項，超 4 項)', async () => {
        //arrange
        const expected = {
          planFee: 4600,
          excessFee: 1800,
          subtotal: 11000,
          total: 11000,
          detail: [
            {
              code: '35',
              codeQty: 7,
              excessQty: 2,
              excessFee: 500,
              planFee: 4600
            },
            {
              code: '02',
              codeQty: 24,
              excessQty: 4,
              excessFee: 200,
              planFee: 4600
            }
          ] 
        }
    
        //act
        const result = await target.handleAllPriceDetail('basic', mockCategoryItems('3519',7).concat(mockCategoryItems('02',24)), false)
        console.log(result)
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
