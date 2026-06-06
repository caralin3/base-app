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

type CollectionMutationContext<TDocument extends FirestoreDocument> = {
  previousDocuments: TDocument[];
  queryKey: readonly unknown[];
};

export type CollectionQueryOptions<TDocument extends FirestoreDocument> = {
  scopeKey?: string;
  select?: (documents: TDocument[]) => TDocument[];
};

const createOptimisticId = () =>
  `optimistic-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

export const createFirestoreCollectionHooks = <
  TDocument extends FirestoreDocument,
  TCreateInput,
>(
  actions: CollectionActions<TDocument, TCreateInput>
) => {
  const { collectionName } = actions;

  const queryKey = (userId?: string, scopeKey?: string) =>
    scopeKey
      ? (['firestore', collectionName, userId, scopeKey] as const)
      : (['firestore', collectionName, userId] as const);
  const mutationKey = (action: 'create' | 'delete' | 'update') =>
    ['firestore', collectionName, action] as const;

  const useCollectionQuery = (
    userId?: string,
    options?: CollectionQueryOptions<TDocument>
  ) => {
    return useQuery({
      enabled: Boolean(userId),
      queryFn: async () => {
        const documents = await actions.getDocuments();
        const userDocuments = userId
          ? documents.filter((document) => document.userId === userId)
          : [];
        return options?.select ? options.select(userDocuments) : userDocuments;
      },
      queryKey: userId
        ? queryKey(userId, options?.scopeKey)
        : ['firestore', collectionName],
      staleTime: Infinity,
    });
  };

  const useGetByIdQuery = (id: string, userId?: string) => {
    return useQuery({
      enabled: Boolean(userId),
      queryFn: async () => {
        const document = await actions.getDocuments();
        return document.find((doc) => doc.id === id && doc.userId === userId);
      },
      queryKey: ['firestore', collectionName, 'byId', id, userId],
      staleTime: Infinity,
    });
  };

  const useCreateMutation = (userId?: string) => {
    const queryClient = useQueryClient();

    return useMutation({
      mutationKey: mutationKey('create'),
      networkMode: 'offlineFirst',
      mutationFn: actions.addDocument,
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

    return useMutation<
      void,
      Error,
      CollectionMutationVariables<TDocument>,
      CollectionMutationContext<TDocument> | undefined
    >({
      mutationKey: mutationKey('update'),
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
      mutationKey: mutationKey('delete'),
      mutationFn: actions.deleteDocument,
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
    useGetByIdQuery,
    useUpdateMutation,
  };
};
