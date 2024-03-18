import { ReadonlyURLSearchParams } from "next/navigation";

function fromUseSearchParam(param: ReadonlyURLSearchParams) {
  return new URLSearchParams(param.toString());
}

function replaceIfExistElseDelete(
  param: URLSearchParams,
  key: string,
  value?: string
) {
  if (value) {
    param.set(key, value);
  } else {
    param.delete(key);
  }
}

const SearchParamUtil = {
  fromUseSearchParam,
  replaceIfExistElseDelete,
};

export default SearchParamUtil;
