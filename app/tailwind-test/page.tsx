'use client';

export default function TailwindTestPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-xl p-8 mb-6">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Tailwind CSS 测试页面</h1>
          <p className="text-gray-600 mb-6">如果您能看到以下样式，说明 Tailwind CSS 正在工作！</p>
          
          <div className="space-y-4">
            <div className="bg-blue-600 text-white p-4 rounded-lg">
              <h2 className="text-xl font-semibold">✅ 蓝色卡片</h2>
              <p className="text-blue-100 mt-2">如果您看到蓝色背景和白色文字，Tailwind 正在工作！</p>
            </div>
            
            <div className="bg-green-500 text-white p-4 rounded-lg">
              <h2 className="text-xl font-semibold">✅ 绿色卡片</h2>
              <p className="text-green-100 mt-2">如果您看到绿色背景和白色文字，Tailwind 正在工作！</p>
            </div>
            
            <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white p-4 rounded-lg">
              <h2 className="text-xl font-semibold">✅ 渐变卡片</h2>
              <p className="text-pink-100 mt-2">如果您看到从紫色到粉色的渐变，Tailwind 正在工作！</p>
            </div>
          </div>
          
          <div className="flex gap-4 mt-6">
            <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold">
              蓝色按钮
            </button>
            <button className="px-6 py-3 bg-gray-200 text-gray-900 rounded-lg hover:bg-gray-300 transition-colors font-semibold">
              灰色按钮
            </button>
            <button className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-semibold">
              绿色按钮
            </button>
          </div>
          
          <div className="mt-6 p-4 bg-gray-100 rounded-lg">
            <h3 className="font-semibold text-gray-900 mb-2">检查清单：</h3>
            <ul className="space-y-1 text-gray-700">
              <li className="flex items-center gap-2">
                <span className="w-4 h-4 bg-blue-600 rounded-full"></span>
                背景是否有渐变（从浅蓝到深紫）
              </li>
              <li className="flex items-center gap-2">
                <span className="w-4 h-4 bg-blue-600 rounded-full"></span>
                卡片是否有白色背景和阴影
              </li>
              <li className="flex items-center gap-2">
                <span className="w-4 h-4 bg-blue-600 rounded-full"></span>
                按钮是否有彩色背景
              </li>
              <li className="flex items-center gap-2">
                <span className="w-4 h-4 bg-blue-600 rounded-full"></span>
                文字是否有合适的颜色和大小
              </li>
              <li className="flex items-center gap-2">
                <span className="w-4 h-4 bg-blue-600 rounded-full"></span>
                布局是否有合适的间距
              </li>
            </ul>
          </div>
          
          <div className="mt-6 text-center">
            <a href="/" className="text-blue-600 hover:text-blue-700 font-semibold underline">
              返回主页
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
