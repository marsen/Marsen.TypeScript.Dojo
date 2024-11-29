import type { Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import { inject, injectable } from 'inversify'
import { z } from 'zod'
import { TYPES } from './types'
import { ICalculationDomain } from './interface/calculationDomain'
import { PLAN_TYPES } from './interface/calculationService'



@injectable()
export class CalculationController {
  constructor (
    @inject(TYPES.CalculationDomain) private readonly calculateServiceDomain: ICalculationDomain
  ) {}

  getCalculateAllPriceDetail = async (req: Request, res: Response): Promise<void> => {
    const { plan, includedFee, categories } = (z.object({
      plan: z.enum(PLAN_TYPES).describe('方案類型'),
      includedFee: z.boolean().describe('是否包含手續費'),
      categories: z.array(
        z.object({
          code: z.string().max(2, '輸入的類別代碼不合法').describe('大類'),
          items: z.array(z.string().max(20, '輸入商品/服務項目不合法')).describe('選擇商品/服務項目清單')
        })
      ).min(1, '至少包含一項類別').describe('所選的類別清單')
    })).parse(req.body)

    const result = await this.calculateServiceDomain.handleAllPriceDetail(plan, categories, includedFee)

    res.status(StatusCodes.OK).json(result)
  }
}
