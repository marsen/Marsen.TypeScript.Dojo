# 重構記錄

## 前言

這是公司的一個案例，由一位資淺的工程師所開發
我們來看看有什麼壞味道，要怎麼透過測試修正他
不過由於我們在架構上已經有作 di，所以其實相對的還不算太困難

## 壞味道

### Q.測試意圖不明確

案例過於複雜，將輸入與輸出直接固定在程式碼中，
未關注實際邏輯或邊界情況，導致可讀性低、維護困難，且無法反映實際需求。

#### A.解決，明確需求重寫測試

在本案例中，我們需要提供兩個方法給其他 RD 使用
一個是給前端使用，這裡有一個`大原則是前端不作任何金額的計算，金額全部都由後端提供`，  
商業邏輯如下:
在申請商標時，會有一些費用的產生

- 方案費用;基本型或進階型，並且再加上一個政府規費
- 超項費
  - 如果是一般商品(1~34類)，申請超過 20 項，每超過一項會收 200
  - 如果是 3519 的服務，申請超過 5 項，每超過一項會收 500
- 小計:計算完後加總
- 總計:加上 3% 的稅金，未來有考慮會有優惠活動的減免

方法一需求介面如下

```typescript
{
  /** 方案費用(服務費 + 政府規費) */
  planFee: number
  /** 總計超項費用 */
  excessFee: number
  /** 小計 */
  subtotal: number
  /** 總金額  */
  total: number
  /** 各類金額細節 */
  detail: Array<{
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
    }>
}
```

方法二需求介面如下

```typescript
{
  /** 總金額 (可能包含手續費) */
  total: number
  /** 總手續費 */
  fee: number
  /** 各類細節 */
  detail: Array<{
    /** 大類 */
    code: string
    /** 選擇商品/服務項目總數量 */
    codeQty: number
    /** 手續費 */
    fee: number
    /** 申請類別總額 */
    subTotal: number
    /** 項目細節 */
    items: Array<{
        /** 項目名稱(方案費，服務費，超項費) */
        name: TProductName
        /** 數量 */
        quantity: number
        /** 單位金額 */
        unitPrice: number
        /** 單位總金額 */
        totalPrice: number
    }>
  }>
}
```

開始寫測試會有一些對商業邏輯的發現:  
**方案x2:一般/進階(安心)，超項費x3:商品/3519/其他，是否收手續費x2:是否**

### Q. 拙劣命名

#### A. 暫時先列 todo，再修正
  
  //todo: bad name CalculationServiceDomain -> CalculationDomain
  //todo: bad Type PLAN_TYPES[number]
  //todo: bad name handleAllPriceDetail 意義不明
  //todo: bad name GetCalculatePriceResponseBody request response 應該是 Controller 的事情
  //todo: bad name categories 複數的名詞應該是陣列/集合/清單
