import 'reflect-metadata'
import { CalculationService } from '../../src/AipluxerCalculator/calculationService'

describe('CalculationService', () => {
  let target: CalculationService
  beforeEach(() => {
    target = new CalculationService()
  })
  
  describe('createItemDetail', () => {
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
          "items":[{
              "name": "application_regulation_fee",
              "quantity": 1,
              "totalPrice": 2400,
              "unitPrice": 2400,
            },{
              "name": "application_basic_service_fee",
              "quantity": 1,
              "totalPrice": 2200,
              "unitPrice": 2200,
            },{
              "name": "application_advanced_service_fee",
              "quantity": 0,
              "totalPrice": 0,
              "unitPrice": 0,
            },{
              "name": "excess_item_fee",
              "quantity": 0,
              "totalPrice": 0,
              "unitPrice": 0,
            },{
              "name": "special_excess_item_fee",
              "quantity": 0,
              "totalPrice": 0,
              "unitPrice": 0,
            }],            
          "subTotal": 4600,  
        }],
        "excessFee": 0,
        "planFee": 4600,
        "subtotal": 4600,
        "total": 4600,
      }
      //act
      const result = await target.calculateCategoriesFeeDetail('basic', [{ code: '01', items: ['0101', '0102'] }], false)
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
          "items":[{
              "name": "application_regulation_fee",
              "quantity": 1,
              "totalPrice": 2400,
              "unitPrice": 2400,
            },{
              "name": "application_basic_service_fee",
              "quantity": 0,
              "totalPrice": 0,
              "unitPrice": 0,
            },{
              "name": "application_advanced_service_fee",
              "quantity": 1,
              "totalPrice": 7600,
              "unitPrice": 7600,
            },{
              "name": "excess_item_fee",
              "quantity": 0,
              "totalPrice": 0,
              "unitPrice": 0,
            },{
              "name": "special_excess_item_fee",
              "quantity": 0,
              "totalPrice": 0,
              "unitPrice": 0,
            }],            
          "subTotal": 10000,  
        }],
        "excessFee": 0,
        "planFee": 10000,
        "subtotal": 10000,
        "total": 10000,
      }
      //act
      const result = await target.calculateCategoriesFeeDetail('advanced', [{ code: '01', items: ['0101', '0102'] }], false)
      //assert
      expect(result).toMatchObject(expected)
    })

  })
})
