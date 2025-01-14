import { Contorller } from "../abstract/Contorller";
import { Request, response, Response } from "express";
import { UserService } from "../Service/UserService";
import { resp } from "../utils/resp";
import { DBResp } from "../interfaces/DBResp";
import { Student } from "../interfaces/Student";
require('dotenv').config()

export class UserController extends Contorller {
    protected service: UserService;

    constructor() {
        super();
        this.service = new UserService();
    }

    public async findAll(Request: Request, Response: Response) {

        const res: resp<Array<DBResp<Student>> | undefined> = {
            code: 200,
            message: "",
            body: undefined
        }

        const dbResp = await this.service.getAllStudents();
        if (dbResp) {
            if (dbResp.length == 0) {
                res.body = dbResp;
                res.message = "no data";
                Response.send(res);
            } else {
                res.body = dbResp;
                res.message = "find sucess";
                Response.send(res);
            }
        } else {
            res.code = 500;
            res.message = "server error";
            Response.status(500).send(res);
        }

    }

    public async insertOne(Request: Request, Response: Response) {
        const resp = await this.service.insertOne(Request.body)
        Response.status(resp.code).send(resp)
    }

    public async deleteById(Request: Request, Response: Response) {
        const resp = await this.service.deleteById(Request.query.id as string);
        Response.status(resp.code).send(resp);
    }
    
    public async updateBalanceById(Request: Request, Response: Response) {
    
        const resp = await this.service.updateBalanceById(Request.query.id as string,Request.query.id as string);
        Response.status(resp.code).send(resp);
    }    
}