function toCEth(wei: string | undefined) {
    if(!wei || wei === "0") {
        return 0;
    }
    return parseInt(wei.substring(0, wei.length - 14));
}

function toWei(ceth: number) {
    return ceth + "00000000000000";
}

function log(context: string, s: string) {
    console.log(`[${new Date().toLocaleTimeString()}][${context}] ${s}`);
}


function sleep(ms: number) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}

export {toCEth, toWei, log, sleep};