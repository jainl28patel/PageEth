import express, { Express, Request, Response } from "express";
import { initialize, getKeyringFromSeed } from "avail-js-sdk"
import { ISubmittableResult } from "@polkadot/types/types/extrinsic"
import { H256 } from "@polkadot/types/interfaces/runtime"
import config from "../config/config";

const router = express.Router();

router.post("/store_msg", async(req: Request, res: Response) => {
    try {

        // initialize context
        const api = await initialize(config.endpoint)
        const account = getKeyringFromSeed(config.seed)
        const appId = config.appId === 0 ? 1 : config.appId

        const options = { app_id: appId, nonce: -1 }

        // get data from request
        const data = req.body.data

        console.log(data);

        const txResult = await new Promise<ISubmittableResult>((res) => {
            api.tx.dataAvailability.submitData(data).signAndSend(account, options, (result: ISubmittableResult) => {
                console.log(`Tx status: ${result.status}`)
                if (result.isFinalized || result.isError) {
                    res(result)
                }
            })
        })
      
        // Rejected Transaction handling
        if (txResult.isError) {
            res.status(404).send("Unable to submit data")
            return
        }
      
        const [txHash, blockHash] = [txResult.txHash as H256, txResult.status.asFinalized as H256]
    
        // Failed Transaction handling
        const error = txResult.dispatchError
        if (error != undefined) {
            if (error.isModule) {
                const decoded = api.registry.findMetaError(error.asModule)
                const { docs, name, section } = decoded
                console.log(`${section}.${name}: ${docs.join(" ")}`)
            } else {
                console.log(error.toString())
            }
            res.status(404).send("Transaction failed")
        }

        // send json response
        res.status(200).json({
            txHash: txHash.toString(),
            blockHash: blockHash.toString()
        })

    } catch (err) {
        res.status(404).send(err);
    }
})

router.get("/get_proof", async(req: Request, res: Response) => {
    try {
        const blockHash = req.body.blockHash

        // initialize endpoint
        const api = await initialize(config.endpoint)
        const rpc: any = api.rpc
        const proof = await rpc.kate.queryProof([{ row: 0, col: 0 }], blockHash)
        console.log("proof done ", proof)
        res.status(200).send(proof)

    } catch (err) {
        res.status(404).send(err);
    }
})

router.get("/get_msg", async(req: Request, res: Response) => {
    try {
        const blockHash = req.body.blockHash as string
        const txHash = req.body.txHash

        console.log(blockHash, txHash)

        // initialize endpoint
        const api = await initialize(config.endpoint)
        console.log("api done")
        const block = await api.rpc.chain.getBlock(blockHash)
        console.log("block done")

        // ERROR Below line
        const tx = block.block.extrinsics.find((tx) => tx.hash.toHex() == txHash)
        console.log("tx done")

        if (tx) {
            const dataHex = tx.method.args.map((a:any) => a.toString()).join(", ")
            // Data retrieved from the extrinsic data
            let str = ""
            for (let n = 0; n < dataHex.length; n += 2) {
                str += String.fromCharCode(parseInt(dataHex.substring(n, n + 2), 16))
            }

            // send json response
            res.status(200).json({
                data: str
            })
        } else {
            res.send("Transaction not found")
        }

    } catch (err) {
        res.status(404).send(err);
    }
})

export default router;