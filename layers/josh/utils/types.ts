export type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
export type RequiredBy<T, K extends keyof T> = Partial<T> & Required<Pick<T, K>>;
export type ArrayCallback<T, R = void> = (item: T, index: number, array: T[]) => R;
export type Prettify<T> = {
    [K in keyof T]: T[K];
} & {};

//#region Nested Keys
export type NestedKeyOf<T> = T extends object
    ? {
          [K in keyof T]: K extends string ? `${K}` | `${K}.${NestedKeyOf<T[K]>}` : never;
      }[keyof T]
    : never;

// Dynamic
type DynamicPart = `${number}` | `${string}`;

type DynamicKey<T extends string> = T extends `${infer P}[${infer _}]${infer S}`
    ? `${P}${DynamicPart}${DynamicKey<S>}`
    : T;

export type DynamicNestedKeyOf<T> = T extends object
    ? {
          [K in keyof T]: K extends string
              ?
                    | DynamicKey<K>
                    | `${DynamicKey<K>}${NestedKeyOf<T[K]> extends string ? `.${NestedKeyOf<T[K]>}` : ""}`
              : never;
      }[keyof T]
    : never;

//#region Acquire Class Properties
type AnyFn = (...args: unknown[]) => unknown;

export type ClassProperties<C> = {
    [K in keyof C as C[K] extends AnyFn ? never : K]: C[K];
};

//#region List

/**Supports index removal and auto invoke delete method if found and parsing/serializing */
interface Deletable {
    remove?: () => void;
    delete?: () => void;
}
export class List<T> extends Array<T> {
    static #isDeletable = (item: unknown): item is Deletable => {
        if (item === null) return false;
        if (typeof item !== "object") return false;
        if ("delete" in item && typeof item.delete === "function") return true;
        if ("remove" in item && typeof item.remove === "function") return true;
        return false;
    };

    constructor(...items: T[]) {
        super();
        this.push(...items);
    }

    insert = (index: number, item: T) => {
        this.splice(index, 0, item);
    };

    remove(identifier: ((item: T, index: number, array: T[]) => boolean) | number) {
        const index = typeof identifier === "number" ? identifier : this.findIndex(identifier);
        if (index === -1) return;
        const [item] = this.splice(index, 1);
        if (!List.#isDeletable(item)) return;
        if (item.delete) item.delete();
        else if (item.remove) item.remove();
    }

    clear = () => this.splice(0, this.length);
}

//#region List Serial
interface Serializeable<T> {
    serialize: () => T;
}

type Parser<RuntimeObject, Serialized> =
    | ((obj: Serialized) => RuntimeObject | null)
    | ((obj: Serialized) => Promise<RuntimeObject | null>);

export class ListSerial<T extends Serializeable<Serialized>, Serialized> extends List<T> {
    #parser: Parser<T, Serialized>;

    constructor(parser: Parser<T, Serialized>) {
        super();
        this.#parser = parser;
    }

    read = async (str: string): Promise<ListSerial<T, Serialized>> => {
        try {
            const arr = JSON.parse(str) as Serialized[];
            for (const s of arr) {
                try {
                    const item = await this.#parser(s);
                    if (!item) continue;
                    this.push(item);
                } catch (e) {}
            }
        } catch (e) {}

        return this;
    };

    write = (): string => {
        try {
            const arr = this.map((obj) => obj.serialize());
            return JSON.stringify(arr);
        } catch (e) {}
        return "";
    };
}

//#region Event Emitter

type EventEmitterCB = (...params: any[]) => void;
export class EventEmitter {
    #__evs__: Record<string, EventEmitterCB[]>;
    #__any__: EventEmitterCB[];

    constructor() {
        /**
         * @protected
         */
        this.#__evs__ = {};
        this.#__any__ = [];
    }

    has(event: string) {
        return this.#__evs__[event] !== undefined;
    }

    on(event: string, cb: EventEmitterCB) {
        this.#__evs__[event] = this.#__evs__[event] || [];
        this.#__evs__[event].push(cb);
    }

    onAny(cb: EventEmitterCB) {
        this.#__any__.push(cb);
    }

    off(event: string, cb: EventEmitterCB) {
        if (!this.has(event)) return;
        // Added a check where even if two functions don't belong to the same part in the memory, as long as they do the same thing, they will be removed
        const i = this.#__evs__[event].findIndex(
            (ev) => ev === cb || ev.toString() === cb.toString(),
        );
        if (i === -1) return;
        this.#__evs__[event].splice(i, 1);
    }

    emit(event: string, ...args: any[]) {
        this.#__any__.forEach((ev) => ev(event, ...args));
        if (!this.has(event)) return;
        this.#__evs__[event].forEach((ev) => ev(...args));
    }

    renameEvent(oldEvent: string, newEvent: string) {
        if (!this.has(oldEvent)) return;
        if (newEvent === oldEvent) return;
        this.#__evs__[newEvent] = this.#__evs__[oldEvent];
        delete this.#__evs__[oldEvent];
    }
}
