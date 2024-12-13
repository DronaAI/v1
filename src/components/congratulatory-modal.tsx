import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { CheckCircle } from 'lucide-react'

type CongratulatoryModalProps = {
  isOpen: boolean
  onClose: () => void
  onStartQuiz: () => void
  onViewOtherSection: () => void
  currentSection: "summary" | "keyPoints"
}

export function CongratulatoryModal({
  isOpen,
  onClose,
  onStartQuiz,
  onViewOtherSection,
  currentSection
}: CongratulatoryModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-gray-900/95 border-gray-800 backdrop-blur-xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-white text-center">Congratulations!</DialogTitle>
        </DialogHeader>
        <div className="text-center space-y-4">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto" />
          </motion.div>
          <p className="text-gray-300">
            You've completed the {currentSection === "summary" ? "chapter summary" : "key concepts"}.
            What would you like to do next?
          </p>
          <div className="flex flex-col space-y-2">
            <Button
              onClick={onStartQuiz}
              className="w-full bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white"
            >
              Attempt Quiz
            </Button>
            <Button
              onClick={onViewOtherSection}
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
            >
              View {currentSection === "summary" ? "Key Concepts" : "Summary"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

