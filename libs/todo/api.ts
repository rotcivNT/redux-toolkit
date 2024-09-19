import { Todo } from "@/types/todo.type";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const todoApi = createApi({
  reducerPath: "todoApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://66ebef6a2b6cf2b89c5c7fe3.mockapi.io/api/v1/todos",
  }),
  tagTypes: ["Todo"],
  endpoints: (builder) => ({
    getTodos: builder.query<Todo[], void>({
      query: () => "",
      providesTags: ["Todo"],
    }),

    addTodo: builder.mutation({
      query: (todo: Omit<Todo, "id">) => ({
        url: "",
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(todo),
      }),
      async onQueryStarted(todo, { dispatch, queryFulfilled }) {
        // Optimistic update
        const tempId = `temp-${Date.now()}`;
        const patchResult = dispatch(
          todoApi.util.updateQueryData("getTodos", undefined, (draft) => {
            draft.push({ ...todo, id: tempId });
          })
        );

        try {
          const { data: createdTodo } = await queryFulfilled;
          dispatch(
            todoApi.util.updateQueryData("getTodos", undefined, (draft) => {
              const index = draft.findIndex((t) => t.id === tempId);
              if (index !== -1) {
                draft[index] = createdTodo;
              }
            })
          );
        } catch {
          patchResult.undo();
        }
      },
    }),

    updateTodo: builder.mutation<
      Todo,
      { id: string; updatedFields: Partial<Todo> }
    >({
      query: ({ id, updatedFields }) => ({
        url: `/${id}`,
        method: "PUT",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(updatedFields),
      }),
      async onQueryStarted(
        { id, updatedFields },
        { dispatch, queryFulfilled }
      ) {
        // Optimistic update
        const patchResult = dispatch(
          todoApi.util.updateQueryData("getTodos", undefined, (draft) => {
            const todo = draft.find((t) => t.id === id);
            if (todo) {
              Object.assign(todo, updatedFields);
            }
          })
        );

        queryFulfilled.catch(() => {
          patchResult.undo();
        });
      },
    }),
    deleteTodo: builder.mutation<void, string>({
      query: (id) => ({
        url: `/${id}`,
        method: "DELETE",
      }),
      onQueryStarted(id, { dispatch, queryFulfilled }) {
        // Optimistic update
        const patchResult = dispatch(
          todoApi.util.updateQueryData("getTodos", undefined, (draft) => {
            const index = draft.findIndex((t) => t.id === id);
            if (index !== -1) {
              draft.splice(index, 1);
            }
          })
        );

        queryFulfilled.catch(() => {
          patchResult.undo();
        });
      },
    }),
  }),
});

export const {
  useGetTodosQuery,
  useAddTodoMutation,
  useUpdateTodoMutation,
  useDeleteTodoMutation,
} = todoApi;
