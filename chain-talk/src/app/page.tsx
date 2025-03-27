import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">Chain Talk</h1>
        <p className="text-lg text-gray-600 mb-6">
          A real-time multiplayer word chain game. Challenge your friends and test your vocabulary skills!
        </p>
        <div className="flex gap-4">
          <Link href={'/login'} className="btn btn-primary">Play Now</Link>
          <Link href={'/register'} className="btn btn-secondary">Leaderboard</Link>
        </div>
      </div>
    </div>
  );
}
