import axios, { AxiosInstance } from "axios";
import {
  LoginResponsePreTransform,
  loginPayloadSchema,
  loginResponseSchema,
} from "./types/login.dto";
import type { LoginPayload, LoginResponse } from "./types/login.dto";

export const api = axios.create({
  baseURL: "http://localhost:3000",
  withCredentials: true,
});

export class ApiService {
  constructor(private api: AxiosInstance) {}

  public async login(payload: LoginPayload): Promise<LoginResponse> {
    const { email, password } = loginPayloadSchema.parse(payload);

    const response = await this.api.post<LoginResponsePreTransform>(
      "/auth/login",
      { email, password }
    );

    return loginResponseSchema.parse(response.data);
  }

  public async logout(): Promise<void> {
    await this.api.post<void>("/auth/logout");
  }

  public async reg
}
