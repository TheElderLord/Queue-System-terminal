import axios, { type AxiosResponse } from "axios";

import { BRANCHES_URL } from "./base.utils";
import type { Branch } from "@/models/branch/branch.interface";
import type { BranchLocation } from "@/models/branch/branchLocation";

export const fetchBranches = async (): Promise<Branch[]> => {
    try {
        const response: AxiosResponse<Branch[]> = await axios.get<Branch[]>(BRANCHES_URL);
        console.log("sdasd")
        return response.data;
    } catch (error) {
        console.error("Error fetching branches:", error);
        throw error; // Re-throw the error to handle it elsewhere if needed
    }
}
export const fetchBranchById = async (id:number): Promise<Branch> => {
    try {
        const response: AxiosResponse<Branch> = await axios.get<Branch>(`${BRANCHES_URL}/${id}`);
        console.log("sdasd")
        return response.data;
    } catch (error) {
        console.error("Error fetching branches:", error);
        throw error; // Re-throw the error to handle it elsewhere if needed
    }
}
export const fetchBranchLocation = async (id:number): Promise<BranchLocation> => {
    try {
        const response: AxiosResponse<BranchLocation> = await axios.get<BranchLocation>(`${BRANCHES_URL}/location/${id}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching branches:", error);
        throw error; // Re-throw the error to handle it elsewhere if needed
    }
}