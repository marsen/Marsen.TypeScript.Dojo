import { type ICalculationService, PRODUCT_NAMES, type totalPriceDetail, TCategory, TPlanType, TProductName } from './interface/calculationService'
import { GetCalculatePrice } from './interface/calculationDomain'


class ProductItem{
  public readonly totalPrice: number
  constructor(
    public readonly name: TProductName, 
    public readonly quantity: number, 
    public unitPrice: number){
    this.totalPrice = quantity * unitPrice
      
  }
}
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

  private readonly goodsCategories = 
    [ '01', '02', '03', '04', '05', '06', '07', '08', '09', '10',
      '11', '12', '13', '14', '15', '16', '17', '18', '19', '20',
      '21', '22', '23', '24', '25', '26', '27', '28', '29', '30',
      '31', '32', '33', '34'
    ]

  private calculateTotalPriceWithFee (totalPrice: number,includedFee: boolean): number {
    return Math.ceil(includedFee ? ((totalPrice * 1000) + (totalPrice * this.rate)) / 1000 : totalPrice)
  }
  
  private planFee(planType:TPlanType):number {
    return this.governmentFee + this.planFeeDic[planType]
  }


  private isSpecial(items: string[]) {
    return items.some(item => item.startsWith('3519'))
  }

  private isGoods(code: string): boolean {
    return this.goodsCategories.includes(code)
  }

  async calculateCategoriesFeeDetail (planType: TPlanType, categories: TCategory[], includedFee: boolean): Promise<totalPriceDetail> {
    
    // 計算個類別明細
    const categoriesPriceDetail = this.getCategoriesPriceDetail(categories, planType, includedFee)
    const excessFee = categoriesPriceDetail.reduce((acc, category) => acc + category.excessTotalFee, 0)
    const subtotal = categoriesPriceDetail.reduce((acc, category) => acc + this.planFee(planType) + category.excessTotalFee, 0)
    const total = this.calculateTotalPriceWithFee(subtotal,includedFee)

    return { planFee: this.planFee(planType), excessFee, subtotal, total, categoriesPriceDetail }
  }
  
  private getCategoriesPriceDetail(categories: TCategory[],planType:TPlanType, includedFee: boolean) {
    return categories.map(c => {
      let excessQty = 0
      let excessFee = 0
      let excessTotalFee = 0

      if (this.isGoods(c.code)) {
        excessQty = Math.max(c.items.length - 20, 0)
        excessFee = this.goodsFee
      } else if (this.isSpecial(c.items)) {
        excessQty = Math.max((c.items.filter(i => i.startsWith('3519'))).length - 5, 0)
        excessFee = this.specialServiceFee
      }
        excessTotalFee = excessQty * excessFee

      const includedExcessFee = excessTotalFee + this.planFee(planType)
      const subTotal = this.calculateTotalPriceWithFee(includedExcessFee, includedFee)
      const fee = subTotal - includedExcessFee

      const items = [
        new ProductItem('application_regulation_fee', 1, this.governmentFee),
        new ProductItem('application_basic_service_fee', (isBasic(planType) ? 1 : 0), (isBasic(planType) ? this.planFeeDic[planType] : 0)),
        new ProductItem('application_advanced_service_fee', (!isBasic(planType) ? 1 : 0), (!isBasic(planType) ? this.planFeeDic[planType] : 0)),
        new ProductItem('excess_item_fee', (this.isGoods(c.code) ? excessQty : 0), (this.isGoods(c.code) && excessQty !== 0 ? this.goodsFee : 0)),
        new ProductItem('special_excess_item_fee', (this.isSpecial(c.items) ? excessQty : 0), (this.isSpecial(c.items) && excessQty !== 0 ? this.specialServiceFee : 0))
      ]
      return { code: c.code, codeQty: c.items.length, excessTotalFee, fee, subTotal, items, excessFee, excessQty }


      function isBasic(planType: TPlanType): boolean {
        return planType === 'basic'
      }
    })
  }

  async calculateCategoriesFeeDetail2 (planType: TPlanType, categories: TCategory[], includedFee: boolean): Promise<GetCalculatePrice> {
    const result = await this.calculateCategoriesFeeDetail(planType, categories, includedFee)
    return {
      planFee: result.planFee,
      excessFee: result.excessFee,
      subtotal: result.subtotal,
      total: result.total,
      detail: result.categoriesPriceDetail.map((d) => ({
        code: d.code,
        codeQty: d.codeQty,
        excessQty: d.excessQty,
        excessFee: d.excessFee,
        planFee: result.planFee
      }))
    }
  }
}
