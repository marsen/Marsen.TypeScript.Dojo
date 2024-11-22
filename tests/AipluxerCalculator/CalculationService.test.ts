import 'reflect-metadata'
import { CalculationService } from '../../src/AipluxerCalculator/calculationService'
import { BASIC_FEE, FEE_RATE, GOVERNMENT_FEE } from '../../src/AipluxerCalculator/interface/calculationService'

describe('CalculationService', () => {
  let calculationService: CalculationService

  beforeEach(() => {
    calculationService = new CalculationService()
  })

  it('should calculate total price with fee correctly', () => {
    const totalPrice = 5000
    const expectedPrice = ((totalPrice * 1000) + (totalPrice * FEE_RATE)) / 1000

    expect(calculationService.calculateTotalPriceWithFee(totalPrice)).toBeCloseTo(expectedPrice)
  })

  it('should calculate categories fee detail for basic plan correctly', async () => {
    const planType = 'basic'
    const includedFee = true
    const categories = [
      {
        code: '19',
        items: ['190101001A', '190101001D', '190200021', '190200022B', '190300004', '190300038A', '190300041', '190300043', '190400001A', '190400002', '190400003', '190400005', '190400008', '190500002', '190500003', '190500010E', '190500012', '190500013', '190500015', '190500020', '190500021', '190500022', '190500024B']
      },
      {
        code: '25',
        items: ['250101001', '250101001A', '250101002A', '250101002B', '250300001B', '250300001C', '250300002A', '250300002G', '250300003D', '250300009', '250401003', '250401003C', '250401003D', '250500005', '250500005A', '250500005B', '250500006', '250600002', '250600004B', '250600006']
      },
      {
        code: '32',
        items: ['320100002', '320100004']
      },
      {
        code: '35',
        items: ['351800001', '351901001', '351902002', '351903002', '351903009', '351904001', '351905002', '351905004', '351906004', '351906005', '351906007']
      }
    ]

    const result = await calculationService.calculateCategoriesFeeDetail(planType, categories, includedFee)

    expect(result.planFee).toBe(GOVERNMENT_FEE + BASIC_FEE)
    expect(result.categoriesPriceDetail).toHaveLength(4)

    // categories 19
    expect(result.categoriesPriceDetail[0].code).toBe('19')
    expect(result.categoriesPriceDetail[0].codeQty).toBe(23)
    expect(result.categoriesPriceDetail[0].excessFee).toBe(200)
    expect(result.categoriesPriceDetail[0].excessQty).toBe(3)
    expect(result.categoriesPriceDetail[0].excessTotalFee).toBe(600)
    expect(result.categoriesPriceDetail[0].fee).toBe(156)
    expect(result.categoriesPriceDetail[0].items[0].name).toBe('application_regulation_fee')
    expect(result.categoriesPriceDetail[0].items[0].quantity).toBe(1)
    expect(result.categoriesPriceDetail[0].items[0].totalPrice).toBe(2400)
    expect(result.categoriesPriceDetail[0].items[0].unitPrice).toBe(2400)
    expect(result.categoriesPriceDetail[0].items[1].name).toBe('application_basic_service_fee')
    expect(result.categoriesPriceDetail[0].items[1].quantity).toBe(1)
    expect(result.categoriesPriceDetail[0].items[1].totalPrice).toBe(2200)
    expect(result.categoriesPriceDetail[0].items[1].unitPrice).toBe(2200)
    expect(result.categoriesPriceDetail[0].items[2].name).toBe('application_advanced_service_fee')
    expect(result.categoriesPriceDetail[0].items[2].quantity).toBe(0)
    expect(result.categoriesPriceDetail[0].items[2].totalPrice).toBe(0)
    expect(result.categoriesPriceDetail[0].items[2].unitPrice).toBe(0)
    expect(result.categoriesPriceDetail[0].items[3].name).toBe('excess_item_fee')
    expect(result.categoriesPriceDetail[0].items[3].quantity).toBe(3)
    expect(result.categoriesPriceDetail[0].items[3].totalPrice).toBe(600)
    expect(result.categoriesPriceDetail[0].items[3].unitPrice).toBe(200)
    expect(result.categoriesPriceDetail[0].items[4].name).toBe('special_excess_item_fee')
    expect(result.categoriesPriceDetail[0].items[4].quantity).toBe(0)
    expect(result.categoriesPriceDetail[0].items[4].totalPrice).toBe(0)
    expect(result.categoriesPriceDetail[0].items[4].unitPrice).toBe(0)

    // categories 25
    expect(result.categoriesPriceDetail[1].code).toBe('25')
    expect(result.categoriesPriceDetail[1].codeQty).toBe(20)
    expect(result.categoriesPriceDetail[1].excessFee).toBe(200)
    expect(result.categoriesPriceDetail[1].excessQty).toBe(0)
    expect(result.categoriesPriceDetail[1].excessTotalFee).toBe(0)
    expect(result.categoriesPriceDetail[1].fee).toBe(138)
    expect(result.categoriesPriceDetail[1].items[0].name).toBe('application_regulation_fee')
    expect(result.categoriesPriceDetail[1].items[0].quantity).toBe(1)
    expect(result.categoriesPriceDetail[1].items[0].totalPrice).toBe(2400)
    expect(result.categoriesPriceDetail[1].items[0].unitPrice).toBe(2400)
    expect(result.categoriesPriceDetail[1].items[1].name).toBe('application_basic_service_fee')
    expect(result.categoriesPriceDetail[1].items[1].quantity).toBe(1)
    expect(result.categoriesPriceDetail[1].items[1].totalPrice).toBe(2200)
    expect(result.categoriesPriceDetail[1].items[1].unitPrice).toBe(2200)
    expect(result.categoriesPriceDetail[1].items[2].name).toBe('application_advanced_service_fee')
    expect(result.categoriesPriceDetail[1].items[2].quantity).toBe(0)
    expect(result.categoriesPriceDetail[1].items[2].totalPrice).toBe(0)
    expect(result.categoriesPriceDetail[1].items[2].unitPrice).toBe(0)
    expect(result.categoriesPriceDetail[1].items[3].name).toBe('excess_item_fee')
    expect(result.categoriesPriceDetail[1].items[3].quantity).toBe(0)
    expect(result.categoriesPriceDetail[1].items[3].totalPrice).toBe(0)
    expect(result.categoriesPriceDetail[1].items[3].unitPrice).toBe(0)
    expect(result.categoriesPriceDetail[1].items[4].name).toBe('special_excess_item_fee')
    expect(result.categoriesPriceDetail[1].items[4].quantity).toBe(0)
    expect(result.categoriesPriceDetail[1].items[4].totalPrice).toBe(0)
    expect(result.categoriesPriceDetail[1].items[4].unitPrice).toBe(0)

    // categories 32
    expect(result.categoriesPriceDetail[2].code).toBe('32')
    expect(result.categoriesPriceDetail[2].codeQty).toBe(2)
    expect(result.categoriesPriceDetail[2].excessFee).toBe(200)
    expect(result.categoriesPriceDetail[2].excessQty).toBe(0)
    expect(result.categoriesPriceDetail[2].excessTotalFee).toBe(0)
    expect(result.categoriesPriceDetail[2].fee).toBe(138)
    expect(result.categoriesPriceDetail[2].items[0].name).toBe('application_regulation_fee')
    expect(result.categoriesPriceDetail[2].items[0].quantity).toBe(1)
    expect(result.categoriesPriceDetail[2].items[0].totalPrice).toBe(2400)
    expect(result.categoriesPriceDetail[2].items[0].unitPrice).toBe(2400)
    expect(result.categoriesPriceDetail[2].items[1].name).toBe('application_basic_service_fee')
    expect(result.categoriesPriceDetail[2].items[1].quantity).toBe(1)
    expect(result.categoriesPriceDetail[2].items[1].totalPrice).toBe(2200)
    expect(result.categoriesPriceDetail[2].items[1].unitPrice).toBe(2200)
    expect(result.categoriesPriceDetail[2].items[2].name).toBe('application_advanced_service_fee')
    expect(result.categoriesPriceDetail[2].items[2].quantity).toBe(0)
    expect(result.categoriesPriceDetail[2].items[2].totalPrice).toBe(0)
    expect(result.categoriesPriceDetail[2].items[2].unitPrice).toBe(0)
    expect(result.categoriesPriceDetail[2].items[3].name).toBe('excess_item_fee')
    expect(result.categoriesPriceDetail[2].items[3].quantity).toBe(0)
    expect(result.categoriesPriceDetail[2].items[3].totalPrice).toBe(0)
    expect(result.categoriesPriceDetail[2].items[3].unitPrice).toBe(0)
    expect(result.categoriesPriceDetail[2].items[4].name).toBe('special_excess_item_fee')
    expect(result.categoriesPriceDetail[2].items[4].quantity).toBe(0)
    expect(result.categoriesPriceDetail[2].items[4].totalPrice).toBe(0)
    expect(result.categoriesPriceDetail[2].items[4].unitPrice).toBe(0)

    // categories 35
    expect(result.categoriesPriceDetail[3].code).toBe('35')
    expect(result.categoriesPriceDetail[3].codeQty).toBe(11)
    expect(result.categoriesPriceDetail[3].excessFee).toBe(500)
    expect(result.categoriesPriceDetail[3].excessQty).toBe(5)
    expect(result.categoriesPriceDetail[3].excessTotalFee).toBe(2500)
    expect(result.categoriesPriceDetail[3].fee).toBe(213)
    expect(result.categoriesPriceDetail[3].items[0].name).toBe('application_regulation_fee')
    expect(result.categoriesPriceDetail[3].items[0].quantity).toBe(1)
    expect(result.categoriesPriceDetail[3].items[0].totalPrice).toBe(2400)
    expect(result.categoriesPriceDetail[3].items[0].unitPrice).toBe(2400)
    expect(result.categoriesPriceDetail[3].items[1].name).toBe('application_basic_service_fee')
    expect(result.categoriesPriceDetail[3].items[1].quantity).toBe(1)
    expect(result.categoriesPriceDetail[3].items[1].totalPrice).toBe(2200)
    expect(result.categoriesPriceDetail[3].items[1].unitPrice).toBe(2200)
    expect(result.categoriesPriceDetail[3].items[2].name).toBe('application_advanced_service_fee')
    expect(result.categoriesPriceDetail[3].items[2].quantity).toBe(0)
    expect(result.categoriesPriceDetail[3].items[2].totalPrice).toBe(0)
    expect(result.categoriesPriceDetail[3].items[2].unitPrice).toBe(0)
    expect(result.categoriesPriceDetail[3].items[3].name).toBe('excess_item_fee')
    expect(result.categoriesPriceDetail[3].items[3].quantity).toBe(0)
    expect(result.categoriesPriceDetail[3].items[3].totalPrice).toBe(0)
    expect(result.categoriesPriceDetail[3].items[3].unitPrice).toBe(0)
    expect(result.categoriesPriceDetail[3].items[4].name).toBe('special_excess_item_fee')
    expect(result.categoriesPriceDetail[3].items[4].quantity).toBe(5)
    expect(result.categoriesPriceDetail[3].items[4].totalPrice).toBe(2500)
    expect(result.categoriesPriceDetail[3].items[4].unitPrice).toBe(500)
  })
})
