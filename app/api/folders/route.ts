import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

const FOLDERS_FILE = path.join(process.cwd(), 'data', 'folders.json');

async function ensureFoldersFile() {
  const dataDir = path.join(process.cwd(), 'data');
  try {
    await fs.mkdir(dataDir, { recursive: true });
  } catch (err) {
    // Directory may already exist
  }
  
  try {
    await fs.access(FOLDERS_FILE);
  } catch {
    await fs.writeFile(FOLDERS_FILE, JSON.stringify({ folders: [] }));
  }
}

export async function GET() {
  await ensureFoldersFile();
  
  try {
    const data = await fs.readFile(FOLDERS_FILE, 'utf-8');
    return NextResponse.json(JSON.parse(data));
  } catch (err) {
    return NextResponse.json({ folders: [] });
  }
}

export async function POST(request: NextRequest) {
  await ensureFoldersFile();
  
  try {
    const { path: folderPath } = await request.json();
    
    if (!folderPath) {
      return NextResponse.json({ error: 'Path is required' }, { status: 400 });
    }

    const folderName = folderPath.split(path.sep).pop() || folderPath;
    
    const data = await fs.readFile(FOLDERS_FILE, 'utf-8');
    const folders = JSON.parse(data).folders || [];
    
    if (folders.some((f: any) => f.path === folderPath)) {
      return NextResponse.json({ error: 'Folder already exists' }, { status: 400 });
    }

    folders.push({
      path: folderPath,
      name: folderName
    });

    await fs.writeFile(FOLDERS_FILE, JSON.stringify({ folders }, null, 2));

    return NextResponse.json({ folders });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to add folder' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  await ensureFoldersFile();
  
  try {
    const { path: folderPath } = await request.json();
    
    if (!folderPath) {
      return NextResponse.json({ error: 'Path is required' }, { status: 400 });
    }

    const data = await fs.readFile(FOLDERS_FILE, 'utf-8');
    let folders = JSON.parse(data).folders || [];
    
    folders = folders.filter((f: any) => f.path !== folderPath);

    await fs.writeFile(FOLDERS_FILE, JSON.stringify({ folders }, null, 2));

    return NextResponse.json({ folders });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to remove folder' }, { status: 500 });
  }
}
