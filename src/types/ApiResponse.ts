import { Massage } from "@/modal/user.modal";

export interface    ApiResponse {
    success: boolean,
    message: string,
    isAcceptingMassage?: boolean,
    messages?: Array<Massage>
}