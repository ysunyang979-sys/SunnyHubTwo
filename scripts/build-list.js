const fs = require('fs');
const path = require('path');

const mangaDir = path.join(__dirname, '../manga');
const outputFile = path.join(__dirname, '../data.json');

// 定义分类
const categories = [
    { name: "合租女室友", keywords: ["合租"] },
    { name: "晨曦战队", keywords: ["晨曦", "cx"] },
    { name: "欲望飞行", keywords: ["飞行"] },
    { name: "穿越火线", keywords: ["穿越火线"] },
    { name: "流光", keywords: ["流光"] },
    { name: "死或生", keywords: ["死或生"] },
    { name: "其他", keywords: [] }
];

function build() {
    console.log('--- 🔍 开始全能扫描 ---');
    if (!fs.existsSync(mangaDir)) {
        console.error('❌ 错误：找不到 manga 文件夹！');
        return;
    }

    const items = fs.readdirSync(mangaDir);
    const output = [];

    items.forEach(name => {
        const fullPath = path.join(mangaDir, name);
        const stats = fs.statSync(fullPath);

        if (stats.isDirectory()) {
            // 扫描图片
            const files = fs.readdirSync(fullPath)
                .filter(f => /\.(webp|jpg|png|jpeg)$/i.test(f))
                .sort((a, b) => a.localeCompare(b, undefined, {numeric: true, sensitivity: 'base'}));

            if (files.length > 0) {
                // 匹配分类
                let catName = "其他";
                for (const c of categories) {
                    if (c.keywords.some(k => name.toLowerCase().includes(k.toLowerCase()))) {
                        catName = c.name;
                        break;
                    }
                }

                const imgs = files.map(f => `manga/${name}/${f}`.replace(/\\/g, '/'));
                output.push({
                    title: name,
                    category: catName,
                    cover: imgs[0],
                    images: imgs
                });
                console.log(`✅ 已添加: [${catName}] ${name} (${files.length}张图片)`);
            } else {
                console.log(`⚠️ 跳过: ${name} (文件夹里没找到图片)`);
            }
        } else {
            console.log(`ℹ️ 忽略文件: ${name}`);
        }
    });

    fs.writeFileSync(outputFile, JSON.stringify(output, null, 2), 'utf-8');
    console.log(`\n✨ 完成！总共写入 ${output.length} 部漫画到 data.json`);
}

build();
