export const useProject = (id?: MaybeRefOrGetter<number>) => {
    const route = useRoute("dashboard-id");
    const current = computed(() => route.params.id);

    const _id = isRef(id) ? id : computed(() => id || Number(current.value || -1));

    const projectStore = useProjectsStore();
    const { projects } = storeToRefs(projectStore);

    return {
        project: useArrayFind(projects, (p) => p.id === _id.value),
        update: projectStore.update,
    };
};
