import axios from 'axios';
import {response} from "express";
import News from "../models/news-model.js";
import views from "../views/views.js"
import * as ViewsDao from "../daos/views-dao.js";
import {updateView} from "../daos/views-dao.js";



const ViewsController = (app) => {
    let currentUser = null;

    const findAllViews = async (req, res) => {

        console.log("reaching here in views")
        const data = await ViewsDao.findAllViews()
        res.json(data);
        //res.json(views);
    };

    const createView = async (req, res) => {
        const news = req.body;
        // tuits.push({ ...tuit, id: new Date().getTime() });
        const newNews = await ViewsDao.createView(news);
        res.json(newNews);
    };


    const deleteView = async (req, res) => {
        const viewIdToDelete = req.params.id;
        const status = await ViewsDao
            .deleteView(viewIdToDelete);
        res.json(status);
    };

    const updateView = async (req, res) => {
        const status = await ViewsDao.updateView(req.params.id, req.body);
        res.send(status);
    };

    app.post("/api/views", createView);
    app.get("/api/views", findAllViews);
    app.delete("/api/views/:id", deleteView);
    app.put("api/views/:id", updateView);
};


export default ViewsController;
