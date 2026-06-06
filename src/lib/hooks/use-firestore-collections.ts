import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { type UpdateData } from 'firebase/firestore';

export type FirestoreDocument = {
  id: string;
  userId: string;
};

export type CollectionActions<
  TDocument extends FirestoreDocument,
  TCreateInput,
> = {
  addDocument: (data: TCreateInput) => Promise<string>;
  collectionName: string;
  deleteDocument: (id: string | number) => Promise<void>;
  getDocuments: () => Promise<TDocument[]>;
  updateDocument: (
    data: UpdateData<TDocument>,
    id: string | number
  ) => Promise<void>;
};

export type CollectionMutationVariables<TDocument extends FirestoreDocument> = {
  data: UpdateData<TDocument>;
  id: string | number;
};

const createOptimisticId = () =>
  `optimistic-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

export const createFirestoreCollectionHooks = <
  TDocument extends FirestoreDocument,
  TCreateInput,
>({
  addDocument,
  collectionName,
  deleteDocument,
  getDocuments,
  updateDocument,
}: CollectionActions<TDocument, TCreateInput>) => {
  const queryKey = (userId?: string) =>
    ['firestore', collectionName, userId] as const;

  const useCollectionQuery = (userId?: string) => {
    return useQuery({
      enabled: Boolean(userId),
      queryFn: async () => {
        const documents = await getDocuments();
        return userId
          ? documents.filter((document) => document.userId === userId)
          : [];
      },
      queryKey: userId ? queryKey(userId) : ['firestore', collectionName],
      staleTime: Infinity,
    });
  };

  const useCreateMutation = (userId?: string) => {
    const queryClient = useQueryClient();

    return useMutation({
      networkMode: 'offlineFirst',
      mutationFn: addDocument,
      onMutate: async (newDocument) => {
        if (!userId) {
          return undefined;
        }

        const currentQueryKey = queryKey(userId);
        await queryClient.cancelQueries({ queryKey: currentQueryKey });

        const previousDocuments =
          queryClient.getQueryData<TDocument[]>(currentQueryKey) ?? [];

        const optimisticDocument = {
          ...newDocument,
          id: createOptimisticId(),
        } as unknown as TDocument;

        queryClient.setQueryData<TDocument[]>(currentQueryKey, [
          ...previousDocuments,
          optimisticDocument,
        ]);

        return { previousDocuments, queryKey: currentQueryKey };
      },
      onError: (_error, _newDocument, context) => {
        if (!context) {
          return;
        }

        queryClient.setQueryData(context.queryKey, context.previousDocuments);
      },
      onSettled: async () => {
        if (!userId) {
          return;
        }

        await queryClient.invalidateQueries({ queryKey: queryKey(userId) });
      },
    });
  };

  const useUpdateMutation = (userId?: string) => {
    const queryClient = useQueryClient();

    return useMutation({
      mutationFn: ({ data, id }: CollectionMutationVariables<TDocument>) =>
        updateDocument(data, id),
      onMutate: async ({ data, id }) => {
        if (!userId) {
          return undefined;
        }

        const currentQueryKey = queryKey(userId);
        await queryClient.cancelQueries({ queryKey: currentQueryKey });

        const previousDocuments =
          queryClient.getQueryData<TDocument[]>(currentQueryKey) ?? [];

        queryClient.setQueryData<TDocument[]>(currentQueryKey, (current) =>
          (current ?? []).map((document) =>
            document.id === String(id)
              ? ({
                  ...document,
                  ...data,
                } as TDocument)
              : document
          )
        );

        return { previousDocuments, queryKey: currentQueryKey };
      },
      onError: (_error, _variables, context) => {
        if (!context) {
          return;
        }

        queryClient.setQueryData(context.queryKey, context.previousDocuments);
      },
      onSettled: async () => {
        if (!userId) {
          return;
        }

        await queryClient.invalidateQueries({ queryKey: queryKey(userId) });
      },
    });
  };

  const useDeleteMutation = (userId?: string) => {
    const queryClient = useQueryClient();

    return useMutation({
      mutationFn: deleteDocument,
      onMutate: async (id) => {
        if (!userId) {
          return undefined;
        }

        const currentQueryKey = queryKey(userId);
        await queryClient.cancelQueries({ queryKey: currentQueryKey });

        const previousDocuments =
          queryClient.getQueryData<TDocument[]>(currentQueryKey) ?? [];

        queryClient.setQueryData<TDocument[]>(currentQueryKey, (current) =>
          (current ?? []).filter((document) => document.id !== String(id))
        );

        return { previousDocuments, queryKey: currentQueryKey };
      },
      onError: (_error, _id, context) => {
        if (!context) {
          return;
        }

        queryClient.setQueryData(context.queryKey, context.previousDocuments);
      },
      onSettled: async () => {
        if (!userId) {
          return;
        }

        await queryClient.invalidateQueries({ queryKey: queryKey(userId) });
      },
    });
  };

  return {
    useCollectionQuery,
    useCreateMutation,
    useDeleteMutation,
    useUpdateMutation,
  };
};
