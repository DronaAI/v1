import { FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Plus, Trash } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

type CourseUnitsProps = {
  control: any
  units: string[]
  setUnits: React.Dispatch<React.SetStateAction<string[]>>
}

export function CourseUnits({ control, units, setUnits }: CourseUnitsProps) {
  return (
    <div className="space-y-4">
      <AnimatePresence>
        {units.map((_, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
          >
            <FormField
              control={control}
              name={`units.${index}`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xl text-blue-300">Unit {index + 1}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter subtopic of the course"
                      className="bg-gray-800 bg-opacity-50 border-gray-700 text-white"
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </motion.div>
        ))}
      </AnimatePresence>
      <div className="flex items-center justify-center mt-4">
        <Separator className="flex-1" />
        <div className="mx-4 space-x-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => setUnits([...units, ""])}
            className="bg-blue-500 hover:bg-blue-600 text-white"
          >
            Add Unit
            <Plus className="w-4 h-4 ml-2" />
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => setUnits(units.slice(0, -1))}
            className="bg-red-500 hover:bg-red-600 text-white"
          >
            Remove Unit
            <Trash className="w-4 h-4 ml-2" />
          </Button>
        </div>
        <Separator className="flex-1" />
      </div>
    </div>
  )
}