import { Router, Request, Response, NextFunction } from "express";
import * as flash from "node-twinkle";

import { ImageController } from "../core/ImageController";
import { InvalidParameterError } from "../core/errors/InvalidParameterError";

// TODO: rethink the name for this "router" function, since it's not really an Express router (no longer being "use()"ed inside Express)
export class ImageRouter {
  router: Router;
  jeu: ImageController; // contrôleur GRASP

  /**
   * Initialize the Router
   */
  constructor() {
    this.jeu = new ImageController(); // init contrôleur GRASP
    this.router = Router();
    this.init();
  }

 


  /**
   * Take each handler, and attach to one of the Express.Router's
   * endpoints.
   */
  init() {
    // this.router.post("/demarrerJeu", this.demarrerJeu.bind(this)); 
  }
}

// exporter its configured Express.Router
export const imageRoutes = new ImageRouter();
imageRoutes.init();
