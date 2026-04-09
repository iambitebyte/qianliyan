'use client';

import { useState, useEffect } from 'react';
import { FolderPlus, Folder, Trash2, ExternalLink, FolderOpen, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { getBasePath } from '@/lib/utils';

interface FolderInfo {
  path: string;
  name: string;
}

export default function Home() {
  const [folders, setFolders] = useState<FolderInfo[]>([]);
  const [newPath, setNewPath] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [adding, setAdding] = useState(false);
  const basePath = getBasePath();

  useEffect(() => {
    fetchFolders();
  }, []);

  const fetchFolders = async () => {
    try {
      const res = await fetch(`${basePath}/api/folders`);
      const data = await res.json();
      setFolders(data.folders || []);
    } catch (err) {
      setError('Failed to load folders');
    } finally {
      setLoading(false);
    }
  };

  const addFolder = async () => {
    if (!newPath.trim()) return;
    setAdding(true);

    try {
      const res = await fetch(`${basePath}/api/folders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ path: newPath }),
      });

      const data = await res.json();

      if (res.ok) {
        setFolders(data.folders || []);
        setNewPath('');
        setError('');
      } else {
        setError(data.error || 'Failed to add folder');
      }
    } catch (err) {
      setError('Failed to add folder');
    } finally {
      setAdding(false);
    }
  };

  const removeFolder = async (path: string) => {
    try {
      const res = await fetch(`${basePath}/api/folders`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ path }),
      });

      const data = await res.json();

      if (res.ok) {
        setFolders(data.folders || []);
      } else {
        setError(data.error || 'Failed to remove folder');
      }
    } catch (err) {
      setError('Failed to remove folder');
    }
  };

  const openFolder = (path: string) => {
    window.location.href = `${basePath}/logs?path=${encodeURIComponent(path)}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <div className="text-gray-600">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-8 flex flex-col items-center">
      <div className="w-full max-w-4xl flex-1 flex flex-col pt-8">
        <div className="mb-8 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="bg-blue-600 rounded-lg p-3">
              <ShieldCheck className="w-12 h-12 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900">Qianliyan</h1>
          </div>
          <p className="text-gray-600 text-lg">实时日志监控工具</p>
        </div>
        
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 flex items-center justify-center gap-2">
            <span>⚠️</span>
            {error}
          </div>
        )}

        <Card className="mb-8 shadow-lg">
          <CardHeader className="space-y-3">
            <CardTitle className="flex items-center justify-center gap-2">
              <FolderPlus className="w-5 h-5 text-blue-600" />
              添加监控文件夹
            </CardTitle>
            <CardDescription className="text-center">
              输入要监控的文件夹路径（绝对路径）
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="flex gap-4">
              <Input
                type="text"
                value={newPath}
                onChange={(e) => setNewPath(e.target.value)}
                placeholder="/path/to/logs"
                onKeyDown={(e) => e.key === 'Enter' && !adding && addFolder()}
                disabled={adding}
                className="flex-1"
              />
              <Button 
                onClick={addFolder}
                disabled={adding || !newPath.trim()}
                className="flex items-center gap-2"
              >
                <FolderPlus className="w-4 h-4" />
                {adding ? 'Adding...' : '添加'}
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-8 mt-8 shadow-lg">
          <CardHeader className="space-y-3">
            <CardTitle className="flex items-center justify-center gap-2">
              <FolderOpen className="w-5 h-5 text-blue-600" />
              监控文件夹列表
            </CardTitle>
            <CardDescription className="text-center">
              {folders.length === 0 ? '暂无监控文件夹，请添加' : `共 ${folders.length} 个文件夹`}
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            {folders.length === 0 ? (
              <div className="text-center py-16">
                <Folder className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <div className="text-gray-500">还没有监控文件夹</div>
                <div className="text-sm text-gray-400 mt-2">在上方添加一个文件夹开始监控</div>
              </div>
            ) : (
              <div className="space-y-4">
                {folders.map((folder, index) => (
                  <div
                    key={folder.path}
                    className="group flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-blue-400 hover:shadow-md transition-all bg-white"
                  >
                    <div
                      className="flex items-center gap-4 flex-1 cursor-pointer"
                      onClick={() => openFolder(folder.path)}
                    >
                      <div className="bg-blue-50 rounded-lg p-2 group-hover:bg-blue-100 transition-colors">
                        <Folder className="w-6 h-6 text-blue-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="font-semibold text-gray-900 truncate">{folder.name}</div>
                          <Badge variant="secondary">#{index + 1}</Badge>
                        </div>
                        <div className="text-sm text-gray-500 truncate font-mono">{folder.path}</div>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openFolder(folder.path)}
                        className="flex items-center gap-2"
                      >
                        <ExternalLink className="w-4 h-4" />
                        打开
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          if (confirm(`确定要删除 "${folder.name}" 吗？`)) {
                            removeFolder(folder.path);
                          }
                        }}
                        className="flex items-center gap-2 hover:bg-red-50 hover:text-red-600 hover:border-red-200"
                      >
                        <Trash2 className="w-4 h-4" />
                        删除
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <div className="text-center text-sm text-gray-500">
          <p>Qianliyan v0.2.2 - 基于 Next.js 和 React 构建</p>
        </div>
      </div>
    </div>
  );
}
