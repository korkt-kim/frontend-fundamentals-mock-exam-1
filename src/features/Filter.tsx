import { createContext, PropsWithChildren, useContext, useMemo, useState } from 'react';
import { SelectBottomSheet, Spacing, TextField } from 'tosslib';

const DEPOSIT_PERIOD_OPTIONS = [
  { value: 6, label: '6개월' },
  { value: 12, label: '12개월' },
  { value: 24, label: '24개월' },
];

const FilterContext = createContext<{ goalAmount: number | ''; monthlyPay: number | ''; depositPeriod: number } | null>(
  null
);

export const Filter = ({ children }: PropsWithChildren) => {
  const [goalAmount, setGoalAmount] = useState<number | ''>('');
  const [monthlyPay, setMonthlyPay] = useState<number | ''>('');
  const [depositPeriod, setDepositPeriod] = useState<6 | 12 | 24>(12);

  const parseNumber = (str: string): number | '' => {
    // 쉼표를 모두 제거한 후 숫자로 변환합니다
    // replace(/,/g, '')는 모든 쉼표를 빈 문자열로 치환합니다
    const cleaned = str.replace(/,/g, '');

    // 빈 문자열이면 0을 반환합니다
    if (cleaned === '') {
      return '';
    }

    // parseInt는 문자열을 정수로 변환합니다
    // 10은 10진수를 의미합니다
    const parsed = parseInt(cleaned, 10);

    // 변환에 실패하면 NaN이 반환되는데, 이 경우 0을 반환합니다
    return isNaN(parsed) ? 0 : parsed;
  };

  return (
    <FilterContext.Provider
      value={useMemo(
        () => ({
          goalAmount,
          monthlyPay,
          depositPeriod,
        }),
        [depositPeriod, goalAmount, monthlyPay]
      )}
    >
      <TextField
        label="목표 금액"
        placeholder="목표 금액을 입력하세요"
        suffix="원"
        value={goalAmount === '' ? goalAmount : Number(goalAmount).toLocaleString()}
        onChange={e => {
          const numericValue = parseNumber(e.target.value);
          setGoalAmount(numericValue);
        }}
      />
      <Spacing size={16} />
      <TextField
        label="월 납입액"
        placeholder="희망 월 납입액을 입력하세요"
        suffix="원"
        value={monthlyPay === '' ? monthlyPay : Number(monthlyPay).toLocaleString()}
        onChange={e => {
          const numericValue = parseNumber(e.target.value);

          setMonthlyPay(numericValue);
        }}
      />
      <Spacing size={16} />
      <SelectBottomSheet
        label="저축 기간"
        title="저축 기간을 선택해주세요"
        value={depositPeriod}
        onChange={v => {
          setDepositPeriod(v);
        }}
      >
        {DEPOSIT_PERIOD_OPTIONS.map(item => (
          <SelectBottomSheet.Option key={item.value} value={item.value}>
            {item.label}
          </SelectBottomSheet.Option>
        ))}
      </SelectBottomSheet>
      {children}
    </FilterContext.Provider>
  );
};

export const useFilter = () => {
  const ctx = useContext(FilterContext);
  if (!ctx) {
    throw new Error('');
  }

  return ctx;
};
