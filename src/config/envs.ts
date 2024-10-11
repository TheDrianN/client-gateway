import 'dotenv/config';

import * as joi from 'joi'
import { env } from 'process';

interface EnvVars{
    PORT: number;
    USERS_MICROSERVICE_HOST: string;
    USERS_MICROSERVICE_PORT : number;
    VOTING_MICROSERVICE_HOST: string;
    VOTING_MICROSERVICE_PORT : number;
    ELECTIONS_MICROSERVICE_HOST: string;
    ELECTIONS_MICROSERVICE_PORT : number;
    CANDIDATES_MICROSERVICE_HOST: string;
    CANDIDATES_MICROSERVICE_PORT : number;
    AUTH_MICROSERVICE_HOST: string;
    AUTH_MICROSERVICE_PORT : number;
}

const envsSchema = joi.object({
    PORT: joi.number().required(),
    USERS_MICROSERVICE_HOST: joi.string().required(),
    USERS_MICROSERVICE_PORT : joi.number().required(),
    VOTING_MICROSERVICE_HOST: joi.string().required(),
    VOTING_MICROSERVICE_PORT : joi.number().required(),
    ELECTIONS_MICROSERVICE_HOST: joi.string().required(),
    ELECTIONS_MICROSERVICE_PORT : joi.number().required(),
    CANDIDATES_MICROSERVICE_HOST: joi.string().required(),
    CANDIDATES_MICROSERVICE_PORT : joi.number().required(),
    AUTH_MICROSERVICE_HOST: joi.string().required(),
    AUTH_MICROSERVICE_PORT : joi.number().required(),
})


.unknown(true);

const {error, value} = envsSchema.validate(process.env);

if (error){
    throw new Error(`Config validation error: ${error.message}`);
}

const EnvVars: EnvVars = value;

export const envs = {
    port: EnvVars.PORT,
    usersMicroservicesHost: EnvVars.USERS_MICROSERVICE_HOST,
    usersMicroservicesPort: EnvVars.USERS_MICROSERVICE_PORT,
    votingMicroservicesHost: EnvVars.VOTING_MICROSERVICE_HOST,
    votingMicroservicesPort: EnvVars.VOTING_MICROSERVICE_PORT,
    electionsMicroservicesHost: EnvVars.ELECTIONS_MICROSERVICE_HOST,
    electionsicroservicesPort: EnvVars.ELECTIONS_MICROSERVICE_PORT,
    candidatesMicroservicesHost: EnvVars.CANDIDATES_MICROSERVICE_HOST,
    candidatesMicroservicesPort: EnvVars.CANDIDATES_MICROSERVICE_PORT,
    authMicroservicesHost: EnvVars.AUTH_MICROSERVICE_HOST,
    authMicroservicesPort: EnvVars.AUTH_MICROSERVICE_PORT,
};
