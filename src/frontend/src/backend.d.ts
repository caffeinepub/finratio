import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Snapshot {
    id: string;
    eps: number;
    sharePrice: number;
    totalAssets: number;
    ebitda: number;
    revenue: number;
    interestExpense: number;
    currentAssets: number;
    bookValuePerShare: number;
    grossProfit: number;
    marketCap: number;
    cogs: number;
    ebit: number;
    inventory: number;
    name: string;
    currentLiabilities: number;
    totalEquity: number;
    enterpriseValue: number;
    netIncome: number;
}
export interface UserProfile {
    name: string;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addBookmark(ratioId: string): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    deleteSnapshot(id: string): Promise<void>;
    getBookmarks(): Promise<Array<string>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getSnapshots(): Promise<Array<Snapshot>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    removeBookmark(ratioId: string): Promise<void>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    saveSnapshot(snapshot: Snapshot): Promise<void>;
}
