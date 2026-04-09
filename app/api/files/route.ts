import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const folderPath = searchParams.get('path');

    if (!folderPath) {
      return NextResponse.json({ error: 'Path is required' }, { status: 400 });
    }

    try {
      const entries = await fs.readdir(folderPath, { withFileTypes: true });
      const files = [];

      for (const entry of entries) {
        if (entry.isFile()) {
          const fileName = entry.name;
          const ext = path.extname(fileName).toLowerCase();
          
          if (ext === '.txt' || ext === '.log') {
            try {
              const stats = await fs.stat(path.join(folderPath, fileName));
              files.push({
                name: fileName,
                size: stats.size,
                modified: stats.mtime
              });
            } catch (err) {
              console.error(`Failed to stat file: ${fileName}`);
            }
          }
        }
      }

      files.sort((a, b) => b.modified.getTime() - a.modified.getTime());

      return NextResponse.json({ files });
    } catch (err) {
      return NextResponse.json({ error: 'Folder not found or not accessible' }, { status: 404 });
    }
  } catch (err) {
    return NextResponse.json({ error: 'Failed to read folder' }, { status: 500 });
  }
}
