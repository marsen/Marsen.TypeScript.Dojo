import { TYPES } from './types'
import { inject, injectable } from 'inversify'
import { type Categories } from './calculationController'
import { type ICalculationServiceDomain, type GetCalculatePriceResponseBody } from './interface/calculationServiceDomain'
import { type ICalculationService, type PLAN_TYPES } from './interface/calculationService'

@injectable()
//todo: bad name CalculationServiceDomain -> CalculationDomain
export class CalculationServiceDomain implements ICalculationServiceDomain {
  constructor (    
    @inject(TYPES.CalculationService) private readonly calculateService: ICalculationService
  ) {}

  //todo: bad Type PLAN_TYPES[number]
  //todo: bad name handleAllPriceDetail 意義不明
  //todo: bad name GetCalculatePriceResponseBody request response 應該是 Controller 的事情
  async handleAllPriceDetail (planType: typeof PLAN_TYPES[number], categories: Categories, includedFee: boolean): Promise<GetCalculatePriceResponseBody> {
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
