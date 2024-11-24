import { Category } from "./calculationDomain"

/**
 * 服務類別 (一般方案/安心方案)
 */
export const PLAN_TYPES = ['basic', 'advanced'] as const
export type PlanType = typeof PLAN_TYPES[number]

/**
 *  手續費 (3% 手續費會等於30。 單位：千位)
 */
export const FEE_RATE = 30

/**
 * 總計算細節
 */
export interface totalPriceDetail {
  /** 方案費用(服務費 + 政府規費) */
  planFee: number
  /** 總超項費 */
  excessFee: number
  /** 小計 */
  subtotal: number
  /** 總金額 (可能包含手續費) */
  total: number
  /** 各類細節 */
  categoriesPriceDetail: CategoriesPriceDetail[]
}

/**
 * 各類細節
 */
export interface CategoriesPriceDetail {
  /** 大類 */
  code: string
  /** 選擇商品/服務項目總數量 */
  codeQty: number
  /** 超項費總金額 */
  excessTotalFee: number
  /** 手續費 */
  fee: number
  /** 申請類別總額 */
  subTotal: number
  /** 項目細節 */
  items: ItemsDetail[]

  /** 超項數量(單個：前端所需欄位) */
  excessQty: number
  /** 超項金額(單個：前端所需欄位) */
  excessFee: number
}

/**
 * 各類細節 項目名稱
 */
export const PRODUCT_NAMES = [
  /** 政府規費 */
  'application_regulation_fee',
  /** 服務費(一般方案) */
  'application_basic_service_fee',
  /** 服務費(安心方案) */
  'application_advanced_service_fee',
  /** 超項費(200) */
  'excess_item_fee',
  /** 超項費(500) */
  'special_excess_item_fee'
] as const

/**
 * 項目細節
 */
export interface ItemsDetail {
  /** 項目名稱 */
  name: typeof PRODUCT_NAMES[number]
  /** 數量 */
  quantity: number
  /** 單位金額 */
  unitPrice: number
  /** 單位總金額 */
  totalPrice: number
}

export interface ICalculationService {

  /**
   * 計算手續費
   *
   * @param TotalPrice - 總金額
   * @returns 包含手續費的總金額
   */
  calculateTotalPriceWithFee: (excessTotalFee: number) => number

  /**
   * 計算各類別的費用細節
   *
   * @param planType - 服務類別(一般/安心方案)
   * @param categories - 包含分類代碼及選擇商品/服務項目清單
   * @param includedFee - 是否計算手續費
   * @returns 各類別的費用細節
   */
  calculateCategoriesFeeDetail: (planType: PlanType, categories: Category[], includedFee: boolean) => Promise<totalPriceDetail>
}
