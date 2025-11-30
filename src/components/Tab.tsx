import { createContext, ReactNode, useContext, useEffect, useMemo, useState } from 'react';
import { Tab as PrimitiveTab } from 'tosslib';

const TabContext = createContext<{ currentTab: string } | null>(null);
export const Tab = ({
  items,
  value,
  onChange,
  children,
}: {
  items: Array<{ value: string; label: string }>;
  value?: string;
  onChange?: (value: string) => void;
  children?: ReactNode | ((value: string) => ReactNode);
}) => {
  const [currentTab, setCurrentTab] = useState(value ?? items[0].value);

  useEffect(() => {
    if (value) {
      setCurrentTab(value);
    }
  }, [value]);

  return (
    <TabContext.Provider
      value={useMemo(
        () => ({
          currentTab,
        }),
        [currentTab]
      )}
    >
      <PrimitiveTab
        onChange={value => {
          onChange?.(value);
          setCurrentTab(value);
        }}
      >
        {items.map(item => (
          <PrimitiveTab.Item key={item.value} value={item.value} selected={currentTab === item.value}>
            {item.label}
          </PrimitiveTab.Item>
        ))}
      </PrimitiveTab>
      {typeof children === 'function' ? children(currentTab) : children}
    </TabContext.Provider>
  );
};

export const useTab = <T extends string>() => {
  const ctx = useContext(TabContext);
  if (!ctx) {
    throw new Error('');
  }

  return ctx as { currentTab: T };
};
