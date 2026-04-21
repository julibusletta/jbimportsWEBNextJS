import mongoose from 'mongoose';

const MONGODB_URI = 'mongodb+srv://admin:3CRVzt8trnHkhRkG@admin.j2yvyqi.mongodb.net/?appName=admin';

function levenshtein(a, b) {
  const matrix = [];
  for (let i = 0; i <= b.length; i++) matrix[i] = [i];
  for (let j = 0; j <= a.length; j++) matrix[0][j] = j;
  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(matrix[i - 1][j - 1] + 1, matrix[i][j - 1] + 1, matrix[i - 1][j] + 1);
      }
    }
  }
  return matrix[b.length][a.length];
}

async function run() {
  try {
    await mongoose.connect(MONGODB_URI);
    const Product = mongoose.models.Product || mongoose.model('Product', new mongoose.Schema({}, { strict: false }));

    const products = await Product.find({ category: 'xiaomi' }).lean();
    console.log(`Analyzing ${products.length} Xiaomi products...`);

    const suspicious = [];
    for (let i = 0; i < products.length; i++) {
      for (let j = i + 1; j < products.length; j++) {
        const name1 = products[i].name;
        const name2 = products[j].name;
        const dist = levenshtein(name1, name2);
        
        if (dist > 0 && dist <= 3) {
          // Check if it's just a variation like 4G vs 5G
          const set1 = new Set(name1.split(' '));
          const set2 = new Set(name2.split(' '));
          
          const diff1 = [...set1].filter(x => !set2.has(x));
          const diff2 = [...set2].filter(x => !set1.has(x));
          
          // If the difference is "5G", it's likely a legitimate variant
          const relevantDiff = (d) => d.filter(word => !['5G', '4G'].includes(word.toUpperCase()));
          
          if (relevantDiff(diff1).length > 0 || relevantDiff(diff2).length > 0) {
            suspicious.push({ p1: products[i], p2: products[j], dist, diff1, diff2 });
          }
        }
      }
    }

    console.log(`\nFound ${suspicious.length} suspicious similar pairs:`);
    suspicious.forEach(s => {
      console.log(`- "${s.p1.name}" vs "${s.p2.name}" (Dist: ${s.dist})`);
      console.log(`  Diff1: ${s.diff1.join(', ')} | Diff2: ${s.diff2.join(', ')}`);
    });

    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

run();
