const HTMLToPDF = require('html-pdf');
const Handlebars = require('handlebars');
const fs = require('fs');
const path = require('path');

function asyncGeneratePDFStream(content) {
    return new Promise((resolve, reject) => {
        const fileBasePath = ('file://' + path.resolve('./') + '/').replaceAll('\\', '/');
        console.log(fileBasePath);
        HTMLToPDF.create(content, {
            format: 'A4',
            base: fileBasePath
        }).toStream((err, pdfStream) => {
            if (err){
                reject(err);
            } else {
                resolve(pdfStream);
            }
        });
    });
}

const asyncReadHtmlFile = async (fileName) => {
    return new Promise((resolve, reject) => {
        fs.readFile(fileName, (err, html) => {
            if (err) reject(err);
            resolve(html);
        });
    });
}

const generatePromotionReport = async (promotion) => {
    const templatePromotionReport = await asyncReadHtmlFile('controllers/promotions/template-promotion-report.handlebars');
    const template = Handlebars.compile(templatePromotionReport.toString());

    const performancePercentage = (promotion.requestedQuantities > 0) ? (+promotion.clickedQuantities/+promotion.requestedQuantities) * 100 : 0;
    const promotionData = {
        ...promotion.dataValues,
        performancePercentage: performancePercentage.toFixed(2)
    };

    const content = template({ promotion: promotionData });
    return await asyncGeneratePDFStream(content);
}

module.exports = generatePromotionReport;
