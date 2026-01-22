"use client"

import { useContext } from "react"
// We keep the hook here for backward compatibility with existing imports
// but the actual logic is now in FavoritesProvider
import { FavoritesProvider } from "@/components/favorites-provider"

// This file now just re-exports the hook from the provider's file or implements it here
// To avoid circular dependency if FavoritesProvider uses types from here, we'll just 
// keep the logic in FavoritesProvider and have this file be a clean entry point.

import { createContext } from "react"
// Actually, since I already defined useFavorites in favorites-provider.tsx, 
// I should just re-export it here to maintain compatibility with all components.

export { useFavorites } from "@/components/favorites-provider"
