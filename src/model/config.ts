interface Credentials {
    mySlug: string;
    email: string;
    passhash: string;
    starkwareKey: string;
    jwt?: string;
}

interface Config {
    credentials?: Credentials;
}