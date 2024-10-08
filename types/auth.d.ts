declare module "#auth-utils" {
  interface User {
    id: number;
    username: string;
    name: string;
    email: string;
    avatar_url: string;
  }
}
export {};
