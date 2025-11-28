import fs from 'fs';
import path from 'path';

const htmlDir = path.join(process.cwd(), 'public', 'HTML');
const reactDir = path.join(process.cwd(), 'components', 'projects');
const outputFile = path.join(process.cwd(), 'public', 'projects.json');

// Directory for generated React routes
const reactRoutesDir = path.join(process.cwd(), 'app', 'r');

function toPascalCase(str) {
  return str.replace(/[^a-zA-Z0-9]+(.)/g, (m, chr) => chr.toUpperCase())
            .replace(/^[a-z]/, m => m.toUpperCase())
            .replace(/[^a-zA-Z0-9]/g, '');
}

const projects = [];

// Cleanup existing generated routes
if (fs.existsSync(reactRoutesDir)) {
  fs.rmSync(reactRoutesDir, { recursive: true, force: true });
}
fs.mkdirSync(reactRoutesDir, { recursive: true });

// 1. Process HTML
if (fs.existsSync(htmlDir)) {
  const htmlFiles = fs.readdirSync(htmlDir).filter(f => f.endsWith('.html'));
  for (const file of htmlFiles) {
    const title = file.replace('.html', '');
    const slug = toPascalCase(title);
    
    fs.renameSync(path.join(htmlDir, file), path.join(htmlDir, `${slug}.html`));

    projects.push({
      id: `html-${slug}`,
      title,
      type: 'html',
      slug,
      category: 'Vanilla HTML/JS',
    });
  }
}

// 2. Process React
if (fs.existsSync(reactDir)) {
  const reactFiles = fs.readdirSync(reactDir).filter(f => f.endsWith('.tsx'));
  for (const file of reactFiles) {
    const title = file.replace('.tsx', '');
    const slug = toPascalCase(title);
    
    const oldPath = path.join(reactDir, file);
    const newPath = path.join(reactDir, `${slug}.tsx`);
    
    if (oldPath !== newPath) {
        fs.renameSync(oldPath, newPath);
    }

    let content = fs.readFileSync(newPath, 'utf8');
    content = content.replace(/export\s+default\s+function\s+([a-zA-Z0-9_]*)/g, `export default function ${slug}Export`);
    content = content.replace(/export\s+default\s+function\s*\(/g, `export default function ${slug}Export(`);
    fs.writeFileSync(newPath, content);

    projects.push({
      id: `react-${slug}`,
      title,
      type: 'react',
      slug,
      category: 'React/Next',
    });

    // Generate physical isolated Next.js page route to prevent Webpack context freezing
    const pageDir = path.join(reactRoutesDir, slug);
    fs.mkdirSync(pageDir, { recursive: true });
    
    const pageContent = `"use client";
import ProjectComponent from '@/components/projects/${slug}';
import { useRouter } from 'next/navigation';

export default function Page() {
  const router = useRouter();
  return (
    <div className="min-h-screen bg-neutral-950 text-white flex flex-col">
      <header className="h-16 border-b border-neutral-800 flex items-center justify-between px-6 bg-neutral-900/50 backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center space-x-4">
          <button 
            onClick={() => router.back()}
            className="text-neutral-400 hover:text-white transition-colors flex items-center gap-2 cursor-pointer"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
            Back to Portfolio
          </button>
        </div>
        <div className="font-semibold">${title}</div>
        <div className="text-xs px-2 py-1 rounded-full bg-neutral-800 text-neutral-300 border border-neutral-700">
          React/Next
        </div>
      </header>
      <main className="flex-1 w-full bg-neutral-950">
        <ProjectComponent />
      </main>
    </div>
  );
}
`;
    fs.writeFileSync(path.join(pageDir, 'page.tsx'), pageContent);
  }
}

fs.writeFileSync(outputFile, JSON.stringify(projects, null, 2));
console.log(`Processed ${projects.length} projects! Generated isolated pages for React components.`);
