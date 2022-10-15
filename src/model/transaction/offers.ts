import {log, toCEth} from "../../utils";
import {config} from "../../config";
import crypto from "crypto";
import {signWithStarkKey} from "../../transaction/starkLimitOrders";
import {gql, GraphQLClient} from "graphql-request";
import {logged} from "../../query/client";


const NewOfferLimitOrders = gql`
    mutation NewOfferLimitOrders($input: prepareOfferInput!) {
        prepareOffer(input: $input) {
            limitOrders {
                amountBuy
                amountSell
                expirationTimestamp
                nonce
                tokenBuy
                tokenSell
                vaultIdBuy
                vaultIdSell
            }
            errors {
                message
            }
        }
    }
`;

const CreateSingleSaleOffer = gql`
    mutation CreateSingleSaleOffer($input: createSingleSaleOfferInput!) {
        createSingleSaleOffer(input: $input) {
            offer {
                id
            }
            errors {
                message
            }
        }
    }
`;


async function singleSaleTokenOffer(token: TokenSale) : Promise<boolean> {

    log("currentUser", `selling ${token.senderSide.nfts[0].slug} for ${toCEth(token.priceWei)}`)

    const graphQLClient = logged();

    const prepareOfferInput = {
        type: "SINGLE_SALE_OFFER",
        sendAssetIds: [token.senderSide.nfts[0].assetId],
        receiveAssetIds: [],
        sendWeiAmount: "0",
        receiveWeiAmount: token.priceWei,
        receiverSlug: config?.credentials?.mySlug,
        clientMutationId: crypto.randomBytes(8).join(""),
    };

    const newOfferData: any = await graphQLClient.request(NewOfferLimitOrders, {
        input: prepareOfferInput,
    });

    const prepareOffer: any = newOfferData["prepareOffer"];
    if (prepareOffer["errors"].length > 0) {
        prepareOffer["errors"].forEach((error: any) => {
            console.error(error["message"]);
        });
        return false;
    }

    const limitOrders = prepareOffer["limitOrders"];
    if (!limitOrders) {
        console.error("You need to be authenticated to get LimitOrders.");
        return false;
    }

    const starkSignatures = signWithStarkKey(limitOrders);

    const createSingleSaleOfferInput = {
        starkSignatures,
        dealId: crypto.randomBytes(8).join(""),
        assetId: token.senderSide.nfts[0].assetId,
        price: token.priceWei,
        clientMutationId: crypto.randomBytes(8).join(""),
    };

    const createSingleSaleOfferData = await graphQLClient.request(
        CreateSingleSaleOffer,
        {input: createSingleSaleOfferInput}
    );

    const createSingleSaleOffer: any =
        createSingleSaleOfferData["createSingleSaleOffer"];

    if (createSingleSaleOffer["errors"].length > 0) {
        createSingleSaleOffer["errors"].forEach((error: any) => {
            console.error(error["message"]);
        });
        return false;
    }

    return true;

}

export {singleSaleTokenOffer};