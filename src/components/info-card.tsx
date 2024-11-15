import { InfoIcon } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

type InfoCardProps = {
  title: string
  description: string
}

export function InfoCard({ title, description }: InfoCardProps) {
  return (
    <Card className="bg-gray-800 bg-opacity-50 backdrop-blur-lg border-none shadow-lg mb-8">
      <CardHeader>
        <CardTitle className="flex items-center text-blue-300">
          <InfoIcon className="w-6 h-6 mr-2" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-gray-300">{description}</p>
      </CardContent>
    </Card>
  )
}