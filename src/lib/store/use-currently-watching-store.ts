import { type CurrentlyWatchingShow } from '../firebase/types';
import { createPersistedStore } from './helpers';
import { createSelectors } from './selectors';

interface CurrentlyWatchingState {
  currentlyWatchingShows: CurrentlyWatchingShow[];
  addCurrentlyWatchingShow: (show: CurrentlyWatchingShow) => void;
  removeCurrentlyWatchingShow: (documentId: string) => void;
  updateCurrentlyWatchingShow: (
    documentId: string,
    data: Partial<CurrentlyWatchingShow>
  ) => void;
  setCurrentlyWatchingShows: (shows: CurrentlyWatchingShow[]) => void;
  resetCurrentlyWatchingShows: () => void;
}

export const useCurrentlyWatchingStoreBase =
  createPersistedStore<CurrentlyWatchingState>(
    'currently-watching-store',
    (set) => ({
      currentlyWatchingShows: [],
      addCurrentlyWatchingShow: (show) =>
        set((state) => ({
          currentlyWatchingShows: [show, ...state.currentlyWatchingShows],
        })),
      removeCurrentlyWatchingShow: (documentId) =>
        set((state) => ({
          currentlyWatchingShows: state.currentlyWatchingShows.filter(
            (show) => show.documentId !== documentId
          ),
        })),
      updateCurrentlyWatchingShow: (documentId, data) =>
        set((state) => ({
          currentlyWatchingShows: state.currentlyWatchingShows.map((show) =>
            show.documentId === documentId ? { ...show, ...data } : show
          ),
        })),
      setCurrentlyWatchingShows: (shows) =>
        set({ currentlyWatchingShows: shows }),
      resetCurrentlyWatchingShows: () => set({ currentlyWatchingShows: [] }),
    })
  );

export const useCurrentlyWatchingShowsStore = createSelectors(
  useCurrentlyWatchingStoreBase
);

export const addCurrentlyWatchingShowToStore = (show: CurrentlyWatchingShow) =>
  useCurrentlyWatchingStoreBase.getState().addCurrentlyWatchingShow(show);

export const removeCurrentlyWatchingShowFromStore = (documentId: string) =>
  useCurrentlyWatchingStoreBase
    .getState()
    .removeCurrentlyWatchingShow(documentId);

export const updateCurrentlyWatchingShowInStore = (
  documentId: string,
  data: Partial<CurrentlyWatchingShow>
) =>
  useCurrentlyWatchingStoreBase
    .getState()
    .updateCurrentlyWatchingShow(documentId, data);

export const setCurrentlyWatchingShowsInStore = (
  shows: CurrentlyWatchingShow[]
) => useCurrentlyWatchingStoreBase.getState().setCurrentlyWatchingShows(shows);

export const resetCurrentlyWatchingShowsInStore = () =>
  useCurrentlyWatchingStoreBase.getState().resetCurrentlyWatchingShows();
