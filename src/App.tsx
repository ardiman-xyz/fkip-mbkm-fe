import { Button } from "@/components/ui/button"

function App() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center bg-gray-50 p-8">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-6 mb-6">
        <h1 className="text-2xl font-bold mb-2 text-center">MBKM FKIP</h1>
        <p className="text-gray-700 text-center mb-4">
          Pendaftaran MBKM FKIP telah dibuka! Silakan login untuk melakukan pendaftaran dan melihat informasi lebih lanjut.
        </p>
      </div>
      <Button className="w-40">Login</Button>
    </div>
  )
}

export default App