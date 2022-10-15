import {config} from "../config";
import {signLimitOrder} from "@sorare/crypto";

function signWithStarkKey(limitOrders: any) {
    if (config?.credentials?.starkwareKey) {
        let starkKey = config.credentials.starkwareKey;
        return limitOrders.map((limitOrder: any) => ({
            data: JSON.stringify(signLimitOrder(starkKey, limitOrder)),
            nonce: limitOrder.nonce,
            expirationTimestamp: limitOrder.expirationTimestamp,
            starkKey: starkKey,
        }));
    }
    return false;
}

export {signWithStarkKey}