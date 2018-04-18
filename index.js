const cheerio = require('cheerio');
const axios = require("axios");
const fs = require('fs');
const host = 'https://www.jinse.com/';
let results = {};

const getContent = async function () {
  for (let i = 1; i < 15; i++) {
    const html = await axios.get(`${host}organization_0_all_all_0_${i}`);
    const $ = cheerio.load(html.data);
    const $items = $('#app .list>a');
    const length = $items.length;
    console.log(i)
    for (let j = 0; j < length; j++) {
      const $item = $items.eq(j);
      try {
        const html = await axios.get(host + $item.attr('href'));
        const $ = cheerio.load(html.data);
        const res = [];
        $('.hotxm ul li').each(function () {
          $(this).find('svg').remove();
          const content = unescape($(this).html().replace(/\n/g, '').replace(/&#x/g, '%u').replace(/;/g, '')).split('：');
          if (content.length === 1) {
            res.push({ '地址': content[0] });
          } else {
            const obj = {};
            obj[content[0]] = content[1]
            res.push(obj);
          }

        });
        results[$item.attr('title')] = res;
      }catch(e){
        console.log(e)
      }
      
    }
  }

  let filename = "./0.json";
  fs.writeFileSync(filename, JSON.stringify(results));
}

getContent().catch(function (message) {
  // console.log(message)
});

