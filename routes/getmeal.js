
const axios = require('axios');
const cheerio = require('cheerio');

async function getmeal(req, res) {
    await axios.get('https://school.busanedu.net/bsnamil-h/main.do').then(html => {
        let HTMLList = [];
        const $ = cheerio.load(html.data);
        const bodyList = $('div.widgDiv.meal_menu1095 ul').children('li');
    
        bodyList.each(function(i, elem) {
            HTMLList[0] = {
                kcal: $(this)
                    .find('dt.kcal span')
                    .text(),
                meal: $(this)
                    .find('dd.meal_list')
                    .text()
            };
        });
        return HTMLList;
    }).then(HTMLList => {
        return res.render('meal', {
            username: (req.user) ? req.user.username : '',
            kcal: (HTMLList[0].kcal) ? `${HTMLList[0].kcal.slice(0,-4)}` : '',
            meal: (HTMLList[0].meal) ? HTMLList[0].meal.replace(/[0-9]/g,'').replace(/\./g,'').replace(/\n/g,'<br/>') : '급식 없음',
        });
    });
}

module.exports = { getmeal };
