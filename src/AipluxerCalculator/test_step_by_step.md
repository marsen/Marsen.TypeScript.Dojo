# 一步一步寫測試

## 第一個測試

```typescript
    it('一般方案，無超項(01類 2 項)', async () => {
    //arrange
    const expected = {
      planFee: 4600,
      excessFee: 0,
      subtotal: 4600,
      total: 4600,
      detail: [
        {
          code: '01',
          codeQty: 2,
          excessQty: 0,
          excessFee: 200,
          planFee: 4600
        }
      ] 
    }

    //act
    const result = await target.handleAllPriceDetail('basic', [{ code: '01', items: ['0101', '0102'] }], false)
    //assert
    expect(result).toEqual(expected)
    })
```
