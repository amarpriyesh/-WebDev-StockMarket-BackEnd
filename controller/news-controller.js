import axios from 'axios';
import {response} from "express";
import News from "../models/news-model.js";
import * as NewsDao from "../daos/news-dao.js"



const NewsController = (app) => {
    let currentUser = null;

    const findAllNews = async (req, res) => {
        let data
        let curentPage = 1
        if(req.query.page != null && req.query.pattern == null ){
            data = await NewsDao.findAllNews()
            curentPage=req.query.page
        }
        else
        {
            data = await NewsDao.findNewsByPattern(req.query.pattern)
            curentPage=req.query.page
        }


        const pageLength = 5

        const totalPage = Math.ceil(data.length/pageLength)

        let tmpNews=[]
        for(let i=(curentPage-1)*pageLength;i<(pageLength*curentPage) && i<(data.length);i++){
            tmpNews.push(data[i])
        }
        const finalData={"currentPage":curentPage,"totalPage":totalPage,"data":tmpNews}
        res.json(finalData);
    };

    const createNews = async (req, res) => {
        const news = req.body;
        // tuits.push({ ...tuit, id: new Date().getTime() });
        const newNews = await NewsDao.createNews(news);
        res.json(newNews);
    };

    const findNewsByID = async (req, res) => {
        const data = await NewsDao.findNewsById(req.params.id)
        res.json(data);
    };

    const findNewsByPattern = async (req, res) => {
        const data  = await NewsDao.findNewsByPattern(req.query.pat)
        res.json(data);
    };

    app.post("/api/news", createNews);
    app.put("/api/news", findAllNews);
    app.get("/api/news/:id", findNewsByID);
    app.put("/api/news/pattern", findNewsByPattern);


};









export default NewsController;
