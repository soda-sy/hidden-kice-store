"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type ChangeEvent, type FormEvent } from "react";
import { SEARCH_DEBOUNCE_MS } from "../constants/product";

type ProductSearchProps = {
  keyword: string;
  onKeywordChange: (keyword: string) => void;
};

export function ProductSearch({ keyword, onKeywordChange }: ProductSearchProps) {
  const [inputValue, setInputValue] = useState(keyword);
  const [syncedKeyword, setSyncedKeyword] = useState(keyword);
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  if (keyword !== syncedKeyword) {
    setSyncedKeyword(keyword);
    if (keyword !== inputValue.trim()) setInputValue(keyword);
  }

  useEffect(() => () => clearTimeout(debounceTimerRef.current), []);

  function commitKeyword(nextKeyword: string) {
    clearTimeout(debounceTimerRef.current);
    if (nextKeyword.trim() !== keyword) onKeywordChange(nextKeyword.trim());
  }

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    const nextValue = event.target.value;
    setInputValue(nextValue);
    clearTimeout(debounceTimerRef.current);
    debounceTimerRef.current = setTimeout(() => commitKeyword(nextValue), SEARCH_DEBOUNCE_MS);
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    commitKeyword(inputValue);
  }

  function handleClear() {
    setInputValue("");
    commitKeyword("");
  }

  return (
    <form
      role="search"
      onSubmit={handleSubmit}
      className="flex w-full items-center gap-2 rounded-md border border-gray-100 p-2 transition-[border-color,box-shadow] duration-200 hover:border-gray-200 focus-within:border-primary focus-within:shadow-[0_0_0_3px_rgba(127,119,221,0.15)] md:w-[250px]"
    >
      <Image src="/icons/search.svg" alt="" width={20} height={20} />
      <input
        type="search"
        value={inputValue}
        onChange={handleChange}
        placeholder="검색"
        aria-label="상품명 검색"
        className="min-w-0 flex-1 text-body font-semibold text-gray-800 outline-none placeholder:text-gray-300 [&::-webkit-search-cancel-button]:appearance-none"
      />
      <button
        type="button"
        aria-label="검색어 지우기"
        onClick={handleClear}
        disabled={inputValue === ""}
        className="flex size-4 shrink-0 items-center justify-center transition-[opacity,transform] duration-200 enabled:hover:rotate-90 enabled:hover:opacity-60 disabled:opacity-40"
      >
        <Image src="/icons/x.svg" alt="" width={16} height={16} />
      </button>
    </form>
  );
}
