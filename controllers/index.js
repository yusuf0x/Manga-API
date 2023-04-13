const axios = require('axios'); 
const cheerio = require('cheerio'); 
var FormData = require('form-data');
const { json, errorJson } = require("../utils/response");


exports.popular = async (req,res) => {
    let page = req.query.page;
    console.log(page);
    if(page==undefined || page == null) page = 0;
    await axios.get(`https://www.readm.org/popular-manga/${page}`) 
	.then(({ data }) => { 
		const $ = cheerio.load(data); 
        let tags = [];
        let data1 = [];
        const result = [];
        $('.mb-lg').each(function(index,element){
            const link = $(element).find('.poster-with-subject>a').attr('href');
            const title = $(element).find('.poster-with-subject>a').attr('title');
            const img = $(element).find('.poster-with-subject>a>img').attr('src');
            const descr = $(element).find('.poster-with-subject>.subject>.desktop-only').text().trim();
            const tag = $(element).find('.poster-with-subject>.subject>.subject-title>div>.poster-meta>.genres>a');
            const table = $(element).find('.media-meta>.ui>tbody>tr>td');
            table.each((index,element)=> {
                 data1.push($(element).find('div').last().text().trim());
            })
            tag.each((index,element)=> {
                tags.push($(element).text().trim());
            })
            result.push({
                title:title,
                link:link,
                descr:descr,
                img:img,
                tags:tags,
                info : {
                    rank : data1[0],
                    type:data1[1],
                    subscribers:data1[2],
                    rating:data1[3],
                    views:data1[4],
                }
            });
            data1 = [];
            tags=[];
        });
        return json(res,result);
}).catch(err => {
    return errorJson(res,err);
});

};
exports.chapters = async (req,res) => {
    await axios.get('https://www.readm.org/manga/martial-peak') 
	.then(({ data }) => { 
		const $ = cheerio.load(data);
        let results=[];
        $(".episodes-box").find("[class='ui basic unstackable table']").each((index,element)=> {
            const title = $(element).find('a').text().trim();
            const url = $(element).find('a').attr('href');
            const publication = $(element).find(".episode-date").text().trim();
            // console.log(title,url,publication);
            results.push({
                title  : title,
                url : url,
                publication:publication
            })
        });
        return json(res,results);
    }).catch( err => {
        return errorJson(res,err);
});
};
exports.pages = async (req,res) => {
    await axios.get('https://www.readm.org/manga/martial-peak/2748/all-pages') 
	.then(({ data }) => { 
		const $ = cheerio.load(data);
        let results = [];
        $("[class='img-responsive scroll-down']").each((index,element)=>{
            const url = $(element).attr('src');
            console.log(url);
            results.push({
                url:url
            })
        });
        // console.log(req);
        return json(res,results);
    }).catch(err => {
        return errorJson(res,err);
    });
};
exports.search = async (req,res) => {
    // res.send("search");
    let item  = req.body.phrase;
    if(item != undefined || item != null){
        var bodyFormData = new FormData();
        bodyFormData.append("dataType", "json");
        bodyFormData.append("phrase", `${item}`);
        await axios({
        method: "post",
        url: "https://www.readm.org/service/search",
        data: bodyFormData,
        headers: {"X-Requested-With":"XMLHttpRequest","Cache-Control":"public max-age=604800", "Content-Type": "application/x-www-form-urlencoded", "Accept": "application/json, text/javascript, */*; q=0.01" },
        }).then(function (response) {
            console.log("In success");
            console.log(response.data);
            return json(res,response.data.manga);
        })
        .catch(function (error) {
            console.log("In failure");
            return errorJson(res,error);
        });
    }else{
        return errorJson(res,"you need to add phrase")
    }
};