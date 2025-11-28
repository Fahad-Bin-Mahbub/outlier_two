import fs from 'fs';
import path from 'path';

const htmlDir = path.join(process.cwd(), 'public', 'HTML');
const reactDir = path.join(process.cwd(), 'components', 'projects');
const outputFile = path.join(process.cwd(), 'public', 'projects.json');

const projects = JSON.parse(fs.readFileSync(outputFile, 'utf8'));

for (const p of projects) {
    try {
        if (p.type === 'html') {
            const filePath = path.join(htmlDir, `${p.slug}.html`);
            if (fs.existsSync(filePath)) {
                let content = fs.readFileSync(filePath, 'utf8');
                // Update <title>
                content = content.replace(/<title>[^<]*<\/title>/i, `<title>${p.title}</title>`);
                fs.writeFileSync(filePath, content);
            }
        } else if (p.type === 'react') {
            const filePath = path.join(reactDir, `${p.slug}.tsx`);
            if (fs.existsSync(filePath)) {
                let content = fs.readFileSync(filePath, 'utf8');
                // Update first <h1> if it's generic
                const h1Regex = /<h1[^>]*>([^<{]+)<\/h1>/i;
                const match = content.match(h1Regex);
                if (match) {
                    const currentTitle = match[1].trim();
                    if (['Dashboard', 'App', 'Home', 'Next.js', 'React App'].includes(currentTitle)) {
                        content = content.replace(h1Regex, (m, g1) => m.replace(g1, p.title));
                    }
                } else if (!content.includes('<h1')) {
                    // If no <h1> exists, we don't force it, but the json title is what's used on the dashboard
                }
                fs.writeFileSync(filePath, content);
            }
        }
    } catch (err) {
        console.error(`Error syncing ${p.slug}:`, err.message);
    }
}

console.log(`Synced meaningful titles into ${projects.length} source files.`);
