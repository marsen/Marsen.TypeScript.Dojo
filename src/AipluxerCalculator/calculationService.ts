import { type ICalculationService, PRODUCT_NAMES, type totalPriceDetail, TCategory, TPlanType } from './interface/calculationService'
import { GetCalculatePrice } from './interface/calculationDomain'

export class CalculationService implements ICalculationService {
  /**
  * 政府規費 2400/類
  * 此為政府收取的標準處理費用。
  */
  private readonly governmentFee = 2400 

  private readonly planFeeDic = {
    /**
    * 平台服務費 2200/類
    * 此為基本方案平台服務費用。
    */
    basic: 2200,
    /**
    * 平台服務費 7600/類
    * 此為安心方案平台服務費用。
    */
    advanced: 7600
  }

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


  private calculateTotalPriceWithFee (totalPrice: number,includedFee: boolean): number {
    return Math.ceil(includedFee ? ((totalPrice * 1000) + (totalPrice * this.rate)) / 1000 : totalPrice)
  }

  async calculateCategoriesFeeDetail (planType: TPlanType, categories: TCategory[], includedFee: boolean): Promise<totalPriceDetail> {
    const servicesTypeFee = this.planFeeDic[planType]
    
    const planFee = this.governmentFee + servicesTypeFee
    // 計算個類別明細
    const categoriesPriceDetail = categories.map(c => {
      const codeQty = c.items.length
      let excessQty = 0
      let excessFee = 0
      let excessTotalFee = 0

      if (isGoods(c.code)) {
        excessQty = Math.max(codeQty - 20, 0)
        excessFee = this.goodsFee
        excessTotalFee = excessQty * this.goodsFee
      } 
      if (isSpecial(c.items)) {
        excessQty = Math.max((c.items.filter(i => i.startsWith('3519'))).length - 5 , 0)
        excessFee = this.specialServiceFee
        excessTotalFee = excessQty * this.specialServiceFee
      }

      const includedExcessFee = excessTotalFee + planFee
      const subTotal = this.calculateTotalPriceWithFee(includedExcessFee,includedFee)
      const fee = subTotal - includedExcessFee

      const items = [
        { name: PRODUCT_NAMES[0], quantity: 1, unitPrice: this.governmentFee, totalPrice: this.governmentFee },
        { name: PRODUCT_NAMES[1], 
          quantity: isBasic(planType) ? 1 : 0, 
          unitPrice: isBasic(planType)  ? this.planFeeDic[planType] : 0, 
          totalPrice: isBasic(planType)  ? this.planFeeDic[planType] : 0 },
        { name: PRODUCT_NAMES[2], 
          quantity: !isBasic(planType)  ? 1 : 0, 
          unitPrice: !isBasic(planType)  ? this.planFeeDic[planType] : 0, 
          totalPrice: !isBasic(planType)  ? this.planFeeDic[planType] : 0 },
        { name: PRODUCT_NAMES[3], 
          quantity: isGoods(c.code) ? excessQty : 0, 
          unitPrice: isGoods(c.code) && excessQty !== 0 ? this.goodsFee : 0, 
          totalPrice: isGoods(c.code) ? excessTotalFee : 0 },
        { name: PRODUCT_NAMES[4], 
          quantity: isSpecial(c.items) ? excessQty : 0, 
          unitPrice: isSpecial(c.items) && excessQty !== 0 ? this.specialServiceFee : 0, 
          totalPrice: isSpecial(c.items) ? excessTotalFee : 0 }
      ]
      return { code:c.code, codeQty, excessTotalFee, fee, subTotal, items, excessFee, excessQty }

      function isGoods(code:string): boolean {
        return code >= '01' && code <= '34'
      }
      function isBasic(planType: TPlanType): boolean {
        return planType === 'basic'
      }
    })

    const totalExcessFee = categoriesPriceDetail.reduce((acc, category) => acc + category.excessTotalFee, 0)
    const subtotal = categoriesPriceDetail.reduce((acc, category) => acc + planFee + category.excessTotalFee, 0)
    const total = this.calculateTotalPriceWithFee(subtotal,includedFee)

    return { planFee, excessFee: totalExcessFee, subtotal, total, categoriesPriceDetail }

    function isSpecial(items: string[]) {
      return items.some(item => item.startsWith('3519'))
    }
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
