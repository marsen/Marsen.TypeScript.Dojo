import { type ICalculationService, type ItemsDetail, PRODUCT_NAMES, type totalPriceDetail, TCategory, TPlanType } from './interface/calculationService'
import { GetCalculatePrice } from './interface/calculationDomain'

export class CalculationService implements ICalculationService {
  /**
  * 政府規費 2400/類
  * 此為政府收取的標準處理費用。
  */
  private readonly governmentFee = 2400 
  /**
  * 平台服務費 2200/類
  * 此為基本方案平台服務費用。
  */
  private readonly basicFee = 2200

  /**
  * 平台服務費 7600/類
  * 此為安心方案平台服務費用。
  */
  private readonly advancedFee = 7600 

  /**
  * 01 到 34 類，超項所收取的服務費
  * 超過20項 每項 200 元
  */
  private readonly goodsFee = 200 

  /**
  * 35類的3519類別，超項所收取的服務費
  * 超過5項 每項 500 元
  */
  private readonly specialServiceFee = 500 
  /**
   *  手續費 (3% 手續費會等於30。 單位：千位)
   */
  private readonly rate = 30 
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

  private calculateTotalPriceWithFee (TotalPrice: number): number {
    return ((TotalPrice * 1000) + (TotalPrice * this.rate)) / 1000
  }

  async calculateCategoriesFeeDetail (planType: TPlanType, categories: TCategory[], includedFee: boolean): Promise<totalPriceDetail> {
    const servicesTypeFee = planType === 'advanced' ? this.advancedFee : this.basicFee
    const planFee = this.governmentFee + servicesTypeFee
    // 計算個類別明細
    const categoriesPriceDetail = categories.map(category => {
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

      const itemsDetail: ItemsDetail[] = [
        { name: PRODUCT_NAMES[0], quantity: 1, unitPrice: this.governmentFee, totalPrice: this.governmentFee },
        { name: PRODUCT_NAMES[1], quantity: planType === 'basic' ? 1 : 0, unitPrice: planType === 'basic' ? this.basicFee : 0, totalPrice: planType === 'basic' ? this.basicFee : 0 },
        this.createItemDetail(PRODUCT_NAMES[2], planType === 'advanced' ? 1 : 0, planType === 'advanced' ? this.advancedFee : 0, planType === 'advanced' ? this.advancedFee : 0),
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

  async calculateCategoriesFeeDetail2 (planType: TPlanType, categories: TCategory[], includedFee: boolean): Promise<GetCalculatePrice> {
    const result = await this.calculateCategoriesFeeDetail(planType, categories, includedFee)
    return {
      planFee: result.planFee,
      excessFee: result.excessFee,
      subtotal: result.subtotal,
      total: result.total,
      detail: result.categoriesPriceDetail.map((detail) => ({
        code: detail.code,
        codeQty: detail.codeQty,
        excessQty: detail.excessQty,
        excessFee: detail.excessFee,
        planFee: result.planFee
      }))
    }
  }
}
