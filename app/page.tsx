'use client';

import { useState, useEffect } from 'react';
import { FolderPlus, Folder, Trash2, ExternalLink, FolderOpen, ShieldCheck, Copy, Check, Pencil, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { getBasePath } from '@/lib/utils';
import { useAuth } from '@/lib/auth';
import { ProtectedRoute } from '@/components/protected-route';

interface FolderInfo {
  path: string;
  name: string;
  labels: string[];
}

export default function Home() {
  const [folders, setFolders] = useState<FolderInfo[]>([]);
  const [newPath, setNewPath] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [adding, setAdding] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [copiedPath, setCopiedPath] = useState('');
  const [editingPath, setEditingPath] = useState('');
  const [labels, setLabels] = useState<string[]>([]);
  const [labelInput, setLabelInput] = useState('');
  const basePath = getBasePath();
  const { logout } = useAuth();

  const tagColors: { [key: string]: string } = {};
  const colorPalette = [
    'bg-red-100 text-red-800',
    'bg-blue-100 text-blue-800',
    'bg-green-100 text-green-800',
    'bg-yellow-100 text-yellow-800',
    'bg-purple-100 text-purple-800',
    'bg-pink-100 text-pink-800',
    'bg-indigo-100 text-indigo-800',
    'bg-orange-100 text-orange-800',
    'bg-teal-100 text-teal-800',
    'bg-cyan-100 text-cyan-800',
  ];

  const getTagColor = (tag: string) => {
    if (!tagColors[tag]) {
      const hash = tag.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
      tagColors[tag] = colorPalette[hash % colorPalette.length];
    }
    return tagColors[tag];
  };

  const addLabel = () => {
    const trimmed = labelInput.trim();
    if (trimmed && !labels.includes(trimmed) && labels.length < 5) {
      setLabels([...labels, trimmed]);
      setLabelInput('');
    }
  };

  const removeLabel = (label: string) => {
    setLabels(labels.filter(l => l !== label));
  };

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
        method: editingPath ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ path: newPath, oldPath: editingPath, labels }),
      });

      const data = await res.json();

      if (res.ok) {
        setFolders(data.folders || []);
        setNewPath('');
        setEditingPath('');
        setLabels([]);
        setLabelInput('');
        setError('');
        setShowModal(false);
      } else {
        setError(data.error || 'Failed to add folder');
      }
    } catch (err) {
      setError('Failed to add folder');
    } finally {
      setAdding(false);
    }
  };

  const removeFolder = async (path: string, closeModal = false) => {
    try {
      const res = await fetch(`${basePath}/api/folders`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ path }),
      });

      const data = await res.json();

      if (res.ok) {
        setFolders(data.folders || []);
        if (closeModal) {
          setShowModal(false);
          setEditingPath('');
          setNewPath('');
          setLabels([]);
          setLabelInput('');
        }
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

  const copyToClipboard = async (path: string) => {
    try {
      await navigator.clipboard.writeText(path);
      setCopiedPath(path);
      setTimeout(() => setCopiedPath(''), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const openAddModal = () => {
    setEditingPath('');
    setNewPath('');
    setLabels([]);
    setLabelInput('');
    setShowModal(true);
  };

  const openEditModal = (path: string) => {
    const folder = folders.find(f => f.path === path);
    setEditingPath(path);
    setNewPath(path);
    setLabels(folder?.labels || []);
    setLabelInput('');
    setShowModal(true);
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
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <header className="fixed top-0 left-0 right-0 bg-white/90 backdrop-blur-sm border-b border-gray-200 z-40 px-4 md:px-8 py-3 shadow-sm">
          <div className="w-full max-w-6xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="bg-blue-600 rounded-lg p-2">
                <ShieldCheck className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Qianliyan</h1>
              <p className="text-sm text-gray-600 hidden md:block">实时日志监控工具</p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={logout}
              className="flex items-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">退出</span>
            </Button>
          </div>
        </header>

      <main className="pt-20 px-4 md:px-8 pb-8">
        <div className="w-full max-w-6xl mx-auto">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 flex items-center justify-center gap-2">
              <span>⚠️</span>
              {error}
            </div>
          )}

          <Card className="shadow-lg">
            <CardHeader className="space-y-3">
              <CardTitle className="flex items-center justify-center gap-2">
                <FolderOpen className="w-5 h-5 text-blue-600" />
                监控文件夹列表
              </CardTitle>
              <CardDescription className="text-center flex items-center justify-center gap-4">
                {folders.length === 0 ? '暂无监控文件夹，请添加' : `共 ${folders.length} 个文件夹`}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={openAddModal}
                  className="flex items-center gap-1 h-6 px-2"
                >
                  <FolderPlus className="w-4 h-4" />
                </Button>
              </CardDescription>
            </CardHeader>
            <CardContent>
              {folders.length === 0 ? (
                <div className="text-center py-16">
                  <Folder className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <div className="text-gray-500">还没有监控文件夹</div>
                  <div className="text-sm text-gray-400 mt-2">点击右上角的 + 添加文件夹开始监控</div>
                </div>
              ) : (
                <div className="space-y-4">
                {folders.map((folder, index) => (
                  <div
                    key={folder.path}
                    className="group flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-blue-400 hover:shadow-md transition-all bg-white"
                  >
                    <div className="flex items-center gap-4 flex-1">
                      <div className="bg-blue-50 rounded-lg p-2 group-hover:bg-blue-100 transition-colors">
                        <Folder className="w-6 h-6 text-blue-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2 flex-wrap">
                          <div className="font-semibold text-gray-900 truncate">{folder.name}</div>
                          <Badge variant="secondary">#{index + 1}</Badge>
                          {(folder.labels || []).map((label, labelIdx) => (
                            <Badge key={labelIdx} variant="secondary" className={getTagColor(label)}>
                              {label}
                            </Badge>
                          ))}
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="text-sm text-gray-500 truncate font-mono">{folder.path}</div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => copyToClipboard(folder.path)}
                            className="h-6 px-2 text-gray-500 hover:text-blue-600 shrink-0"
                          >
                            {copiedPath === folder.path ? (
                              <Check className="w-4 h-4 text-green-600" />
                            ) : (
                              <Copy className="w-4 h-4" />
                            )}
                          </Button>
                        </div>
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
                        onClick={() => openEditModal(folder.path)}
                        className="flex items-center gap-2"
                      >
                        <Pencil className="w-4 h-4" />
                        编辑
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <footer className="text-center text-sm text-gray-500 py-8">
          <p>Qianliyan v0.2.2 - 基于 Next.js 和 React 构建</p>
        </footer>
      </div>
    </main>

    {showModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <Card className="w-full max-w-md shadow-2xl">
              <CardHeader className="space-y-3">
                <CardTitle className="flex items-center gap-2">
                  {editingPath ? (
                    <>
                      <Pencil className="w-5 h-5 text-blue-600" />
                      编辑监控文件夹
                    </>
                  ) : (
                    <>
                      <FolderPlus className="w-5 h-5 text-blue-600" />
                      添加监控文件夹
                    </>
                  )}
                </CardTitle>
                <CardDescription className="text-center">
                  输入要监控的文件夹路径（绝对路径）
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">文件夹路径</label>
                    <Input
                      type="text"
                      value={newPath}
                      onChange={(e) => setNewPath(e.target.value)}
                      placeholder="/path/to/logs"
                      onKeyDown={(e) => e.key === 'Enter' && !adding && addFolder()}
                      disabled={adding}
                      autoFocus
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      标签（最多5个，按回车添加）
                    </label>
                    <div className="flex gap-2 mb-2">
                      <Input
                        type="text"
                        value={labelInput}
                        onChange={(e) => setLabelInput(e.target.value)}
                        placeholder="输入标签名称"
                        onKeyDown={(e) => e.key === 'Enter' && !adding && addLabel()}
                        disabled={adding || labels.length >= 5}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={addLabel}
                        disabled={adding || !labelInput.trim() || labels.length >= 5}
                        className="shrink-0"
                      >
                        添加
                      </Button>
                    </div>
                    {labels.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {labels.map((label, idx) => (
                          <Badge
                            key={idx}
                            variant="secondary"
                            className={`${getTagColor(label)} flex items-center gap-1`}
                          >
                            {label}
                            <button
                              type="button"
                              onClick={() => removeLabel(label)}
                              disabled={adding}
                              className="ml-1 hover:opacity-75"
                            >
                              ×
                            </button>
                          </Badge>
                        ))}
                      </div>
                    )}
                    <div className="text-xs text-gray-500 mt-1">
                      已添加 {labels.length}/5 个标签
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <Button
                      onClick={addFolder}
                      disabled={adding || !newPath.trim()}
                      className="flex-1 flex items-center gap-2"
                    >
                      {editingPath ? (
                        <>
                          <Pencil className="w-4 h-4" />
                          {adding ? 'Saving...' : '保存'}
                        </>
                      ) : (
                        <>
                          <FolderPlus className="w-4 h-4" />
                          {adding ? 'Adding...' : '添加'}
                        </>
                      )}
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setShowModal(false);
                        setEditingPath('');
                        setNewPath('');
                        setLabels([]);
                        setLabelInput('');
                      }}
                      disabled={adding}
                      className="flex-1"
                    >
                      取消
                    </Button>
                  </div>
                  {editingPath && (
                    <Button
                      variant="outline"
                      onClick={() => {
                        if (confirm(`确定要删除 "${folders.find(f => f.path === editingPath)?.name}" 吗？`)) {
                          removeFolder(editingPath, true);
                        }
                      }}
                      disabled={adding}
                      className="w-full flex items-center gap-2 hover:bg-red-50 hover:text-red-600 hover:border-red-200"
                    >
                      <Trash2 className="w-4 h-4" />
                      删除此记录
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
           </div>
         )}
      </div>
    </ProtectedRoute>
  );
}
