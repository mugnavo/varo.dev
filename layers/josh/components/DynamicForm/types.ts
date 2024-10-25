import * as yup from "yup";
import strUnionToStrArray from "../../utils/strUnionToStrArray";

export type QueryInfer<Schema extends yup.AnyObject> = yup.InferType<yup.ObjectSchema<Schema>>;

// Data that the Query Component will receive
export interface QueryState {
    title?: string;
    description?: string;
    approveText?: string;
    rejectText?: string;
    joinLabels?: boolean;
    schema?: yup.ObjectSchema<yup.AnyObject>;
    backdropClosing?: boolean;
    approve: (data: yup.AnyObject) => void;
    confirm: () => void;
    reject: () => void;
    /**When approving/confirming, the UI will wait for this to finish */
    then?: (data: yup.AnyObject) => Promise<void>;
}

// Data that the User has to pass to ask()
interface QueryParams<Schema extends yup.AnyObject> {
    title?: string;
    description?: string;
    schema?: yup.ObjectSchema<Schema>;
    joinLabels?: boolean;
    backdropClosing?: boolean;
    /**When approving/confirming, the UI will wait for this to finish */
    then?: (data: Schema) => Promise<void>;
}

export interface ConfirmParams<Schema extends yup.AnyObject> extends QueryParams<Schema> {
    approveText?: string;
    rejectText?: string;
    onApprove?: (data: QueryInfer<Schema>) => void;
    onCancel?: (data: QueryInfer<Schema>) => void;
}

// Schema Types
export type QuerySchemaMeta<V = any> = {
    show?: (obj: Record<string, any>) => boolean;
} & (
    | {
          type: "text" | "number" | "textarea" | "color" | "checkbox" | "password";
      }
    | {
          type: "select" | "select-btn";
          options: string[] | Record<string, any>[];
          multiple?: boolean;
          optionLabel?: string;
          optionValue?: string;
      }
    | {
          type: "time";
      }
    | {
          type: "range";
          min?: number;
          max?: number;
          step?: number;
      }
    | {
          type: "file";
          accept?: string;
          multiple?: boolean;
          show?: boolean;
          base64?: boolean;
      }
    | {
          type: "directory";
      }
    | {
          type: "chips";
          options: string[];
          empty?: string;
      }
    | {
          type: "component";
          mount(element: Element, value: V, update: (value: V) => void): void;
      }
);

export type QueryField = {
    label: string;
    key: string;
    default?: string;
    value: any;
} & QuerySchemaMeta;

export const isSchemaMeta = (obj: unknown): obj is QuerySchemaMeta => {
    if (typeof obj !== "object") return false;
    if (obj === null) return false;
    if (
        !("type" in obj && typeof obj.type === "string" && isStringAFieldType(obj.type)) &&
        !("show" in obj && typeof obj.show === "function")
    )
        return false;
    return true;
};

export const isStringAFieldType = (type: string): type is QueryField["type"] => {
    return strUnionToStrArray<QuerySchemaMeta["type"]>()(
        "color",
        "number",
        "select",
        "select-btn",
        "text",
        "textarea",
        "time",
        "range",
        "checkbox",
        "file",
        "component",
        "chips",
        "directory",
        "password"
    ).includes(type as QuerySchemaMeta["type"]);
};
