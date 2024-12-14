import { getAuthSession } from "@/lib/auth"
import { redirect } from "next/navigation"
import { InfoIcon } from 'lucide-react'
import CreateCourseForm from "@/components/CreateCourseForm"
import { checkSubscription } from "@/lib/subscription"

type Props = {}

const CreatePage = async (props: Props) => {
  const session = await getAuthSession()
  if (!session?.user) {
    return redirect("/gallery")
  }
  const isPro = await checkSubscription()

  return (
    <div className="min-h-screen bg-[#0a0b1e]">
      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-20" />
        <div className="absolute inset-0 bg-[url('/noise.png')] opacity-10 mix-blend-soft-light" />
        <div className="absolute top-0 -left-4 w-3/4 h-3/4 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob" />
        <div className="absolute top-0 -right-4 w-3/4 h-3/4 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-2000" />
        <div className="absolute -bottom-8 left-20 w-3/4 h-3/4 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-4000" />
      </div>

      {/* Main Content */}
      <div className="relative flex flex-col items-center max-w-xl px-8 mx-auto pt-24 pb-16">
        <h1 className="text-4xl sm:text-6xl font-bold text-center bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent tracking-tight mb-12">
          Learning Journey
        </h1>

        <div className="w-full p-6 rounded-2xl bg-white/5 backdrop-blur-lg border border-white/10 mb-8">
          <div className="flex gap-4">
            <div className="flex-shrink-0">
              <InfoIcon className="w-6 h-6 text-blue-400" />
            </div>
            <div className="text-base text-white/80 leading-relaxed">
              Enter in a course title, or what you want to learn about. Then enter a
              list of units, which are the specifics you want to learn. And our AI
              will generate a course for you!
            </div>
          </div>
        </div>

        <CreateCourseForm isPro={isPro} />
      </div>
    </div>
  )
}

export default CreatePage

