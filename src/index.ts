// ***
// API CONTRACTS
// Type definitions to ensure type matches between client and server.
// ***

// The Contract type allows you to define the types used for requests and
// responses.
//
// You should define a Contract to be used by the types that follow.
export type Contract<TReqParams, TReqBody, TResBody> = {
  requestParams?: TReqParams;
  requestBody?: TReqBody;
  responseBody?: TResBody;
};

// ***
// CLIENT TYPES
// ***

// A client request function should have methods that match the
// ClientContract<Contract> type.
export type ClientContract<
  TContract extends Contract<TReqParams, TReqBody, TResBody>,
  TReqParams = TContract["requestParams"],
  TReqBody = TContract["requestBody"],
  TResBody = TContract["responseBody"]
> = (request: TReqParams & TReqBody) => Promise<TResBody>;

// ***
// SERVER TYPES
// ***

// APIRequest is a version of express's Request type, but made generic
// so we can specify the types from a Contract.
type APIRequest<TParams, TBody> = {
  params: TParams;
  body: TBody;
};

// APIResponse is a version of express's Response type, but made generic
// so we can specify the types from a Contract.
type APIResponse<TBody> = {
  send(body: TBody): void;
  sendStatus(code: number): void;
  status(code: number): APIResponse<TBody>;
};

// An API route handler should match the APIContract<Contract> type.
export type APIContract<
  TContract extends Contract<TReqParams, TReqBody, TResBody>,
  TReqParams = TContract["requestParams"],
  TReqBody = TContract["requestBody"],
  TResBody = TContract["responseBody"]
> = (req: APIRequest<TReqParams, TReqBody>, res: APIResponse<TResBody>) => void;
