"use client";

import {
  useEffect,
  useState,
} from "react";

const STORAGE_KEY =
  "tarkintel-favorite-items";

export function useFavoriteItems() {
  /*
    STATE
  */

  const [
    favorites,
    setFavorites,
  ] = useState<string[]>([]);

  const [loaded, setLoaded] =
    useState(false);

  /*
    LOAD
  */

  useEffect(() => {
    try {
      const saved =
        localStorage.getItem(
          STORAGE_KEY
        );

      if (saved) {
        setFavorites(
          JSON.parse(saved)
        );
      }
    } catch (error) {
      console.error(
        "FAVORITES LOAD ERROR:",
        error
      );
    } finally {
      setLoaded(true);
    }
  }, []);

  /*
    SAVE
  */

  useEffect(() => {
    if (!loaded) {
      return;
    }

    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(
        favorites
      )
    );
  }, [favorites, loaded]);

  /*
    TOGGLE
  */

  function toggleFavorite(
    itemId: string
  ) {
    setFavorites((prev) => {
      if (
        prev.includes(itemId)
      ) {
        return prev.filter(
          (id) =>
            id !== itemId
        );
      }

      return [
        itemId,
        ...prev,
      ];
    });
  }

  /*
    CHECK
  */

  function isFavorite(
    itemId: string
  ) {
    return favorites.includes(
      itemId
    );
  }

  return {
    favorites,

    toggleFavorite,

    isFavorite,
  };
}