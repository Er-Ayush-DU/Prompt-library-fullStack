import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"

export default async function Dashboard() {
  const session = await getServerSession()

  if (!session) redirect("/login")

  return <h1 className="text-2xl">Welcome {session.user?.name} 🎉</h1>
}
