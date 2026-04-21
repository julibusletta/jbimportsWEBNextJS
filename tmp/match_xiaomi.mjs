import mongoose from 'mongoose';
import fs from 'fs';

const MONGODB_URI = 'mongodb+srv://admin:3CRVzt8trnHkhRkG@admin.j2yvyqi.mongodb.net/?appName=admin';

const supplierProducts = [
  { "code": "13826-0", "name": "ROBOT XIAOMI VACUUM 220V X20 MAX - PRETO", "price": 545.00 },
  { "code": "15552-6", "name": "ROBOT XIAOMI VACUUM S 220V BRANCO", "price": 670.00 },
  { "code": "15166-5", "name": "ROBOT XIAOMI VACUUM H40 220V - WHITE", "price": 250.00 },
  { "code": "15093-4", "name": "ROBOT XIAOMI VACUUM S40 BIVOLT BRANCO", "price": 162.00 },
  { "code": "15551-9", "name": "ROBOT XIAOMI VACUUM S40 PRO BIVOLT BRANCO", "price": 305.00 },
  { "code": "14319-6", "name": "ROBOT XIAOMI VACUUM S40C BIVOLT BRANCO", "price": 148.00 },
  { "code": "14663-0", "name": "ROBOT XIAOMI VACUUM X20 PRO WHITE 220V", "price": 475.00 },
  { "code": "13900-7", "name": "TABLET XIAOMI REDMI PAD 2 4RAM 128GB GRAPHITE GRAY 11'", "price": 149.75 },
  { "code": "13949-6", "name": "TABLET XIAOMI REDMI PAD 2 8RAM 256GB GRAPHITE GRAY 11'", "price": 205.00 },
  { "code": "14648-7", "name": "TABLET XIAOMI REDMI PAD 2 8RAM 256GB GREEN 11'", "price": 205.00 },
  { "code": "15707-0", "name": "TABLET XIAOMI REDMI PAD 2 8RAM 256GB PURPLE 11'", "price": 205.00 },
  { "code": "15605-9", "name": "TABLET XIAOMI REDMI PAD 2 PRO 6RAM/128GB PURPLE", "price": 219.00 },
  { "code": "15606-6", "name": "TABLET XIAOMI REDMI PAD 2 PRO 6RAM/128GB SILVER", "price": 219.00 },
  { "code": "15607-3", "name": "TABLET XIAOMI REDMI PAD 2 PRO 8RAM/256GB PURPLE", "price": 279.00 },
  { "code": "11644-2", "name": "TABLET XIAOMI REDMI PAD SE 4GB/128GB 8.7' BLUE", "price": 122.00 },
  { "code": "11643-5", "name": "TABLET XIAOMI REDMI PAD SE 4GB/128GB 8.7' GREEN", "price": 122.00 },
  { "code": "15523-6", "name": "XIAOMI 15T PRO 512GB 12RAM GOLD GLOBAL", "price": 739.00 },
  { "code": "12800-1", "name": "XIAOMI NOTE 14 128GB 6RAM BLACK GLOBAL", "price": 131.75 },
  { "code": "12801-8", "name": "XIAOMI NOTE 14 128GB 6RAM BLUE GLOBAL", "price": 130.00 },
  { "code": "12802-5", "name": "XIAOMI NOTE 14 128GB 6RAM GREEN GLOBAL", "price": 130.00 },
  { "code": "14684-5", "name": "XIAOMI NOTE 14 128GB 6RAM PURPLE GLOBAL", "price": 130.00 },
  { "code": "13059-2", "name": "XIAOMI NOTE 14 256GB 8RAM 5G BLACK GLOBAL", "price": 194.00 },
  { "code": "13165-0", "name": "XIAOMI NOTE 14 256GB 8RAM 5G PURPLE GLOBAL", "price": 193.75 },
  { "code": "12803-2", "name": "XIAOMI NOTE 14 256GB 8RAM BLACK GLOBAL", "price": 157.00 },
  { "code": "12804-9", "name": "XIAOMI NOTE 14 256GB 8RAM BLUE GLOBAL", "price": 157.00 },
  { "code": "12812-4", "name": "XIAOMI NOTE 14 256GB 8RAM GREEN GLOBAL", "price": 157.00 },
  { "code": "12807-0", "name": "XIAOMI NOTE 14 PRO 256GB 8RAM 5G BLACK GLOBAL", "price": 253.00 },
  { "code": "12805-6", "name": "XIAOMI NOTE 14 PRO 256GB 8RAM BLACK GLOBAL", "price": 227.75 },
  { "code": "13130-8", "name": "XIAOMI NOTE 14 PRO 512GB 12RAM 5G GREEN GLOBAL", "price": 287.75 },
  { "code": "12809-4", "name": "XIAOMI NOTE 14 PRO+ 256GB 8RAM 5G BLACK GLOBAL", "price": 267.00 },
  { "code": "12810-0", "name": "XIAOMI NOTE 14 PRO+ 256GB 8RAM 5G BLUE GLOBAL", "price": 263.00 },
  { "code": "14664-7", "name": "XIAOMI NOTE 14 PRO+ 256GB 8RAM 5G GOLD GLOBAL", "price": 263.00 },
  { "code": "13053-0", "name": "XIAOMI NOTE 14 PRO+ 256GB 8RAM 5G PURPLE GLOBAL", "price": 263.00 },
  { "code": "13366-1", "name": "XIAOMI NOTE 14S 256GB 8RAM BLACK GLOBAL", "price": 185.75 },
  { "code": "13367-8", "name": "XIAOMI NOTE 14S 256GB 8RAM BLUE GLOBAL", "price": 185.75 },
  { "code": "13423-1", "name": "XIAOMI NOTE 14S 256GB 8RAM PURPLE GLOBAL", "price": 185.75 },
  { "code": "15278-5", "name": "XIAOMI NOTE 15 128GB 6RAM BLACK GLOBAL", "price": 156.00 },
  { "code": "15288-4", "name": "XIAOMI NOTE 15 128GB 6RAM BLUE GLOBAL", "price": 156.00 },
  { "code": "15279-2", "name": "XIAOMI NOTE 15 128GB 6RAM GREEN GLOBAL", "price": 156.00 },
  { "code": "15280-8", "name": "XIAOMI NOTE 15 128GB 6RAM PURPLE GLOBAL", "price": 156.00 },
  { "code": "15293-8", "name": "XIAOMI NOTE 15 256GB 8RAM 5G BLACK GLOBAL", "price": 222.00 },
  { "code": "15929-6", "name": "XIAOMI NOTE 15 256GB 8RAM 5G BLUE GLOBAL", "price": 222.00 },
  { "code": "15292-1", "name": "XIAOMI NOTE 15 256GB 8RAM 5G PURPLE GLOBAL", "price": 222.00 },
  { "code": "15283-9", "name": "XIAOMI NOTE 15 256GB 8RAM BLACK GLOBAL", "price": 177.00 },
  { "code": "15284-6", "name": "XIAOMI NOTE 15 256GB 8RAM BLUE GLOBAL", "price": 177.00 },
  { "code": "15281-5", "name": "XIAOMI NOTE 15 256GB 8RAM GREEN GLOBAL", "price": 177.00 },
  { "code": "15282-2", "name": "XIAOMI NOTE 15 256GB 8RAM PURPLE GLOBAL", "price": 177.00 },
  { "code": "15828-2", "name": "XIAOMI NOTE 15 512GB 8RAM 5G BLUE GLOBAL", "price": 258.00 },
  { "code": "15287-7", "name": "XIAOMI NOTE 15 PRO 256GB 8RAM 5G BLACK GLOBAL", "price": 275.00 },
  { "code": "15286-0", "name": "XIAOMI NOTE 15 PRO 256GB 8RAM 5G BLUE GLOBAL", "price": 275.00 },
  { "code": "15285-3", "name": "XIAOMI NOTE 15 PRO 256GB 8RAM 5G TITANIUM GLOBAL", "price": 275.00 },
  { "code": "15289-1", "name": "XIAOMI NOTE 15 PRO 256GB 8RAM BLACK GLOBAL", "price": 222.00 },
  { "code": "15291-4", "name": "XIAOMI NOTE 15 PRO 256GB 8RAM BLUE GLOBAL", "price": 222.00 },
  { "code": "15290-7", "name": "XIAOMI NOTE 15 PRO 256GB 8RAM TITANIUM GLOBAL", "price": 222.00 },
  { "code": "15829-9", "name": "XIAOMI NOTE 15 PRO 512GB 12RAM BLACK GLOBAL", "price": 285.00 },
  { "code": "15830-5", "name": "XIAOMI NOTE 15 PRO 512GB 12RAM BLUE GLOBAL", "price": 285.00 },
  { "code": "15831-2", "name": "XIAOMI NOTE 15 PRO 512GB 12RAM TITANIUM GLOBAL", "price": 285.00 },
  { "code": "15335-5", "name": "XIAOMI NOTE 15 PRO 512GB 8RAM 5G BLACK GLOBAL", "price": 293.00 },
  { "code": "15736-0", "name": "XIAOMI NOTE 15 PRO 512GB 8RAM 5G BLUE GLOBAL", "price": 293.00 },
  { "code": "15336-2", "name": "XIAOMI NOTE 15 PRO 512GB 8RAM 5G PURPLE GLOBAL", "price": 293.00 },
  { "code": "15340-9", "name": "XIAOMI NOTE 15 PRO 512GB 8RAM 5G TITANIUM GLOBAL", "price": 293.00 },
  { "code": "15339-3", "name": "XIAOMI NOTE 15 PRO+ 256GB 8RAM 5G BLACK GLOBAL", "price": 330.00 },
  { "code": "15341-6", "name": "XIAOMI NOTE 15 PRO+ 256GB 8RAM 5G BLUE GLOBAL", "price": 330.00 },
  { "code": "15342-3", "name": "XIAOMI NOTE 15 PRO+ 256GB 8RAM 5G BROWN GLOBAL", "price": 330.00 },
  { "code": "15337-9", "name": "XIAOMI NOTE 15 PRO+ 512GB 12RAM 5G BLACK GLOBAL", "price": 395.00 },
  { "code": "15338-6", "name": "XIAOMI NOTE 15 PRO+ 512GB 12RAM 5G BLUE GLOBAL", "price": 395.00 },
  { "code": "15343-0", "name": "XIAOMI NOTE 15 PRO+ 512GB 12RAM 5G BROWN GLOBAL", "price": 395.00 },
  { "code": "13581-8", "name": "XIAOMI POCO C71 128GB 4RAM BLACK GLOBAL", "price": 94.75 },
  { "code": "13582-5", "name": "XIAOMI POCO C71 128GB 4RAM BLUE GLOBAL", "price": 94.75 },
  { "code": "13583-2", "name": "XIAOMI POCO C71 128GB 4RAM GOLD GLOBAL", "price": 94.75 },
  { "code": "13584-9", "name": "XIAOMI POCO C71 64GB 3RAM BLACK GLOBAL", "price": 85.00 },
  { "code": "13585-6", "name": "XIAOMI POCO C71 64GB 3RAM BLUE GLOBAL", "price": 85.00 },
  { "code": "13586-3", "name": "XIAOMI POCO C71 64GB 3RAM GOLD GLOBAL", "price": 85.00 },
  { "code": "14455-1", "name": "XIAOMI POCO C85 128GB 6RAM BLACK GLOBAL", "price": 109.75 },
  { "code": "14513-8", "name": "XIAOMI POCO C85 128GB 6RAM GREEN GLOBAL", "price": 109.75 },
  { "code": "14514-5", "name": "XIAOMI POCO C85 128GB 6RAM PURPLE GLOBAL", "price": 109.75 },
  { "code": "14495-7", "name": "XIAOMI POCO C85 256GB 8RAM BLACK GLOBAL", "price": 132.75 },
  { "code": "14790-3", "name": "XIAOMI POCO C85 256GB 8RAM GREEN GLOBAL", "price": 132.75 },
  { "code": "14536-7", "name": "XIAOMI POCO C85 256GB 8RAM PURPLE GLOBAL", "price": 132.75 },
  { "code": "14417-9", "name": "XIAOMI POCO F7 12RAM 512GB 5G BLACK GLOBAL", "price": 455.00 },
  { "code": "15159-7", "name": "XIAOMI POCO F8 ULTRA 12RAM 256GB 5G BLACK GLOBAL", "price": 735.00 },
  { "code": "14440-7", "name": "XIAOMI POCO M7 256GB 8RAM SILVER GLOBAL", "price": 142.75 },
  { "code": "13133-9", "name": "XIAOMI POCO M7 PRO 256GB 8RAM 5G BLACK GLOBAL", "price": 221.00 },
  { "code": "14317-2", "name": "XIAOMI POCO M7 PRO 256GB 8RAM 5G BLACK GLOBAL", "price": 221.00 },
  { "code": "13561-0", "name": "XIAOMI POCO M7 PRO 256GB 8RAM 5G GREEN GLOBAL", "price": 216.75 },
  { "code": "15420-8", "name": "XIAOMI POCO M8 512GB 8RAM 5G GREEN GLOBAL", "price": 224.00 },
  { "code": "15381-2", "name": "XIAOMI POCO M8 PRO 256GB 8RAM 5G GREEN GLOBAL", "price": 258.00 },
  { "code": "15378-2", "name": "XIAOMI POCO M8 PRO 512GB 12RAM 5G GREEN GLOBAL", "price": 313.00 },
  { "code": "15379-9", "name": "XIAOMI POCO M8 PRO 512GB 12RAM 5G SILVER GLOBAL", "price": 313.00 },
  { "code": "13140-7", "name": "XIAOMI POCO X7 PRO 256GB 8RAM 5G BLACK GLOBAL", "price": 294.00 },
  { "code": "13141-4", "name": "XIAOMI POCO X7 PRO 256GB 8RAM 5G GREEN GLOBAL", "price": 294.00 },
  { "code": "12811-7", "name": "XIAOMI POCO X7 PRO 512GB 12RAM 5G BLACK GLOBAL", "price": 350.00 },
  { "code": "12799-8", "name": "XIAOMI POCO X7 PRO 512GB 12RAM 5G GREEN GLOBAL", "price": 350.00 },
  { "code": "15823-7", "name": "XIAOMI POCO X8 PRO 256GB 8RAM 5G BLACK GLOBAL", "price": 305.00 },
  { "code": "15854-1", "name": "XIAOMI POCO X8 PRO 256GB 8RAM 5G GREEN GLOBAL", "price": 305.00 },
  { "code": "15822-0", "name": "XIAOMI POCO X8 PRO 512GB 12RAM 5G BLACK GLOBAL", "price": 384.00 },
  { "code": "15907-4", "name": "XIAOMI POCO X8 PRO 512GB 12RAM 5G VERDE GLOBAL", "price": 384.00 },
  { "code": "15899-2", "name": "XIAOMI POCO X8 PRO 512GB 12RAM 5G WHITE GLOBAL", "price": 385.00 },
  { "code": "15898-5", "name": "XIAOMI POCO X8 PRO 512GB 8RAM 5G BLACK GLOBAL", "price": 333.00 },
  { "code": "15856-5", "name": "XIAOMI POCO X8 PRO 512GB 8RAM 5G GREEN GLOBAL", "price": 333.00 },
  { "code": "15824-4", "name": "XIAOMI POCO X8 PRO 512GB 8RAM 5G WHITE GLOBAL", "price": 333.00 },
  { "code": "15857-2", "name": "XIAOMI POCO X8 PRO MAX 256GB 12RAM 5G BLACK GLOBAL", "price": 427.00 },
  { "code": "15987-6", "name": "XIAOMI POCO X8 PRO MAX 256GB 12RAM 5G BLUE GLOBAL", "price": 427.00 },
  { "code": "16016-2", "name": "XIAOMI POCO X8 PRO MAX 256GB 12RAM 5G WHITE GLOBAL", "price": 427.00 },
  { "code": "15827-5", "name": "XIAOMI POCO X8 PRO MAX 512GB 12RAM 5G WHITE GLOBAL", "price": 485.00 },
  { "code": "14461-2", "name": "XIAOMI REDMI 15 256GB 8RAM BLACK GLOBAL", "price": 160.00 },
  { "code": "14463-6", "name": "XIAOMI REDMI 15 256GB 8RAM PURPLE GLOBAL", "price": 160.00 },
  { "code": "14457-5", "name": "XIAOMI REDMI 15C 128GB 4RAM BLACK GLOBAL", "price": 106.00 },
  { "code": "14464-3", "name": "XIAOMI REDMI 15C 128GB 4RAM BLUE GLOBAL", "price": 106.00 },
  { "code": "14497-1", "name": "XIAOMI REDMI 15C 128GB 4RAM GREEN GLOBAL", "price": 106.00 },
  { "code": "14498-8", "name": "XIAOMI REDMI 15C 128GB 4RAM ORANGE GLOBAL", "price": 106.00 },
  { "code": "14563-3", "name": "XIAOMI REDMI 15C 256GB 4RAM BLACK GLOBAL", "price": 116.00 },
  { "code": "14465-0", "name": "XIAOMI REDMI 15C 256GB 4RAM BLUE GLOBAL", "price": 116.00 },
  { "code": "14559-6", "name": "XIAOMI REDMI 15C 256GB 4RAM GREEN GLOBAL", "price": 115.00 },
  { "code": "14467-4", "name": "XIAOMI REDMI 15C 256GB 8RAM BLACK GLOBAL", "price": 132.00 },
  { "code": "14468-1", "name": "XIAOMI REDMI 15C 256GB 8RAM BLUE GLOBAL", "price": 132.00 },
  { "code": "14506-0", "name": "XIAOMI REDMI 15C 256GB 8RAM ORANGE GLOBAL", "price": 132.00 },
  { "code": "14505-3", "name": "XIAOMI REDMI 15C 256GB 8RAM VERDE GLOBAL", "price": 132.00 },
  { "code": "13465-1", "name": "XIAOMI REDMI A5 128GB 4RAM BLACK GLOBAL", "price": 99.00 },
  { "code": "13466-8", "name": "XIAOMI REDMI A5 128GB 4RAM BLUE GLOBAL", "price": 99.00 },
  { "code": "13487-3", "name": "XIAOMI REDMI A5 128GB 4RAM GOLD GLOBAL", "price": 99.00 },
  { "code": "13804-8", "name": "XIAOMI REDMI A5 128GB 4RAM GREEN GLOBAL", "price": 99.00 },
  { "code": "13587-0", "name": "XIAOMI REDMI A5 64GB 3RAM BLACK GLOBAL", "price": 81.00 },
  { "code": "13653-2", "name": "XIAOMI REDMI A5 64GB 3RAM BLUE GLOBAL", "price": 81.00 },
  { "code": "13588-7", "name": "XIAOMI REDMI A5 64GB 3RAM GOLD GLOBAL", "price": 81.00 },
  { "code": "15794-0", "name": "XIAOMI REDMI A7 PRO 128GB 4RAM GREEN GLOBAL", "price": 110.00 },
  { "code": "15795-7", "name": "XIAOMI REDMI A7 PRO 64GB 4RAM BLACK GLOBAL", "price": 96.00 },
  { "code": "15796-4", "name": "XIAOMI REDMI A7 PRO 64GB 4RAM BLUE GLOBAL", "price": 96.00 },
  { "code": "16013-1", "name": "XIAOMI REDMI A7 PRO 64GB 4RAM VERDE GLOBAL", "price": 96.00 }
];

