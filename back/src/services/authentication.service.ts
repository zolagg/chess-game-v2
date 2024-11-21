import { User } from "../models/user.model"; // Modèle Sequelize
import jwt from "jsonwebtoken"; // Pour générer le JWT
import { Buffer } from "buffer"; // Pour décoder Base64
import { notFound } from "../error/NotFoundError";

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret_key"; // Clé secrète pour signer le token

export class AuthenticationService {
  public async authenticate(
    username: string,
    password: string
  ): Promise<string> {
    // Recherche l'utilisateur dans la base de données
    const user = await User.findOne({ where: { username } });

    if (!user) {
      throw notFound("User");
    }

    // Encode the incoming password to compare with stored password
    const encodedPassword = Buffer.from(password).toString('base64');

    // Compare encoded passwords
    if (encodedPassword === user.password) {
      // Si l'utilisateur est authentifié, on génère un JWT
      const token = jwt.sign(
        {
          username: user.username,
          id: user.id,
        },
        JWT_SECRET,
        { expiresIn: "1h" }
      );
      return token;
    } else {
      let error = new Error("Wrong password");
      (error as any).status = 403;
      throw error;
    }
  }
}

export const authService = new AuthenticationService();
