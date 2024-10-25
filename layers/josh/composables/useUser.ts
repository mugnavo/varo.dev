export const useUser = () => {
    const headers = useRequestHeaders(["cookie"]) as HeadersInit;
    const { data: user } = useFetch("/api/me", { lazy: true, headers });

    return { user };
};
