import { AnyObject } from '@commonTypes/common';

type TargetContext = '_self' | '_parent' | '_blank' | '_top';

export const openWindow = (
  url: string,
  opts?: { target?: TargetContext; [key: string]: any }
) => {
  const { target = '_blank', ...others } = opts || {};
  window.open(
    url,
    target,
    Object.entries(others)
      .reduce((preValue: string[], curValue) => {
        const [key, value] = curValue;
        return [...preValue, `${key}=${value}`];
      }, [])
      .join(',')
  );
};

export const regexUrl = new RegExp(
  '^(?!mailto:)(?:(?:http|https|ftp)://)(?:\\S+(?::\\S*)?@)?(?:(?:(?:[1-9]\\d?|1\\d\\d|2[01]\\d|22[0-3])(?:\\.(?:1?\\d{1,2}|2[0-4]\\d|25[0-5])){2}(?:\\.(?:[0-9]\\d?|1\\d\\d|2[0-4]\\d|25[0-4]))|(?:(?:[a-z\\u00a1-\\uffff0-9]+-?)*[a-z\\u00a1-\\uffff0-9]+)(?:\\.(?:[a-z\\u00a1-\\uffff0-9]+-?)*[a-z\\u00a1-\\uffff0-9]+)*(?:\\.(?:[a-z\\u00a1-\\uffff]{2,})))|localhost)(?::\\d{2,5})?(?:(/|\\?|#)[^\\s]*)?$',
  'i'
);

/** obj转formData */
export const objToFormData = (obj?: AnyObject) => {
  const formData = new FormData();
  if (!obj) return formData;
  Object.keys(obj).forEach((key) => {
    const value = obj[key];
    formData.append(key, value);
  });
  return formData;
};

/** 延时 */
export function awaitTime(duration = 200) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(null);
    }, duration);
  });
}

/**
 * 同步两个对象的key
 * @param source 源对象
 * @param target 被修改的对象
 */
export const syncObject = (source: AnyObject, target: AnyObject) => {
  Object.entries(source).forEach(([key, value]) => {
    const k = key as keyof typeof source;
    target[k] = value;
  });
};
