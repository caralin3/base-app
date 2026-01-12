import { useEffect, useState } from 'react';

import { getItem, setItem } from '../storage';

const IS_FIRST_TIME = 'IS_FIRST_TIME';

export const useIsFirstTime = () => {
  const [isFirstTime, setIsFirstTime] = useState<boolean | undefined>(
    undefined
  );

  useEffect(() => {
    (async () => {
      const value = await getItem<boolean>(IS_FIRST_TIME);
      setIsFirstTime(value ?? true);
    })();
  }, []);

  const setValue = async (value: boolean) => {
    await setItem(IS_FIRST_TIME, value);
    setIsFirstTime(value);
  };

  if (isFirstTime === undefined) {
    return [true, setValue] as const;
  }
  return [isFirstTime, setValue] as const;
};
