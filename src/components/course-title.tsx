import { FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form"
import { Input } from "@/components/ui/input"

export function CourseTitle({ control }: { control: any }) {
  return (
    <FormField
      control={control}
      name="title"
      render={({ field }) => (
        <FormItem>
          <FormLabel className="text-xl text-blue-300">Course Title</FormLabel>
          <FormControl>
            <Input
              placeholder="Enter the main topic of the course"
              className="bg-gray-800 bg-opacity-50 border-gray-700 text-white"
              {...field}
            />
          </FormControl>
        </FormItem>
      )}
    />
  )
}