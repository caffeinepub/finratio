import { createContext, useContext, useEffect, useState } from "react";

interface BookmarkContextType {
  bookmarks: string[];
  toggle: (id: string) => void;
  isBookmarked: (id: string) => boolean;
}

const BookmarkContext = createContext<BookmarkContextType>({
  bookmarks: [],
  toggle: () => {},
  isBookmarked: () => false,
});

export function BookmarkProvider({ children }: { children: React.ReactNode }) {
  const [bookmarks, setBookmarks] = useState<string[]>(() => {
    try {
      return JSON.parse(localStorage.getItem("finratio-bookmarks") || "[]");
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem("finratio-bookmarks", JSON.stringify(bookmarks));
  }, [bookmarks]);

  const toggle = (id: string) => {
    setBookmarks((prev) =>
      prev.includes(id) ? prev.filter((b) => b !== id) : [...prev, id],
    );
  };

  return (
    <BookmarkContext.Provider
      value={{
        bookmarks,
        toggle,
        isBookmarked: (id) => bookmarks.includes(id),
      }}
    >
      {children}
    </BookmarkContext.Provider>
  );
}

export const useBookmarks = () => useContext(BookmarkContext);
