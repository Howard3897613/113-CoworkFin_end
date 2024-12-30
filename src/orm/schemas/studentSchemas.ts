import { model, Schema } from "mongoose";
import { Account } from "../../interfaces/Account";

export const accountSchema = new Schema<Account>({
    year: { type: Number, required: true },
    month: { type: Number, required: true },
    day: { type: Number, required: true },
    hour: { type: Number, required: true },
    state: { type: Number, required: true },
    balance: { type: Number, required: true },
    category: { type: String, required: true },
    note: { type: String, required: true }
});

export const accountModel = model<Account>('account', accountSchema);