import 'reflect-metadata'
import { CalculationService, ProductItem } from '../../src/AipluxerCalculator/calculationService'

describe('CalculationService', () => {
  let target: CalculationService
  beforeEach(() => {
    target = new CalculationService()
  })
  const mockCategoryItems = (code:string,Qty:number)=> 
    [{ code:code.substring(0,2), items: Array.from({ length: Qty }, (_, i) => `${code}${(i + 1).toString().padStart(2, '0')}`) }] 
  describe('calculateCategoriesFeeDetail', () => {
    it('一般方案，無超項(01類-2項)', async () => {
      //arrange
      const expected =  {
        "categoriesPriceDetail": [{
          "code": "01",
          "codeQty": 2,
          "excessFee": 200,
          "excessQty": 0,
          "excessTotalFee": 0,
          "fee": 0,
          "items":[
            new ProductItem('application_regulation_fee', 1, 2400),
            new ProductItem('application_basic_service_fee', 1, 2200),
            new ProductItem('application_advanced_service_fee', 0, 0),
            new ProductItem('excess_item_fee', 0, 0),
            new ProductItem('special_excess_item_fee', 0, 0)
            ],            
          "subTotal": 4600,  
        }],
        "excessFee": 0,
        "planFee": 4600,
        "subtotal": 4600,
        "total": 4600,
      }
      
      //act
      const result = await target.calculateCategoriesFeeDetail('basic', mockCategoryItems('01',2), false)
      //assert
      expect(result).toEqual(expected)
    })
    it('一般方案，有超項(08類-28項)', async () => {
      //arrange
      const expected =  {
        "categoriesPriceDetail": [{
          "code": "08",
          "codeQty": 28,
          "excessFee": 200,
          "excessQty": 8,
          "excessTotalFee": 1600,
          "fee": 0,
          "items":[
            new ProductItem('application_regulation_fee', 1, 2400),
            new ProductItem('application_basic_service_fee', 1, 2200),
            new ProductItem('application_advanced_service_fee', 0, 0),
            new ProductItem('excess_item_fee', 8, 200),
            new ProductItem('special_excess_item_fee', 0, 0)],
          "subTotal": 6200,  
        }],
        "excessFee": 1600,
        "planFee": 4600,
        "subtotal": 6200,
        "total": 6200,
      }
      //act
      const result = await target.calculateCategoriesFeeDetail('basic', mockCategoryItems('08',28), false)
      //assert
      expect(result).toEqual(expected)
    })
    
    it('進階方案，無超項(01類-2項)', async () => {
      //arrange
      const expected =  {
        "categoriesPriceDetail": [{
          "code": "01",
          "codeQty": 2,
          "excessFee": 200,
          "excessQty": 0,
          "excessTotalFee": 0,
          "fee": 0,
          "items":[
            new ProductItem('application_regulation_fee', 1, 2400),
            new ProductItem('application_basic_service_fee', 0, 0),
            new ProductItem('application_advanced_service_fee', 1, 7600),
            new ProductItem('excess_item_fee', 0, 0),
            new ProductItem('special_excess_item_fee', 0, 0)
            ],            
          "subTotal": 10000,  
        }],
        "excessFee": 0,
        "planFee": 10000,
        "subtotal": 10000,
        "total": 10000,
      }
      //act
      const result = await target.calculateCategoriesFeeDetail('advanced', mockCategoryItems('01',2), false)
      //assert
      expect(result).toEqual(expected)
    })

  })
})

describe('ProductItem', () => {
  it('ProductItem', () => {
    //arrange
    const expected = {
      name: 'application_basic_service_fee',
      quantity: 1,
      unitPrice: 100,
      totalPrice: 100
    };
    //act
    const target = new ProductItem('application_basic_service_fee', 1, 100)
    //assert
    expect(target).toEqual(expected)
})})
