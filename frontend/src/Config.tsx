import env from "react-dotenv";

type Config = {
    hostname: string
}

const config: Config = {
    hostname:  env.API_URL || "localhost:3000"
}


export default config