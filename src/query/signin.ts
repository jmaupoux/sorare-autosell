import {gql, GraphQLClient} from "graphql-request";
import {config} from "../config";
import {anonymous} from "./client";


const SignIn = gql`
    mutation SignInMutation($input: signInInput!) {
        signIn(input: $input) {
            currentUser {
                slug
                jwtToken(aud: "autosell") {
                    token
                    expiredAt
                }
                favoritePlayers {
                    slug
                }
            }
            errors {
                message
            }
        }
    }
`;

const graphQLClient = anonymous();

function signIn() {

    console.log("[setup] sign in");

    let input = {
        "input": {
            "email": config?.credentials?.email,
            "password": config?.credentials?.passhash
        }
    };

    return graphQLClient.request(SignIn, input).then(v => {
        return v.signIn.currentUser.jwtToken.token;
    });
};

export {signIn};