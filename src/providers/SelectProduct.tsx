import { createContext, Dispatch, PropsWithChildren, SetStateAction, useContext, useMemo, useState } from 'react';

const SelectProductContext = createContext<{
  checkedItem: string | undefined;
  setCheckedItem: Dispatch<SetStateAction<string | undefined>>;
} | null>(null);

export const SelectProduct = ({ children }: PropsWithChildren) => {
  const [checkedItem, setCheckedItem] = useState<string | undefined>();

  return (
    <SelectProductContext.Provider
      value={useMemo(
        () => ({
          checkedItem,
          setCheckedItem,
        }),
        [checkedItem]
      )}
    >
      {children}
    </SelectProductContext.Provider>
  );
};

export const useSelectProduct = () => {
  const ctx = useContext(SelectProductContext);

  if (!ctx) {
    throw new Error('');
  }

  return ctx;
};
