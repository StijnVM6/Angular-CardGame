import { DeckModel, DeckWithCardsModel } from "../../models/models";
import { Request, Response } from "express";
import { controller, httpDelete, httpGet, httpPost, httpPut, request, response } from "inversify-express-utils";

import { IDeckService } from "../../interfaces/services/idecks.service";
import SERVICES_TYPES from "../../interfaces/services/service.types";
import { inject } from "inversify";

@controller("/api/decks")
export class DecksController {
	constructor(@inject(SERVICES_TYPES.DecksService) private readonly decksService: IDeckService) {}

	@httpGet("")
	public async getAll(@request() req: Request, @response() res: Response): Promise<void> {
		try {
			console.log("[GET] /api/decks");
			const values: DeckModel[] = await this.decksService.findAll();
			res.status(200).send(values);
		} catch (error: any) {
			console.error("Error : ", error);
			res.status(500).send({ message: error.message });
		}
	}

	@httpGet("/:id")
	public async getById(@request() req: Request, @response() res: Response): Promise<void> {
		try {
			const id: string = req.params.id;
			console.log(`[GET] /api/decks/${id}`);
			const value: DeckWithCardsModel = await this.decksService.findCompleteById(id);
			res.status(200).send(value);
		} catch (error: any) {
			console.error("Error : ", error);
			res.status(500).send({ message: error.message });
		}
	}

	@httpPost("")
	public async create(@request() req: Request, @response() res: Response): Promise<void> {
		try {
			const deck: Partial<DeckModel> = req.body;
			console.log("[POST] /api/decks", deck);
			const createdDeck: DeckModel = await this.decksService.create(deck);
			res.status(200).send(createdDeck);
		} catch (error: any) {
			console.error("Error : ", error);
			res.status(500).send({ message: error.message });
		}
	}

	@httpPut("")
	public async update(@request() req: Request, @response() res: Response): Promise<void> {
		try {
			const deck: DeckModel = req.body;
			console.log("[PUT] /api/decks", deck);
			const updatedDeck: DeckModel = await this.decksService.update(deck);
			res.status(200).send(updatedDeck);
		} catch (error: any) {
			console.error("Error : ", error);
			res.status(500).send({ message: error.message });
		}
	}

	@httpDelete("/:id")
	public async delete(@request() req: Request, @response() res: Response): Promise<void> {
		try {
			const id: string = req.params.id;
			console.log(`[DEL] /api/decks/${id}`);
			await this.decksService.delete(id);
			res.status(200).send();
		} catch (error: any) {
			console.error("Error : ", error);
			res.status(500).send({ message: error.message });
		}
	}
}
