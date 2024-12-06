import { type ICalculationService, type totalPriceDetail, TCategory, TPlanType, TProductName } from './interface/calculationService'
import { GetCalculatePrice } from './interface/calculationDomain'


export class ProductItem{
  public readonly totalPrice: number
  constructor(
    public readonly name: TProductName, 
    public readonly quantity: number, 
    public unitPrice: number
  ){
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
  private readonly goodsLimit = 20 

  /**
  * 35類的3519類別，超項所收取的服務費
  * 超過5項 每項 500 元
  */
  private readonly retailServiceFee = 500 
  private readonly retailLimit = 5 
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

  private getTotal (totalPrice: number,includedFee: boolean): number {
    return Math.ceil(includedFee ? ((totalPrice * 1000) + (totalPrice * this.rate)) / 1000 : totalPrice)
  }
  
  private planFee(planType:TPlanType):number {
    return this.governmentFee + this.planFeeDic[planType]
  }

  private isBasic(planType: TPlanType): boolean {
    return planType === 'basic'
  }

  private isRetail(items: string[]) {
    return items.some(item => item.startsWith('3519'))
  }

  private isGoods(items: string[]) {
    return this.goodsCategories.includes(items[0].substring(0, 2))
  }

  private RetailCount(items: string[]) {
    return Math.max((items.filter(i => i.startsWith('3519'))).length - this.retailLimit, 0)
  }

  private retailExcessFee(items: string[]) {
    const excessQty = this.RetailCount(items)
    const excessFee = this.isRetail(items) && excessQty !== 0 ? this.retailServiceFee : 0
    return new ProductItem('special_excess_item_fee', excessQty, excessFee)
  }

  private goodExcessFee(items: string[]) {
    const excessQty = Math.max(items.length - 20, 0)
    const qty = this.isGoods(items) ? excessQty : 0
    const excessFee = this.isGoods(items) && excessQty !== 0 ? this.goodsFee : 0
    return new ProductItem('excess_item_fee', qty, excessFee)
  }


  private advanced(planType:TPlanType): ProductItem {
    const qty = !this.isBasic(planType) ? 1 : 0
    return new ProductItem('application_advanced_service_fee', qty, (qty * this.planFeeDic[planType]))
  }

  private basicFee(planType:TPlanType): ProductItem {
    const qty = this.isBasic(planType) ? 1 : 0
    return new ProductItem('application_basic_service_fee', qty, (qty * this.planFeeDic[planType]))
  } 

  private getGovernmentFee() {
    return new ProductItem('application_regulation_fee', 1, this.governmentFee)
  }

  private getExcessFee(items: string[]) {
    let excessFee = 0
    if (this.isGoods(items)) {
      excessFee = this.goodsFee
    } else if (this.isRetail(items)) {
      excessFee = this.retailServiceFee
    }
    return excessFee
  }

  private getFeeItemDetail(categories: TCategory[], planType: TPlanType, includedFee: boolean) {
    return categories.map(({ code, items }) => {
      const excessQty = this.isGoods(items)?
        Math.max(items.length-this.goodsLimit,0 ):
        Math.max((items.filter(i => i.startsWith('3519'))).length - this.retailLimit, 0)
      let excessFee = this.getExcessFee(items)
      let excessTotalFee = excessQty * excessFee
      const subtotal = excessTotalFee + this.planFee(planType)
      const total = this.getTotal(subtotal, includedFee)
      const fee = total - subtotal

      const feeItems = [
        this.getGovernmentFee(),
        this.basicFee(planType),
        this.advanced(planType),
        this.goodExcessFee(items),
        this.retailExcessFee(items)
      ]
      return { code, codeQty: items.length, excessTotalFee, fee, subTotal: total, items: feeItems, excessFee, excessQty }
    })
  }

  async calculateCategoriesFeeDetail (planType: TPlanType, categories: TCategory[], includedFee: boolean): Promise<totalPriceDetail> {
    
    // 計算個類別明細
    const categoriesPriceDetail = this.getFeeItemDetail(categories, planType, includedFee)
    const excessFee = categoriesPriceDetail.reduce((acc, category) => acc + category.excessTotalFee, 0)
    const subtotal = categoriesPriceDetail.reduce((acc, category) => acc + this.planFee(planType) + category.excessTotalFee, 0)
    const total = this.getTotal(subtotal,includedFee)

    return { planFee: this.planFee(planType), excessFee, subtotal, total, categoriesPriceDetail }
  }

  async calculateCategoriesFeeDetail2 (planType: TPlanType, categories: TCategory[], includedFee: boolean): Promise<GetCalculatePrice> {
    const details = this.getFeeItemDetail(categories, planType, includedFee)
    const excessFee = details.reduce((acc, category) => acc + category.excessTotalFee, 0)
    const subtotal = details.reduce((acc, category) => acc + this.planFee(planType) + category.excessTotalFee, 0)
    const total = this.getTotal(subtotal,includedFee)

    return {
      planFee: this.planFee(planType),
      excessFee: excessFee,
      subtotal: subtotal,
      total: total,
      detail: details.map(({ code, codeQty, excessQty, excessFee }) => ({
        code,
        codeQty,
        excessQty,
        excessFee,
        planFee: this.planFee(planType),
      }))
    }
  }
}
