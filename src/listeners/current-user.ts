import {gql, GraphQLClient} from "graphql-request";
import {logged} from "../query/client";
import {CronJob} from "cron";
import {NFTS} from "../model/graphql-data";
import {singleSaleTokenOffer} from "../model/transaction/offers";
import {log, sleep} from "../utils";

const CurrentUser = gql`
    query Currentuser {
        currentUser {
            endedWithNoBuyerSingleSaleTokenOffers {
                nodes {
                    priceWei
                    status
                    senderSide {
                        ${NFTS}
                    }
                }
            }
            singleSaleTokenOffers(sortByEndDate: DESC) {
                nodes {
                    priceWei
                    status
                    senderSide {
                        ${NFTS}
                    }
                }
            }
        }
    }
`;

class CurrentUserJob {

    job?: CronJob;

    constructor() {
        log("currenUser", "setup job");
        this.job = new CronJob("0 */15 * * * *", async function () {
            const data = await logged().request(CurrentUser);

            log("currenUser", "checking resell")

            let fails = 0;
            let onSale: any = [];

            for (let i = 0; i < data["currentUser"]["singleSaleTokenOffers"]["nodes"].length; i++) {
                const token = data["currentUser"]["singleSaleTokenOffers"]["nodes"][i] as TokenSale;
                onSale[token.senderSide.nfts[0].slug] = true;
            }

            // resell
            for (let i = 0; i < data["currentUser"]["endedWithNoBuyerSingleSaleTokenOffers"]["nodes"].length; i++) {
                const token = data["currentUser"]["endedWithNoBuyerSingleSaleTokenOffers"]["nodes"][i] as TokenSale;
                if (onSale[token.senderSide.nfts[0].slug]) {
                    fails++;
                    continue;
                }

                if (fails > 10) {
                    log("currentUser", `no resell needed`);
                    break;
                }

                const res = await singleSaleTokenOffer(token);
                if (!res) {
                    fails++;
                }
                if (fails > 3) {
                    log("currentUser", `stopping resells after 3 fails`);
                    break;
                }
                await sleep(5000);
            }

        }, null, false, 'Europe/Paris');
    }

    start() {
        if (!this.job?.running) {
            log("currenUser", "running job")
            this.job?.start();
        }
    }
}

const job = new CurrentUserJob();

export {job};