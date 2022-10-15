import {config} from './config';
import {signIn} from "./query/signin";
import {job as userJob} from "./listeners/current-user";


if (config?.credentials) {
    signIn().then(token => {
        if (config.credentials) {
            config.credentials.jwt = token;
        }
    });
}

userJob.start();

