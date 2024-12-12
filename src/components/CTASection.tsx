import { Button } from "@/components/ui/button"
import { ChevronRight } from 'lucide-react'
import Link from 'next/link'

export function CTASection() {
  return (
    <section className="py-20 bg-indigo-900 text-white rounded-3xl my-20">
      <div className="text-center mb-16">
        <h2 className="text-4xl font-bold mb-4">Ready to Revolutionize Your Learning?</h2>
        <p className="text-xl text-indigo-200 mb-8">Join thousands of learners who have already transformed their educational journey with Drona.AI.</p>
        <Link href="/create">
          <Button 
            className="bg-white text-indigo-900 hover:bg-indigo-100 transition-all duration-300 transform hover:scale-105 text-lg px-8 py-3" 
          >
            Start Your Journey Now <ChevronRight className="ml-2 h-5 w-5"/>
          </Button>
        </Link>
      </div>
    </section>
  )
}

