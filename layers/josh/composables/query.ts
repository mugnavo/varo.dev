import { acceptHMRUpdate, defineStore, storeToRefs } from "pinia";
import { ref } from "vue";
import * as yup from "yup";
import type {
	ConfirmParams,
	QueryInfer,
	QueryState,
} from "../components/DynamicForm/types";

export interface QueryClosures {
	show: (state: QueryState) => void;
}

const useQueryStore = defineStore("query", () => {
	const closures = ref<Partial<QueryClosures>>({});
	return { closures };
});

export const useQuery = (args?: QueryState) => {
	const store = useQueryStore();
	const { closures } = storeToRefs(store);

	// Executed when query is loaded, should be used to initialize closures
	const __load__ = (cbs: Partial<QueryClosures>) => {
		closures.value = cbs;
	};

	const ask = <Schema extends yup.AnyObject = Record<string, never>>(
		params: ConfirmParams<Schema>,
	): Promise<
		(Schema extends Record<string, never> ? true : QueryInfer<Schema>) | null
	> => {
		return new Promise((resolve, reject) => {
			if (closures.value.show) {
				closures.value.show(
					Object.assign(
						<QueryState>{
							approveText: "Confirm",
							rejectText: "Cancel",
							approve: (data) => {
								resolve(
									data as Schema extends Record<string, never>
										? true
										: QueryInfer<Schema>,
								);
							},
							confirm: () => {
								resolve(
									true as Schema extends Record<string, never>
										? true
										: QueryInfer<Schema>,
								);
							},
							reject: () => {
								resolve(null);
							},
						},
						args || {},
						params,
					),
				);
			} else {
				reject(new Error("No show closure found"));
			}
		});
	};

	return {
		__load__,
		ask,
	};
};
