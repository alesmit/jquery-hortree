import { minify } from 'minify';
import fs from 'node:fs/promises';

async function build() {
    // clean
    await fs.rm('dist', { recursive: true, force: true });
    await fs.mkdir('dist');

    // minify
    const [minifiedJs, minifiedCss] = await Promise.all([
        minify('src/jquery.hortree.js'),
        minify('src/jquery.hortree.css'),
    ]);

    // copy
    await Promise.all([
        fs.copyFile('src/jquery.hortree.js', 'dist/jquery.hortree.js'),
        fs.copyFile('src/jquery.hortree.css', 'dist/jquery.hortree.css'),
        fs.writeFile('dist/jquery.hortree.min.js', minifiedJs),
        fs.writeFile('dist/jquery.hortree.min.css', minifiedCss),
    ]);
}

build();
