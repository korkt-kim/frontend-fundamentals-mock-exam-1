import { SavingsProduct } from 'apis/types';
import { Tab } from 'components/Tab';
import { Filter, useFilter } from 'features/Filter';

import { useFetch } from 'hooks/useFetch';
import { SelectProduct, useSelectProduct } from 'providers/SelectProduct';

import { Assets, Border, colors, ListHeader, ListRow, NavigationBar, Spacing } from 'tosslib';
import { formatCurrency } from 'utils/formatCurrency';

export function SavingsCalculatorPage() {
  return (
    <>
      <NavigationBar title="적금 계산기" />

      <Spacing size={16} />

      <Filter>
        <Spacing size={24} />
        <Border height={16} />
        <Spacing size={8} />

        <Tab
          items={[
            { value: 'products', label: '적금상품' },
            { value: 'results', label: '계산 결과' },
          ]}
        >
          {currentTab => (
            <SelectProduct>
              {(() => {
                switch (currentTab) {
                  case 'products': {
                    return <ProductList />;
                  }
                  case 'results': {
                    return <ResultList />;
                  }
                }
              })()}
            </SelectProduct>
          )}
        </Tab>
      </Filter>

      {/* 아래는 계산 결과 탭 내용이에요. 계산 결과 탭을 구현할 때 주석을 해제해주세요. */}
      {/* <Spacing size={8} />

      <ListRow
        contents={
          <ListRow.Texts
            type="2RowTypeA"
            top="예상 수익 금액"
            topProps={{ color: colors.grey600 }}
            bottom={`1,000,000원`}
            bottomProps={{ fontWeight: 'bold', color: colors.blue600 }}
          />
        }
      />
      <ListRow
        contents={
          <ListRow.Texts
            type="2RowTypeA"
            top="목표 금액과의 차이"
            topProps={{ color: colors.grey600 }}
            bottom={`-500,000원`}
            bottomProps={{ fontWeight: 'bold', color: colors.blue600 }}
          />
        }
      />
      <ListRow
        contents={
          <ListRow.Texts
            type="2RowTypeA"
            top="추천 월 납입 금액"
            topProps={{ color: colors.grey600 }}
            bottom={`100,000원`}
            bottomProps={{ fontWeight: 'bold', color: colors.blue600 }}
          />
        }
      />

      <Spacing size={8} />
      <Border height={16} />
      <Spacing size={8} />

      <ListHeader title={<ListHeader.TitleParagraph fontWeight="bold">추천 상품 목록</ListHeader.TitleParagraph>} />
      <Spacing size={12} />

      <ListRow
        contents={
          <ListRow.Texts
            type="3RowTypeA"
            top={'기본 정기적금'}
            topProps={{ fontSize: 16, fontWeight: 'bold', color: colors.grey900 }}
            middle={`연 이자율: 3.2%`}
            middleProps={{ fontSize: 14, color: colors.blue600, fontWeight: 'medium' }}
            bottom={`100,000원 ~ 500,000원 | 12개월`}
            bottomProps={{ fontSize: 13, color: colors.grey600 }}
          />
        }
        onClick={() => {}}
      />
      <ListRow
        contents={
          <ListRow.Texts
            type="3RowTypeA"
            top={'고급 정기적금'}
            topProps={{ fontSize: 16, fontWeight: 'bold', color: colors.grey900 }}
            middle={`연 이자율: 2.8%`}
            middleProps={{ fontSize: 14, color: colors.blue600, fontWeight: 'medium' }}
            bottom={`50,000원 ~ 1,000,000원 | 24개월`}
            bottomProps={{ fontSize: 13, color: colors.grey600 }}
          />
        }
        onClick={() => {}}
      />

      <Spacing size={40} /> */}

      {/* 아래는 사용자가 적금 상품을 선택하지 않고 계산 결과 탭을 선택했을 때 출력해주세요. */}
      {/* <ListRow contents={<ListRow.Texts type="1RowTypeA" top="상품을 선택해주세요." />} /> */}
    </>
  );
}

