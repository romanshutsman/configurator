export class MessageType {
    static info: string = "info";
    static error: string = "error";
    static success: string = "success";
}

export class ApiResponse<T> {
    Result: T;
    Message: ApiMessage
}

export class ApiMessage {
    Text: string;
    Color: string;
    BgColor: string;
    IsPopup: boolean;
    Type: string;
}

