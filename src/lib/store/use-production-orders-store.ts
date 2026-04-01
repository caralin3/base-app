import { type ProductionOrderDocument } from '../firebase/types';
import { createPersistedStore } from './helpers';
import { createSelectors } from './selectors';

export type ProductionOrder = ProductionOrderDocument;

interface ProductionOrdersState {
  productionOrders: ProductionOrder[];
  addProductionOrder: (order: ProductionOrder) => void;
  removeProductionOrder: (documentId: string) => void;
  updateProductionOrder: (
    documentId: string,
    data: Partial<ProductionOrder>
  ) => void;
  setProductionOrders: (orders: ProductionOrder[]) => void;
  resetProductionOrders: () => void;
  getProductionOrderByShowId: (showId: number) => ProductionOrder | undefined;
}

export const useProductionOrdersStoreBase =
  createPersistedStore<ProductionOrdersState>(
    'production-orders-store',
    (set, get) => ({
      productionOrders: [],
      addProductionOrder: (order) =>
        set((state) => ({
          productionOrders: [order, ...state.productionOrders],
        })),
      removeProductionOrder: (documentId) =>
        set((state) => ({
          productionOrders: state.productionOrders.filter(
            (order) => order.documentId !== documentId
          ),
        })),
      updateProductionOrder: (documentId, data) =>
        set((state) => ({
          productionOrders: state.productionOrders.map((order) =>
            order.documentId === documentId ? { ...order, ...data } : order
          ),
        })),
      setProductionOrders: (orders) => set({ productionOrders: orders }),
      resetProductionOrders: () => set({ productionOrders: [] }),
      getProductionOrderByShowId: (showId) => {
        const state = get();
        return state.productionOrders.find((order) => order.showId === showId);
      },
    })
  );

export const useProductionOrdersStore = createSelectors(
  useProductionOrdersStoreBase
);

export const addProductionOrderToStore = (order: ProductionOrder) =>
  useProductionOrdersStoreBase.getState().addProductionOrder(order);

export const removeProductionOrderFromStore = (documentId: string) =>
  useProductionOrdersStoreBase.getState().removeProductionOrder(documentId);

export const updateProductionOrderInStore = (
  documentId: string,
  data: Partial<ProductionOrder>
) =>
  useProductionOrdersStoreBase
    .getState()
    .updateProductionOrder(documentId, data);

export const setProductionOrdersInStore = (orders: ProductionOrder[]) =>
  useProductionOrdersStoreBase.getState().setProductionOrders(orders);

export const resetProductionOrdersInStore = () =>
  useProductionOrdersStoreBase.getState().resetProductionOrders();

export const getProductionOrderByShowIdFromStore = (showId: number) =>
  useProductionOrdersStoreBase.getState().getProductionOrderByShowId(showId);
