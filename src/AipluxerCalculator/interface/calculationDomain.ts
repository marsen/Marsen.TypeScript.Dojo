import { PlanType } from "./calculationService"

/** 類別細項(前端需要的資料格式) */
export interface CategoriesPriceSummary {
  /** 大類 */
  code: string
  /** 選擇商品/服務項目總數量 */
  codeQty: number
  /** 超項總數量 */
  excessQty: number
  /** 單筆超項金額 */
  excessFee: number
  /** 方案費用(服務費 + 政府規費) */
  planFee: number
}

/** 前端輸出response */
export interface GetCalculatePriceResponseBody {
  /** 方案費用(服務費 + 政府規費) */
  planFee: number
  /** 總計超項費用 */
  excessFee: number
  /** 小計 */
  subtotal: number
  /** 總金額  */
  total: number
  /** 各類金額細節 */
  detail: CategoriesPriceSummary[]
}
export interface ICalculationDomain {
  /**
 * 處理總金額細節 與 各類別費用細節 (輸出前端所需資料)
 *
 * @param planType - 服務類別(一般/安心方案)
 * @param categories - 所選的類別清單
 * @param includedFee - 是否計算手續費
 * @returns 各類別的費用細節
 */
  handleAllPriceDetail: (planType: PlanType, categories: Category[], includedFee: boolean) => Promise<GetCalculatePriceResponseBody>
}
//todo: 暫時將 type 移至此處
export type Category = {
  code: string;
  items: string[];
}