async function runMatching() {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    
    // Define Schema/Model implicitly if needed, or just use collection
    const Product = mongoose.models.Product || mongoose.model('Product', new mongoose.Schema({}, { strict: false }));

    console.log('Fetching local products...');
    const localXiaomi = await Product.find({
        category: { $in: ['xiaomi', 'redmi', 'poco', 'smart-home', 'aspiradoras-robot', 'xiaomi-home'] }
    }).lean();

    console.log(`Found ${localXiaomi.length} local Xiaomi products.`);

    const normalize = (name) => {
        return name.toLowerCase()
            .replace(/xiaomi\s+/g, '')
            .replace(/redmi\s+/g, '')
            .replace(/poco\s+/g, '')
            .replace(/robot\s+/g, '')
            .replace(/vacuum\s+/g, '')
            .replace(/tablet\s+/g, '')
            .replace(/global\s*/g, '')
            .replace(/5g\s*/g, '')
            .replace(/ram\s*/g, '')
            .replace(/gb\s*/g, '')
            .replace(/\s+/g, ' ')
            .trim();
    };

    const results = {
        exactMatches: [],
        partialMatches: [],
        noMatches: []
    };

    for (const sProd of supplierProducts) {
        const sNorm = normalize(sProd.name);
        const sWords = sNorm.split(' ');
        
        let matches = [];

        for (const lProd of localXiaomi) {
            const lNorm = normalize(lProd.name);
            const lWords = lNorm.split(' ');

            if (sNorm === lNorm) {
                matches.push({ prod: lProd, score: 1 });
            } else {
                // Check word intersection
                const intersection = sWords.filter(w => lWords.includes(w));
                const score = (intersection.length * 2) / (sWords.length + lWords.length);
                if (score > 0.6) {
                    matches.push({ prod: lProd, score });
                }
            }
        }

        matches.sort((a, b) => b.score - a.score);

        if (matches.length > 0) {
            if (matches[0].score === 1) {
                results.exactMatches.push({ supplier: sProd, local: matches[0].prod });
            } else {
                results.partialMatches.push({ supplier: sProd, matches: matches.map(m => ({ name: m.prod.name, id: m.prod.id, score: m.score })) });
            }
        } else {
            results.noMatches.push(sProd);
        }
    }

    console.log('--- MATCHING SUMMARY ---');
    console.log(`Total Supplier: ${supplierProducts.length}`);
    console.log(`Exact Matches: ${results.exactMatches.length}`);
    console.log(`Partial Matches: ${results.partialMatches.length}`);
    console.log(`No Match: ${results.noMatches.length}`);

    fs.writeFileSync('c:\\Users\\Juli\\Desktop\\JBimports-JS\\jbimportsWEBNextJS\\tmp\\xiaomi_matching_results.json', JSON.stringify(results, null, 2));
    
    await mongoose.connection.close();
    process.exit(0);
}

runMatching().catch(err => {
    console.error(err);
    process.exit(1);
});
