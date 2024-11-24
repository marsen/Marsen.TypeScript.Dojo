import { injectable } from 'inversify'
//todo: 參數轉回類別內部，在 interface 有 public 的意思
import { type ICalculationService, type CategoriesPriceDetail, type ItemsDetail, PRODUCT_NAMES, type totalPriceDetail, PlanType } from './interface/calculationService'
import { Category } from './interface/calculationDomain'

@injectable()
export class CalculationService implements ICalculationService {
  private readonly rate = 30 as const
  private readonly goodsFee = 200
  private readonly specialServiceFee = 500
  private readonly governmentFee = 2400 
  private readonly advanced = 7600
  private readonly basic = 2200
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
    return ((TotalPrice * 1000) + (TotalPrice * this.rate)) / 1000
  }

  async calculateCategoriesFeeDetail (planType: PlanType, categories: Category[], includedFee: boolean): Promise<totalPriceDetail> {
    const servicesTypeFee = planType === 'advanced' ? this.advanced: this.basic
    const planFee = this.governmentFee + servicesTypeFee
    // 計算個類別明細
    const categoriesPriceDetail: CategoriesPriceDetail[] = categories.map(category => {
      const { code, items } = category
      const codeQty = items.length
      let excessQty = 0
      let excessFee = 0
      let excessTotalFee = 0

      if (code >= '01' && code <= '34') {
        excessQty = codeQty > 20 ? codeQty - 20 : 0
        excessFee = this.goodsFee
        excessTotalFee = excessQty * this.goodsFee
      } else if (code === '35') {
        const filteredItems = items.filter(item => item.startsWith('3519'))
        const filteredQty = filteredItems.length
        excessQty = filteredQty > 5 ? filteredQty - 5 : 0
        excessFee = this.specialServiceFee
        excessTotalFee = excessQty * this.specialServiceFee
      }

      const includedExcessFee = excessTotalFee + planFee
      const subTotal = includedFee ? this.calculateTotalPriceWithFee(includedExcessFee) : includedExcessFee
      const fee = subTotal - includedExcessFee

      //todo: 特別的邏輯，可能有壞味這
      const itemsDetail: ItemsDetail[] = [
        this.createItemDetail(PRODUCT_NAMES[0], 1, this.governmentFee, this.governmentFee),
        this.createItemDetail(PRODUCT_NAMES[1], planType === 'basic' ? 1 : 0, planType === 'basic' ? this.basic : 0, planType === 'basic' ? this.basic : 0),
        this.createItemDetail(PRODUCT_NAMES[2], planType === 'advanced' ? 1 : 0, planType === 'advanced' ? this.advanced : 0, planType === 'advanced' ? this.advanced : 0),
        this.createItemDetail(PRODUCT_NAMES[3], code >= '01' && code <= '34' ? excessQty : 0, code >= '01' && code <= '34' && excessQty !== 0 ? this.goodsFee : 0, code >= '01' && code <= '34' ? excessTotalFee : 0),
        this.createItemDetail(PRODUCT_NAMES[4], code === '35' && items.some(item => item.startsWith('3519')) ? excessQty : 0, code === '35' && items.some(item => item.startsWith('3519')) && excessQty !== 0 ? this.specialServiceFee : 0, code === '35' && items.some(item => item.startsWith('3519')) ? excessTotalFee : 0)
      ]
      return { code, codeQty, excessTotalFee, fee: Math.ceil(fee), subTotal: Math.ceil(subTotal), items: itemsDetail, excessFee, excessQty }
    })

    const totalExcessFee = categoriesPriceDetail.reduce((acc, category) => acc + category.excessTotalFee, 0)
    const subtotal = categoriesPriceDetail.reduce((acc, category) => acc + planFee + category.excessTotalFee, 0)
    const total = includedFee ? Math.ceil(this.calculateTotalPriceWithFee(subtotal)) : subtotal

    return { planFee, excessFee: totalExcessFee, subtotal, total, categoriesPriceDetail }
  }
}
