import fs from 'fs';
import path from 'path';

const outputFile = path.join(process.cwd(), 'public', 'projects.json');
const projects = JSON.parse(fs.readFileSync(outputFile, 'utf8'));

const featuredSlugs = ['AdventureItinerary', 'ArcadeGame', 'BioCanvas', 'APIBuilder'];

for (const p of projects) {
    if (featuredSlugs.includes(p.slug)) {
        p.featured = true;
    }
}

fs.writeFileSync(outputFile, JSON.stringify(projects, null, 2));
console.log('Successfully featured projects:', featuredSlugs.join(', '));
