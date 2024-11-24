import { TYPES } from './types'
import { inject, injectable } from 'inversify'
import { type ICalculationDomain, type GetCalculatePriceResponseBody, Category } from './interface/calculationDomain'
import { PlanType, type ICalculationService } from './interface/calculationService'

@injectable()
export class CalculationDomain implements ICalculationDomain {
  constructor (    
    @inject(TYPES.CalculationService) private readonly calculateService: ICalculationService
  ) {}

  //todo: bad Type PLAN_TYPES[number]
  //todo: bad name handleAllPriceDetail 意義不明
  //todo: bad name GetCalculatePriceResponseBody request response 應該是 Controller 的事情
  //todo: bad name categories 複數的名詞應該是陣列/集合/清單
  async handleAllPriceDetail (planType: PlanType, categories: Category[], includedFee: boolean): Promise<GetCalculatePriceResponseBody> {
    const result = await this.calculateService.calculateCategoriesFeeDetail(planType, categories, includedFee)
    // 將資料處理成前端所需資料
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
