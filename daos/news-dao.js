import NewsModel from "../models/news-model.js";
import client from "../redisClient.js"







export const findAllNews = async () => {

    async function fetchNewsFromDB() {
        const fetchedNews = await NewsModel.find().sort({ time: 'desc' });
        return fetchedNews;
    }
    let news = ""
    news = await  client.get('news').catch(a => console.log(a))
    if (news) {
        console.log("from memory")
        return JSON.parse(news)
    }
    else {
        console.log("from database")
        news = await fetchNewsFromDB();
       await client.set('news', JSON.stringify(news), 'EX', 3600)
    }
   return news
};
export const findNewsById = async (id) => {
    const news = await NewsModel.findById(id);
    return news;
};

export const deleteNews = async (id) => {
    const status = await NewsModel.deleteOne({ _id: id });
    return status;
};

export const createNews = async (news) => {
    const newNews = await NewsModel.create(news);
    return newNews;
};

export const findNewsByPattern = async (pattern) => {
    if(pattern!=null){
    const news = await NewsModel.find( {$or:[{"symbol":{$regex: `.*${pattern}.*`, $options: 'i'}},{"company":{$regex: `.*${pattern}.*`, $options: 'i'}},{"description":{$regex: `.*${pattern}.*`, $options: 'i'}},{"industry":{$regex: `.*${pattern}.*`, $options: 'i'}},{"title":{$regex: `.*${pattern}.*`, $options: 'i'}}]});
        return news;
    }{
        const news = await findAllNews()
        return news;
    }


};