const ProductList = () => {
  const { data } = useFetch<SavingsProduct[]>('get', '/api/savings-products');
  const filter = useFilter();
  const { checkedItem, setCheckedItem } = useSelectProduct();

  return (
    <>
      {data
        ?.filter(
          item =>
            (filter.monthlyPay === '' ||
              (filter.monthlyPay > item.minMonthlyAmount && filter.monthlyPay < item.maxMonthlyAmount)) &&
            filter.depositPeriod === item.availableTerms
        )
        .map(savingsProduct => (
          <ListRow
            key={savingsProduct.id}
            contents={
              <ListRow.Texts
                type="3RowTypeA"
                top={savingsProduct.name}
                topProps={{ fontSize: 16, fontWeight: 'bold', color: colors.grey900 }}
                middle={`연 이자율: ${savingsProduct.annualRate}%`}
                middleProps={{ fontSize: 14, color: colors.blue600, fontWeight: 'medium' }}
                bottom={`${formatCurrency(savingsProduct.minMonthlyAmount)} ~ ${formatCurrency(savingsProduct.maxMonthlyAmount)} | ${savingsProduct.availableTerms}개월`}
                bottomProps={{ fontSize: 13, color: colors.grey600 }}
              />
            }
            right={checkedItem === savingsProduct.id && <Assets.Icon name="icon-check-circle-green" />}
            onClick={() => {
              setCheckedItem(savingsProduct.id);
            }}
          />
        ))}
    </>
  );
};

const ResultList = () => {
  const { data } = useFetch<SavingsProduct[]>('get', '/api/savings-products');
  const filter = useFilter();
  const { checkedItem, setCheckedItem } = useSelectProduct();
  const result = data?.find(item => checkedItem === item.id);

  if (!checkedItem || !result) {
    return <ListRow contents={<ListRow.Texts type="1RowTypeA" top="상품을 선택해주세요." />} />;
  }

  const estimatedProfit = filter.depositPeriod * (filter.monthlyPay || 0) * (1 + result.annualRate * 0.5);
  const recommendProduct = data
    ?.filter(
      item =>
        (filter.monthlyPay === '' ||
          (filter.monthlyPay > item.minMonthlyAmount && filter.monthlyPay < item.maxMonthlyAmount)) &&
        filter.depositPeriod === item.availableTerms
    )
    .sort((a, b) => b.annualRate - a.annualRate)
    .slice(0, 2);

  return (
    <>
      <Spacing size={8} />

      <ListRow
        contents={
          <ListRow.Texts
            type="2RowTypeA"
            top="예상 수익 금액"
            topProps={{ color: colors.grey600 }}
            bottom={formatCurrency(estimatedProfit)}
            bottomProps={{ fontWeight: 'bold', color: colors.blue600 }}
          />
        }
      />
      <ListRow
        contents={
          <ListRow.Texts
            type="2RowTypeA"
            top="목표 금액과의 차이"
            topProps={{ color: colors.grey600 }}
            bottom={formatCurrency((filter.goalAmount || 0) - estimatedProfit)}
            bottomProps={{ fontWeight: 'bold', color: colors.blue600 }}
          />
        }
      />
      <ListRow
        contents={
          <ListRow.Texts
            type="2RowTypeA"
            top="추천 월 납입 금액"
            topProps={{ color: colors.grey600 }}
            bottom={formatCurrency((filter.goalAmount || 0) / (filter.depositPeriod * (1 + result.annualRate * 0.5)))}
            bottomProps={{ fontWeight: 'bold', color: colors.blue600 }}
          />
        }
      />

      <Spacing size={8} />
      <Border height={16} />
      <Spacing size={8} />

      <ListHeader title={<ListHeader.TitleParagraph fontWeight="bold">추천 상품 목록</ListHeader.TitleParagraph>} />
      <Spacing size={12} />

      {recommendProduct?.map(savingsProduct => (
        <ListRow
          key={savingsProduct.id}
          contents={
            <ListRow.Texts
              type="3RowTypeA"
              top={savingsProduct.name}
              topProps={{ fontSize: 16, fontWeight: 'bold', color: colors.grey900 }}
              middle={`연 이자율: ${savingsProduct.annualRate}%`}
              middleProps={{ fontSize: 14, color: colors.blue600, fontWeight: 'medium' }}
              bottom={`${formatCurrency(savingsProduct.minMonthlyAmount)} ~ ${formatCurrency(savingsProduct.maxMonthlyAmount)} | ${savingsProduct.availableTerms}개월`}
              bottomProps={{ fontSize: 13, color: colors.grey600 }}
            />
          }
          right={checkedItem === savingsProduct.id && <Assets.Icon name="icon-check-circle-green" />}
          onClick={() => {
            setCheckedItem(savingsProduct.id);
          }}
        />
      ))}

      <Spacing size={40} />
    </>
  );
};
