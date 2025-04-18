import { CardBasicModel, CardModel } from "../../models/models";

import { IAbstractService } from "./iabstract.service";

export interface ICardService extends IAbstractService<CardModel> {
	findAllBasic(): Promise<CardModel[]>;
}
