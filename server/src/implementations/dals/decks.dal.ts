import { DeckModel } from "../../models/models";

import { AbstractDal } from "./abstract.dal";
import { injectable } from "inversify";

@injectable()
export class DecksDal extends AbstractDal<DeckModel> {
	protected dataFolderName: string = "decks";
}
