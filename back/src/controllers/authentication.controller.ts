import { Route, Controller, Post, Body } from "tsoa";
import { AuthenticationInputDTO, RegistrationInputDTO } from "../dto/authentication.dto";
import { authService } from "../services/authentication.service";

@Route("auth")
export class AuthenticationController extends Controller {
  @Post("/")
  public async authenticate(@Body() body: AuthenticationInputDTO) {
    const { grant_type, username, password } = body;
    if (grant_type !== "password") {
      let error = new Error("Invalid grant_type");
      (error as any).status = 400;
      throw error;
    }
    const token = await authService.authenticate(username, password);
    return { token };
  }

  @Post("/register")
  public async register(@Body() body: RegistrationInputDTO) {
    const { username, password } = body;
    await authService.register(username, password);
    return { success: true, message: "Registration successful" };
  }
}
