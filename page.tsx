export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 to-blue-100 py-10 px-4">
      <div className="max-w-md mx-auto bg-white rounded-3xl shadow-xl p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">My Todo List</h1>
        
        <div className="flex gap-2 mb-8">
          <input 
            type="text" 
            placeholder="何をする？" 
            className="flex-1 border-2 border-gray-100 rounded-xl px-4 py-2 focus:outline-none focus:border-blue-400"
          />
          <button className="bg-blue-500 text-white px-6 py-2 rounded-xl font-bold hover:bg-blue-600 transition">
            追加
          </button>
        </div>

        <ul className="space-y-3">
          <li className="flex items-center p-4 bg-gray-50 rounded-2xl">
            <input type="checkbox" className="w-5 h-5 mr-3" />
            <span className="text-gray-700">プログラミングを頑張る</span>
          </li>
          <li className="flex items-center p-4 bg-gray-50 rounded-2xl">
            <input type="checkbox" className="w-5 h-5 mr-3" />
            <span className="text-gray-700">Vercelで公開する（完了！）</span>
          </li>
        </ul>
      </div>
    </div>
  );
}
