import { Service } from "../abstract/Service";
import { Account } from "../interfaces/Account";
import { logger } from "../middlewares/log";
import { accountModel } from "../orm/schemas/accountSchemas";
import { Document } from "mongoose";
import { MongoDB } from "../utils/MongoDB";
import { DBResp } from "../interfaces/DBResp";
import { resp } from "../utils/resp";

export class UserService extends Service {

    /**
     * 新增帳戶
     * @param info 帳戶資訊
     * @returns resp
     */
    public async insertOne(info: Account): Promise<resp<DBResp<Account> | undefined>> {
        const resp: resp<DBResp<Account> | undefined> = {
            code: 200,
            message: "",
            body: undefined
        };

        try {
            const existingAccount = await accountModel.findOne({ id: info.id });
            if (existingAccount) {
                resp.code = 403;
                resp.message = "Account already exists";
            } else {
                const newAccount = new accountModel(info);
                resp.body = await newAccount.save();
                resp.message = "Account created successfully";
            }
        } catch (error) {
            resp.code = 500;
            resp.message = `Server error: ${(error as Error).message}`;
        }

        return resp;
    }

    /**
     * 刪除帳戶
     * @param id 帳戶ID
     * @returns resp
     */
    public async deleteById(id: number): Promise<resp<DBResp<Account> | undefined>> {
        const resp: resp<DBResp<Account> | undefined> = {
            code: 200,
            message: "",
            body: undefined
        };

        try {
            const res = await accountModel.deleteOne({ id: id });
            if (res.deletedCount === 0) {
                resp.code = 404;
                resp.message = "Account not found";
            } else {
                resp.message = "Account deleted successfully";
                resp.body = res;
            }
        } catch (error) {
            resp.code = 500;
            resp.message = `Server error: ${(error as Error).message}`;
        }

        return resp;
    }

    /**
     * 查詢所有帳戶
     * @returns resp
     */
    public async getAllAccounts(): Promise<resp<Array<DBResp<Account>> | undefined>> {
        const resp: resp<Array<DBResp<Account>> | undefined> = {
            code: 200,
            message: "",
            body: undefined
        };

        try {
            const res: Array<DBResp<Account>> = await accountModel.find({});
            resp.body = res;
            resp.message = "Accounts retrieved successfully";
        } catch (error) {
            resp.code = 500;
            resp.message = `Server error: ${(error as Error).message}`;
        }

        return resp;
    }

    /**
     * 更新帳戶餘額
     * @param id 帳戶ID
     * @param balance 新餘額
     * @returns resp
     */
    public async updateBalanceById(id: number, balance: number): Promise<resp<DBResp<Account> | undefined>> {
        const resp: resp<DBResp<Account> | undefined> = {
            code: 200,
            message: "",
            body: undefined
        };

        try {
            const account = await accountModel.findOne({ id: id });
            if (account) {
                account.balance = balance;
                await account.save();
                resp.body = account;
                resp.message = "Balance updated successfully";
            } else {
                resp.code = 404;
                resp.message = "Account not found";
            }
        } catch (error) {
            resp.code = 500;
            resp.message = `Server error: ${(error as Error).message}`;
        }

        return resp;
    }
}