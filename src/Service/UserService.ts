import { Service } from "../abstract/Service";
import { Account } from "../interfaces/Account";
import { logger } from "../middlewares/log";
import { accountModel } from "../orm/schemas/accountSchemas";
import { Document } from "mongoose";
import { MongoDB } from "../utils/MongoDB";
import { DBResp } from "../interfaces/DBResp";
import { resp } from "../utils/resp";

export class UserService extends Service {

    public async getAllDatas(): Promise<Array<DBResp<Account>> | undefined> {
        try {
            const res: Array<DBResp<Account>> = await accountModel.find({});
            return res;
        } catch (error) {
            return undefined;
        }
    }

    /**
     * 新增帳戶
     * @param info 帳戶資訊
     * @returns resp
     */
    public async insertOne(info: Account): Promise<resp<DBResp<Account> | undefined>> {

        const current = await this.getAllDatas();
        const resp: resp<DBResp<Account> | undefined> = {
            code: 200,
            message: "",
            body: undefined
        };

        if (current && current.length > 0) {
            try {
                if (current.length >= 200) {
                    resp.message = "account list is full";
                    resp.code = 403;
                } else {
                    info.id = current.length + 1;
                    const res = new accountModel(info);
                    resp.body = await res.save();
                    resp.message = "account added successfully";
                }
            } catch (error) {
                resp.message = "server error";
                resp.code = 500;
            }
        } else {
            resp.message = "server error";
            resp.code = 500;
        }

        return resp;
    }

    public async deleteById(id: number) {

        const resp: resp<any> = {
            code: 200,
            message: "",
            body: undefined
        };

        try {
            const res = await accountModel.deleteOne({ id: id });
            resp.message = "success";
            resp.body = res;
        } catch (error) {
            resp.message = error as string;
            resp.code = 500;
        }

        return resp;
    }

    public async updateBalanceById(id: number, balance: number) {

        const resp: resp<DBResp<Account> | undefined> = {
            code: 200,
            message: "",
            body: undefined,
        };

        const account = await accountModel.findOne({ id: id });

        if (account) {
            try {
                account.balance = balance;
                await account.save();
                resp.body = account;
                resp.message = "update success";
            } catch (error) {
                resp.code = 500;
                resp.message = "server error";
            }
        } else {
            resp.code = 404;
            resp.message = "account not found";
        }

        return resp;
    }
}