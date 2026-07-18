# TODO

- Favourites: update to store and retrieve from backend per-user, instead of
  localStorage. The current Pinia persisted store at
  `app/stores/useFavouriteStore.ts` only saves locally — it won't sync across
  devices or survive clearing browser data.
