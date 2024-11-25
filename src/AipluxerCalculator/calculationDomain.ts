import { TYPES } from './types'
import { inject, injectable } from 'inversify'
import { type ICalculationServiceDomain as ICalculationDomain, type GetCalculatePrice } from './interface/calculationDomain'
import { TCategory, TPlanType, type ICalculationService } from './interface/calculationService'

@injectable()
export class CalculationDomain implements ICalculationDomain {
  constructor (    
    @inject(TYPES.CalculationService) private readonly calculateService: ICalculationService
  ) {}

  //todo: bad name handleAllPriceDetail 意義不明
  //todo: bad name GetCalculatePriceResponseBody request response 應該是 Controller 的事情
  async handleAllPriceDetail (planType: TPlanType, categories: TCategory[], includedFee: boolean): Promise<GetCalculatePrice> {
    return await this.calculateService.calculateCategoriesFeeDetail2(planType, categories, includedFee)
  }
}
