import { defineStore } from 'pinia'
import {
  fetchUserFavourites,
  setFavourite as setFavouriteApi,
} from '~/services/favourites'
import { useUserStore } from '~/stores/useUserStore'

export interface ToggleFavouriteResult {
  /** Whether the item is now favourited */
  favourited: boolean
  /** 'added' | 'removed' | null if the operation failed */
  action: 'added' | 'removed' | null
}

export const useFavouriteStore = defineStore('favourites', {
  state: () => ({
    /** Football competition enum names */
    footballCompetitions: [] as string[],
    /** Football team numeric IDs */
    footballTeams: [] as number[],
    /** Motorsport competition enum names */
    motorsportCompetitions: [] as string[],
  }),

  persist: true,

  actions: {
    /**
     * Hydrate the store from the backend.
     * Call after login or on app startup when authenticated.
     * Falls back to localStorage (via persist) if the user is not logged in.
     */
    async syncFromBackend() {
      const userStore = useUserStore()
      if (!userStore.isLoggedIn) return

      try {
        const data = await fetchUserFavourites()
        this.$patch({
          footballCompetitions: data.footballCompetitions,
          footballTeams: data.footballTeams,
          motorsportCompetitions: data.motorsportCompetitions,
        })
      } catch {
        // Silent fail — localStorage data persists as fallback
      }
    },

    /**
     * Toggle a football competition favourite.
     * Returns the result so the caller can show a toast.
     */
    async toggleFootballCompetition(name: string): Promise<ToggleFavouriteResult> {
      const wasFav = this.footballCompetitions.includes(name)
      const nowFav = !wasFav

      // Optimistic update using $patch for guaranteed reactivity
      this.$patch((state) => {
        if (wasFav) {
          state.footballCompetitions = state.footballCompetitions.filter((n) => n !== name)
        } else {
          state.footballCompetitions = [...state.footballCompetitions, name]
        }
      })

      const userStore = useUserStore()
      if (!userStore.isLoggedIn) {
        return { favourited: nowFav, action: nowFav ? 'added' : 'removed' }
      }

      try {
        await setFavouriteApi('FOOTBALL_COMPETITION', name, nowFav)
        return { favourited: nowFav, action: nowFav ? 'added' : 'removed' }
      } catch {
        // Revert on failure
        this.$patch((state) => {
          if (wasFav) {
            state.footballCompetitions = [...state.footballCompetitions, name]
          } else {
            state.footballCompetitions = state.footballCompetitions.filter((n) => n !== name)
          }
        })
        return { favourited: wasFav, action: null }
      }
    },

    /**
     * Toggle a football team favourite.
     * Returns the result so the caller can show a toast.
     */
    async toggleFootballTeam(id: number): Promise<ToggleFavouriteResult> {
      const wasFav = this.footballTeams.includes(id)
      const nowFav = !wasFav

      // Optimistic update using $patch for guaranteed reactivity
      this.$patch((state) => {
        if (wasFav) {
          state.footballTeams = state.footballTeams.filter((tid) => tid !== id)
        } else {
          state.footballTeams = [...state.footballTeams, id]
        }
      })

      const userStore = useUserStore()
      if (!userStore.isLoggedIn) {
        return { favourited: nowFav, action: nowFav ? 'added' : 'removed' }
      }

      try {
        await setFavouriteApi('FOOTBALL_TEAM', id.toString(), nowFav)
        return { favourited: nowFav, action: nowFav ? 'added' : 'removed' }
      } catch {
        // Revert on failure
        this.$patch((state) => {
          if (wasFav) {
            state.footballTeams = [...state.footballTeams, id]
          } else {
            state.footballTeams = state.footballTeams.filter((tid) => tid !== id)
          }
        })
        return { favourited: wasFav, action: null }
      }
    },

    /**
     * Toggle a motorsport competition favourite.
     * Returns the result so the caller can show a toast.
     */
    async toggleMotorsportCompetition(name: string): Promise<ToggleFavouriteResult> {
      const wasFav = this.motorsportCompetitions.includes(name)
      const nowFav = !wasFav

      // Optimistic update using $patch for guaranteed reactivity
      this.$patch((state) => {
        if (wasFav) {
          state.motorsportCompetitions = state.motorsportCompetitions.filter((n) => n !== name)
        } else {
          state.motorsportCompetitions = [...state.motorsportCompetitions, name]
        }
      })

      const userStore = useUserStore()
      if (!userStore.isLoggedIn) {
        return { favourited: nowFav, action: nowFav ? 'added' : 'removed' }
      }

      try {
        await setFavouriteApi('MOTORSPORT_COMPETITION', name, nowFav)
        return { favourited: nowFav, action: nowFav ? 'added' : 'removed' }
      } catch {
        // Revert on failure
        this.$patch((state) => {
          if (wasFav) {
            state.motorsportCompetitions = [...state.motorsportCompetitions, name]
          } else {
            state.motorsportCompetitions = state.motorsportCompetitions.filter((n) => n !== name)
          }
        })
        return { favourited: wasFav, action: null }
      }
    },
  },
})
