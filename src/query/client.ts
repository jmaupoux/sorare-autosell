import {config} from "../config";
import {GraphQLClient} from "graphql-request/dist";

const url = "https://api.sorare.com/graphql";

let _anonymous: GraphQLClient;
let _logged: GraphQLClient;

function anonymous(): GraphQLClient {
    if (_anonymous) {
        return _anonymous;
    }
    _anonymous = new GraphQLClient(url);
    return _anonymous;
}

function logged(): GraphQLClient {
    if (_logged) {
        return _logged;
    }
    _logged = new GraphQLClient(url, {
        headers: {
            Authorization: `Bearer ${config?.credentials?.jwt}`,
            "JWT-AUD": "autosell",
        },
    });
    return _logged;
}

export {logged, anonymous};