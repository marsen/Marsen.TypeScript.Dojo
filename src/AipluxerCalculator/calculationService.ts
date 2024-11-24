import { injectable } from 'inversify'
import { type ICalculationService, type CategoriesPriceDetail, FEE_RATE, ADDITIONAL_SERVICE_FEE_01_TO_34, ADDITIONAL_SERVICE_FEE_35_3519, GOVERNMENT_FEE, type PLAN_TYPES, ADVANCED_FEE, BASIC_FEE, type ItemsDetail, PRODUCT_NAMES, type totalPriceDetail } from './interface/calculationService'
import { Category } from './interface/calculationDomain'

@injectable()
export class CalculationService implements ICalculationService {
  /**
   * 建立單個項目細節
   * @param name - 項目名稱
   * @param quantity - 數量
   * @param unitPrice - 單位金額
   * @param totalPrice - 單位總金額
   * @returns 項目細節
   */
  private createItemDetail (name: typeof PRODUCT_NAMES[number], quantity: number, unitPrice: number, totalPrice: number): ItemsDetail {
    return { name, quantity, unitPrice, totalPrice }
  }

  public calculateTotalPriceWithFee (TotalPrice: number): number {
    return ((TotalPrice * 1000) + (TotalPrice * FEE_RATE)) / 1000
  }

  async calculateCategoriesFeeDetail (planType: typeof PLAN_TYPES[number], categories: Category[], includedFee: boolean): Promise<totalPriceDetail> {
    const servicesTypeFee = planType === 'advanced' ? ADVANCED_FEE : BASIC_FEE
    const planFee = GOVERNMENT_FEE + servicesTypeFee
    // 計算個類別明細
    const categoriesPriceDetail: CategoriesPriceDetail[] = categories.map(category => {
      const { code, items } = category
      const codeQty = items.length
      let excessQty = 0
      let excessFee = 0
      let excessTotalFee = 0

      if (code >= '01' && code <= '34') {
        excessQty = codeQty > 20 ? codeQty - 20 : 0
        excessFee = ADDITIONAL_SERVICE_FEE_01_TO_34
        excessTotalFee = excessQty * ADDITIONAL_SERVICE_FEE_01_TO_34
      } else if (code === '35') {
        const filteredItems = items.filter(item => item.startsWith('3519'))
        const filteredQty = filteredItems.length
        excessQty = filteredQty > 5 ? filteredQty - 5 : 0
        excessFee = ADDITIONAL_SERVICE_FEE_35_3519
        excessTotalFee = excessQty * ADDITIONAL_SERVICE_FEE_35_3519
      }

      const includedExcessFee = excessTotalFee + planFee
      const subTotal = includedFee ? this.calculateTotalPriceWithFee(includedExcessFee) : includedExcessFee
      const fee = subTotal - includedExcessFee

      const itemsDetail: ItemsDetail[] = [
        this.createItemDetail(PRODUCT_NAMES[0], 1, GOVERNMENT_FEE, GOVERNMENT_FEE),
        this.createItemDetail(PRODUCT_NAMES[1], planType === 'basic' ? 1 : 0, planType === 'basic' ? BASIC_FEE : 0, planType === 'basic' ? BASIC_FEE : 0),
        this.createItemDetail(PRODUCT_NAMES[2], planType === 'advanced' ? 1 : 0, planType === 'advanced' ? ADVANCED_FEE : 0, planType === 'advanced' ? ADVANCED_FEE : 0),
        this.createItemDetail(PRODUCT_NAMES[3], code >= '01' && code <= '34' ? excessQty : 0, code >= '01' && code <= '34' && excessQty !== 0 ? ADDITIONAL_SERVICE_FEE_01_TO_34 : 0, code >= '01' && code <= '34' ? excessTotalFee : 0),
        this.createItemDetail(PRODUCT_NAMES[4], code === '35' && items.some(item => item.startsWith('3519')) ? excessQty : 0, code === '35' && items.some(item => item.startsWith('3519')) && excessQty !== 0 ? ADDITIONAL_SERVICE_FEE_35_3519 : 0, code === '35' && items.some(item => item.startsWith('3519')) ? excessTotalFee : 0)
      ]
      return { code, codeQty, excessTotalFee, fee: Math.ceil(fee), subTotal: Math.ceil(subTotal), items: itemsDetail, excessFee, excessQty }
    })

    const totalExcessFee = categoriesPriceDetail.reduce((acc, category) => acc + category.excessTotalFee, 0)
    const subtotal = categoriesPriceDetail.reduce((acc, category) => acc + planFee + category.excessTotalFee, 0)
    const total = includedFee ? Math.ceil(this.calculateTotalPriceWithFee(subtotal)) : subtotal

    return { planFee, excessFee: totalExcessFee, subtotal, total, categoriesPriceDetail }
  }
}
