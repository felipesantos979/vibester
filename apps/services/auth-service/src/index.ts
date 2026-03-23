import app from "./app";
import { env } from "./config/env";

app.listen(env.port, () => {
    console.log(`Serviço de autenticação rodando na porta ${env.port}`);
});
